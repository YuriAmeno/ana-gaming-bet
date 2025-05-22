// src/app/api/games/[gameId]/route.ts
import { NextResponse } from "next/server"
import type { Game, MarketData, Odd, OutcomeData } from "@/types"
import type { TheOddsApiGame } from "@/types/odd"

const API_KEY = process.env.ODDS_API_KEY
const BASE_URL = "https://api.the-odds-api.com/v4"

export async function GET(request: Request, { params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params
  const { searchParams } = new URL(request.url)
  const regions = searchParams.get("regions") || "us"

  if (!API_KEY) {
    return NextResponse.json({ error: "Configuração de API ausente no servidor." }, { status: 500 })
  }

  if (!gameId) {
    return NextResponse.json({ error: "ID do jogo ausente na solicitação." }, { status: 400 })
  }

  try {
    const markets = ["h2h", "spreads", "totals"]
    let gameFound: TheOddsApiGame | null = null

    const commonSports = [
      "soccer_epl",
      "soccer_spain_la_liga",
      "soccer_brazil_campeonato",
      "basketball_nba",
      "americanfootball_nfl",
      "tennis_atp",
    ]

    for (const sport of commonSports) {
      try {
        for (const market of markets) {
          const apiUrl = `${BASE_URL}/sports/${sport}/odds?apiKey=${API_KEY}&regions=${regions}&markets=${market}`
          const response = await fetch(apiUrl, {
            next: { revalidate: 300 },
          })

          if (response.ok) {
            const gamesData: TheOddsApiGame[] = await response.json()
            const foundGame = gamesData.find((game: TheOddsApiGame) => game.id === gameId)

            if (foundGame) {
              gameFound = foundGame
              break
            }
          }
        }
        if (gameFound) break
      } catch (error) {
        console.error(`Erro ao buscar dados da API para ${sport}:`, error)
        continue
      }
    }

    if (!gameFound) {
      return NextResponse.json({ error: "Jogo não encontrado." }, { status: 404 })
    }

    const detailedGame = await fetchDetailedGameData(gameFound)
    return NextResponse.json(detailedGame)
  } catch (error) {
    console.error(`Erro na API Route /api/games/${gameId}:`, error)
    const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor"
    return NextResponse.json(
      {
        error: `Erro ao processar a requisição de detalhes para ${gameId}.`,
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}

async function fetchDetailedGameData(
  game: TheOddsApiGame,
): Promise<Game & { allMarkets: MarketData[] }> {
  const gameName = `${game.home_team} vs ${game.away_team}`
  const marketData: MarketData[] = []

  game.bookmakers.forEach((bookmaker) => {
    bookmaker.markets.forEach((market) => {
      const existingMarket = marketData.find((m) => m.key === market.key)

      if (existingMarket) {
        existingMarket.bookmakers.push({
          name: bookmaker.title,
          outcomes: market.outcomes,
          lastUpdate: market.last_update,
        })
      } else {
        marketData.push({
          key: market.key,
          name: getMarketDisplayName(market.key),
          description: getMarketDescription(market.key),
          bookmakers: [
            {
              name: bookmaker.title,
              outcomes: market.outcomes,
              lastUpdate: market.last_update,
            },
          ],
        })
      }
    })
  })

  let bestOdds: Odd[] = []
  const h2hMarket = marketData.find((market) => market.key === "h2h")
  if (h2hMarket && h2hMarket.bookmakers.length > 0) {
    const firstBookmaker = h2hMarket.bookmakers[0]
    bestOdds = firstBookmaker.outcomes.map((outcome: OutcomeData) => ({
      id: `${game.id}-${outcome.name.replace(/\s+/g, "")}`,
      name: outcome.name,
      value: outcome.price,
      provider: firstBookmaker.name,
    }))
  }

  return {
    id: game.id,
    name: gameName,
    startTime: new Date(game.commence_time),
    category: game.sport_title,
    league: game.sport_title,
    bestOdds: bestOdds,
    homeTeam: game.home_team,
    awayTeam: game.away_team,
    sportKey: game.sport_key,
    allMarkets: marketData,
  }
}

function getMarketDisplayName(marketKey: string): string {
  const marketNames: Record<string, string> = {
    h2h: "Resultado Final (1X2)",
    spreads: "Handicap",
    totals: "Total de Gols/Pontos",
    outrights: "Vencedor do Torneio",
  }
  return marketNames[marketKey] || marketKey
}

function getMarketDescription(marketKey: string): string {
  const descriptions: Record<string, string> = {
    h2h: "Aposte no resultado final da partida - Vitória do time da casa, empate ou vitória do visitante.",
    spreads: "Aposte considerando um handicap de pontos/gols aplicado a um dos times.",
    totals: "Aposte se o total de gols/pontos será acima ou abaixo de um valor específico.",
    outrights: "Aposte no vencedor geral do campeonato ou torneio.",
  }
  return descriptions[marketKey] || "Mercado de apostas específico."
}
