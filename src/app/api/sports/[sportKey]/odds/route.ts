import { NextResponse } from "next/server"
import type { Game, Odd } from "@/types"
import type { TheOddsApiGame } from "@/types/odd"
const API_KEY = process.env.ODDS_API_KEY
const BASE_URL = "https://api.the-odds-api.com/v4"



export async function GET(
  request: Request,
  { params }: { params: Promise<{ sportKey: string }> },
) {
  const { searchParams } = new URL(request.url)
  const { sportKey } = await params
  const regions = searchParams.get("regions") || "us"
  const markets = searchParams.get("markets") || "h2h"
  const dateFormat = searchParams.get("dateFormat") || "iso"
  const oddsFormat = searchParams.get("oddsFormat") || "decimal"

  if (!API_KEY) {
    return NextResponse.json({ error: "Configuração de API ausente no servidor." }, { status: 500 })
  }

  if (!sportKey) {
    return NextResponse.json({ error: "Parâmetro sportKey é obrigatório." }, { status: 400 })
  }

  try {
     const apiUrl = `${BASE_URL}/sports/${sportKey}/odds?apiKey=${API_KEY}&regions=${regions}&markets=${markets}&dateFormat=${dateFormat}&oddsFormat=${oddsFormat}`

     const response = await fetch(apiUrl, {
       next: { revalidate: 600 },
     })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        {
          error: `Falha ao buscar odds da API externa para ${sportKey}: ${errorData.message || response.statusText}`,
          external_api_status: response.status,
          external_api_response: errorData,
        },
        { status: response.status },
      )
    }
    const gamesData: TheOddsApiGame[] = await response.json()

    const games: Game[] = gamesData.map((game) => {
      const gameName = `${game.home_team} vs ${game.away_team}`
      let bestOdds: Odd[] = []

      game.bookmakers.forEach((bookmaker) => {
        const h2hMarket = bookmaker.markets.find((market) => market.key === markets)
        if (h2hMarket) {
          h2hMarket.outcomes.forEach((outcome) => {
            bestOdds.push({
              id: `${game.id}-${bookmaker.key}-${outcome.name.replace(/\s+/g, "")}`,
              name: outcome.name,
              value: outcome.price,
              provider: bookmaker.title,
              bookmaker: bookmaker as unknown as Game['bestOdds'][0]['bookmaker'],
              outcome: outcome as unknown as Game['bestOdds'][0]['outcome']
            })
          })
        }
      })
      bestOdds = bestOdds.slice(0, 3)

      return {
        id: game.id,
        name: gameName,
        startTime: new Date(game.commence_time),
        category: game.sport_title,
        league: game.sport_title,
        homeTeam: game.home_team,
        awayTeam: game.away_team,
        sportKey: sportKey,
        sportTitle: game.sport_title,
        commenceTime: new Date(game.commence_time),
        bookmakers: game.bookmakers as unknown as Game['bookmakers'],
        bestOdds: bestOdds,
      }
    })

    return NextResponse.json(games)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor"
    return NextResponse.json(
      { error: `Erro ao processar a requisição de odds para ${sportKey}.`, details: errorMessage },
      { status: 500 },
    )
  }
}
