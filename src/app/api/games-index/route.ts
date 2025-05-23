import { NextResponse } from "next/server"
import type { Game } from "@/types"
import type { TheOddsApiGame } from "@/types/odd"

const API_KEY = process.env.ODDS_API_KEY
const BASE_URL = "https://api.the-odds-api.com/v4"

const gamesCache: { [gameId: string]: { data: Game; timestamp: number } } = {}

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json({ error: "API key ausente" }, { status: 500 })
  }

  try {
    const allGames: { [gameId: string]: Game } = {}
    
    const popularSports = [
      "soccer_epl",
      "soccer_brazil_campeonato", 
      "basketball_nba",
      "americanfootball_nfl",
    ]

    const promises = popularSports.map(async (sport) => {
      try {
        const response = await fetch(`${BASE_URL}/sports/${sport}/odds?apiKey=${API_KEY}&regions=us&markets=h2h`, {
          next: { revalidate: 300 }
        })
        
        if (response.ok) {
          const games: TheOddsApiGame[] = await response.json()
          return games.map((game: TheOddsApiGame) => ({
            id: game.id,
            name: `${game.home_team} vs ${game.away_team}`,
            startTime: new Date(game.commence_time),
            category: game.sport_title,
            league: game.sport_title,
            homeTeam: game.home_team,
            awayTeam: game.away_team,
            sportKey: sport,
            bookmakers: game.bookmakers as unknown as Game['bookmakers'],
            bestOdds: game.bookmakers[0]?.markets[0]?.outcomes.slice(0, 3).map((outcome, index: number) => ({
              id: `${game.id}-${index}`,
              name: outcome.name,
              value: outcome.price,
              provider: game.bookmakers[0]?.title || 'N/A',
              bookmaker: game.bookmakers[0] as unknown as Game['bestOdds'][0]['bookmaker'],
              outcome: outcome as unknown as Game['bestOdds'][0]['outcome']
            })) || []
          }))
        }
        return []
      } catch (error) {
        console.error(`Erro ao buscar ${sport}:`, error)
        return []
      }
    })

    const results = await Promise.all(promises)
    results.flat().forEach(game => {
      allGames[game.id] = game
      gamesCache[game.id] = {
        data: game,
        timestamp: Date.now()
      }
    })

    return NextResponse.json(allGames)
  } catch (error) {
    console.error("Erro ao criar índice:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
