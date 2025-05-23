// src/types/index.ts (ou onde estão seus tipos)
export interface SportCategory {
  id: string
  name: string
  icon?: string
}

export interface Outcome {
  id: string
  name: string
  price: number
}

export interface Odd {
  id: string
  name: string
  value: number
  provider: string
  bookmaker: Bookmaker
  outcome: Outcome
}

export interface Bookmaker {
  title: string
  markets: Market[]
}

export interface Market {
  key: string
  name: string
  description: string
  bookmakers: BookmakerData[]
  outcomes: Outcome[]
  last_update: string
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
  sportTitle?: string
  commenceTime?: Date
  bookmakers: Bookmaker[]
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
