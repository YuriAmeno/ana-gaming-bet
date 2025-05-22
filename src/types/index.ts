// src/types/index.ts (ou onde estão seus tipos)
export interface SportCategory {
  id: string
  name: string
  icon?: string
}

export interface Odd {
  id: string
  name: string
  value: number
  provider: string
}

export interface Game {
  id: string
  name: string
  startTime: Date
  category: string
  league: string
  bestOdds: Odd[]
  homeTeam?: string
  awayTeam?: string
  sportKey?: string
}

// Novo tipo para dados detalhados da odd
export interface DetailedGame extends Game {
  allMarkets: MarketData[]
}

export interface MarketData {
  key: string
  name: string
  description: string
  bookmakers: BookmakerData[]
}

export interface BookmakerData {
  name: string
  outcomes: OutcomeData[]
  lastUpdate: string
}

export interface OutcomeData {
  name: string
  price: number
}
