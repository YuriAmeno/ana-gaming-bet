import { NextResponse } from "next/server"
import type { DetailedGame, MarketData } from "@/types"
import type { TheOddsApiGame } from "@/types/odd"

const API_KEY = process.env.ODDS_API_KEY
const BASE_URL = "https://api.the-odds-api.com/v4"

export async function GET(request: Request, { params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params

  if (!API_KEY) {
    return NextResponse.json({ error: "API key ausente" }, { status: 500 })
  }

  try {
    const indexResponse = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/games-index`,
      {
        cache: 'no-store',
      }
    );
    
    if (indexResponse.ok) {
      const gamesIndex = await indexResponse.json()
      const gameBasicInfo = gamesIndex[gameId]
      
      if (!gameBasicInfo) {
        return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 })
      }

      const detailedResponse = await fetch(
        `${BASE_URL}/sports/${gameBasicInfo.sportKey}/odds?apiKey=${API_KEY}&regions=us&markets=h2h,spreads,totals&eventIds=${gameId}`,
        { next: { revalidate: 300 } }
      )

      if (detailedResponse.ok) {
        const [gameDetail] = await detailedResponse.json()
        
        if (gameDetail) {
          const detailedGame = transformToDetailedGame(gameDetail)
          return NextResponse.json(detailedGame)
        }
      }
    }

    return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 })
  } catch (error) {
    console.error(`Erro ao buscar jogo ${gameId}:`, error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

function transformToDetailedGame(game: TheOddsApiGame): DetailedGame {
  const allMarkets: MarketData[] = []
  
  game.bookmakers.forEach(bookmaker => {
    bookmaker.markets.forEach(market => {
      const existingMarket = allMarkets.find(m => m.key === market.key)
      
      if (existingMarket) {
        existingMarket.bookmakers.push({
          name: bookmaker.title,
          outcomes: market.outcomes,
          lastUpdate: market.last_update
        })
      } else {
        allMarkets.push({
          key: market.key,
          name: getMarketDisplayName(market.key),
          description: getMarketDescription(market.key),
          bookmakers: [{
            name: bookmaker.title,
            outcomes: market.outcomes,
            lastUpdate: market.last_update
          }]
        })
      }
    })
  })

  return {
    id: game.id,
    name: `${game.home_team} vs ${game.away_team}`,
    startTime: new Date(game.commence_time),
    category: game.sport_title,
    league: game.sport_title,
    homeTeam: game.home_team,
    awayTeam: game.away_team,
    sportKey: game.sport_key,
    bookmakers: game.bookmakers as unknown as DetailedGame['bookmakers'],
    bestOdds: game.bookmakers[0]?.markets[0]?.outcomes.slice(0, 3).map((outcome, index: number) => ({
      id: `${game.id}-${index}`,
      name: outcome.name,
      value: outcome.price,
      provider: game.bookmakers[0]?.title || 'N/A',
      bookmaker: game.bookmakers[0] as unknown as DetailedGame['bestOdds'][0]['bookmaker'],
      outcome: outcome as unknown as DetailedGame['bestOdds'][0]['outcome']
    })) || [],
    allMarkets: allMarkets
  }
}

function getMarketDisplayName(marketKey: string): string {
  const marketNames: Record<string, string> = {
    h2h: "Resultado Final (1X2)",
    spreads: "Handicap",
    totals: "Total de Gols/Pontos",
  }
  return marketNames[marketKey] || marketKey
}

function getMarketDescription(marketKey: string): string {
  const descriptions: Record<string, string> = {
    h2h: "Aposte no resultado final da partida",
    spreads: "Aposte considerando um handicap",
    totals: "Aposte se o total será acima ou abaixo",
  }
  return descriptions[marketKey] || "Mercado de apostas específico"
}
