import { NextResponse } from "next/server"
import type { SportCategory } from "@/types"

const API_KEY = process.env.ODDS_API_KEY
const BASE_URL = "https://api.the-odds-api.com/v4"

interface TheOddsApiSport {
  key: string
  group: string
  title: string
  description: string
  active: boolean
  has_outrights?: boolean
}

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json({ error: "Configuração de API ausente no servidor." }, { status: 500 })
  }

  try {
    const response = await fetch(`${BASE_URL}/sports?apiKey=${API_KEY}`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: `Falha ao buscar esportes: ${errorData.message || response.statusText}` },
        { status: response.status },
      )
    }
    const sportsData: TheOddsApiSport[] = await response.json()

    const categories: SportCategory[] = sportsData
      .filter((sport) => sport.active)
      .map((sport) => ({
        id: sport.key,
        name: sport.title,
      }))

    return NextResponse.json(categories)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor"
    return NextResponse.json(
      { error: "Erro ao processar a requisição de esportes.", details: errorMessage },
      { status: 500 },
    )
  }
}
