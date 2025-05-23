import { notFound } from "next/navigation"
import { DetailedGame } from "@/types"
import Header from "@/components/layout/Header"
import OddDetailsClient from "./OddDetailsClient"
import type { Metadata } from "next"

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

export async function generateMetadata({ params }: OddPageProps): Promise<Metadata> {
  const { gameId } = await params;
  const oddDetails = await getOddDetails(gameId);

  if (!oddDetails) {
    return {
      title: 'Jogo não encontrado',
      description: 'O jogo solicitado não foi encontrado.',
      robots: { index: false, follow: false },
    };
  }

  const bestOdd = Math.min(...oddDetails.bestOdds.map(odd => odd.value));
  
  return {
    title: `${oddDetails.name} - Odds ao Vivo`,
    description: `Acompanhe as odds de ${oddDetails.name} em tempo real. Melhor odd: ${bestOdd.toFixed(2)}. Compare cotações de diferentes casas de apostas.`,
    keywords: [
      oddDetails.homeTeam || '',
      oddDetails.awayTeam || '',
      oddDetails.category || '',
      oddDetails.league || '',
      'odds',
      'apostas',
      'cotações'
    ],
    openGraph: {
      title: `${oddDetails.name} - Odds ao Vivo`,
      description: `Melhor odd: ${bestOdd.toFixed(2)} | ${oddDetails.league}`,
      type: 'article',
      publishedTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
      section: oddDetails.category,
      tags: [oddDetails.homeTeam || '', oddDetails.awayTeam || '', oddDetails.category || ''],
    },
    twitter: {
      card: 'summary',
      title: `${oddDetails.name} - Odds ao Vivo`,
      description: `Melhor odd: ${bestOdd.toFixed(2)}`,
    },
  };
}
