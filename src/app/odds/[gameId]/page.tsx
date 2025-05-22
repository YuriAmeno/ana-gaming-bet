import { notFound } from "next/navigation"
import { DetailedGame } from "@/types"
import Header from "@/components/layout/Header"
import OddDetailsClient from "./OddDetailsClient"

interface OddPageProps {
  params: Promise<{ gameId: string }>
}

async function getOddDetails(gameId: string): Promise<DetailedGame | null> {
  try {
    const baseUrl = process.env.APP_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/games/${gameId}?regions=us`, {
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Erro ao buscar detalhes: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao buscar detalhes da odd:", error)
    return null
  }
}

export default async function OddPage({ params }: OddPageProps) {
  const { gameId } = await params
  const oddDetails = await getOddDetails(gameId)

  if (!oddDetails) {
    notFound()
  }

  return (
    <>
      <Header />
      <div className="container mx-auto mt-6 p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-md">
        <OddDetailsClient game={oddDetails} />
      </div>
    </>
  )
}

export async function generateMetadata({ params }: OddPageProps) {
  const { gameId } = await params
  const oddDetails = await getOddDetails(gameId)

  if (!oddDetails) {
    return {
      title: "Jogo não encontrado - ANA Gaming",
      description: "O jogo solicitado não foi encontrado.",
    }
  }

  return {
    title: `${oddDetails.name} - Odds e Apostas | ANA Gaming`,
    description: `Veja todas as odds e mercados de apostas para ${oddDetails.name}. Compare as melhores cotações de diferentes casas de apostas.`,
  }
}
