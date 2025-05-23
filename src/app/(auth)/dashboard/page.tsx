// src/app/(auth)/dashboard/page.tsx
import { Game, SportCategory } from "@/types";
import Header from "@/components/layout/Header"; 
import DashboardClient from "./DashboardClient";


async function getHomePageData(): Promise<{ categories: SportCategory[]; games: Game[] }> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

    const sportsResponse = await fetch(`${baseUrl}/api/sports`, { cache: "no-store" })
    if (!sportsResponse.ok) {
      throw new Error("Falha ao buscar categorias")
    }
    const allCategories: SportCategory[] = await sportsResponse.json()

    const allGames: Game[] = []

    const soccerCategories = allCategories
      .filter(
        (cat) =>
          cat.id.includes("soccer") &&
          (cat.id.includes("brazil") || cat.id.includes("england") || cat.id.includes("spain")),
      )
      .slice(0, 3)

    for (const category of soccerCategories) {
      try {
       const oddsResponse = await fetch(`${baseUrl}/api/sports/${category.id}/odds?regions=us&markets=h2h`,
          { cache: "no-store" },
        )
        if (oddsResponse.ok) {
          const games: Game[] = await oddsResponse.json()
          allGames.push(...games)
        }
      } catch (error) {
        console.error(`Erro ao buscar odds para ${category.id}:`, error)
      }
    }

    return { categories: allCategories, games: allGames }
  } catch (error) {
    console.error("Erro em getHomePageData:", error)
    return { categories: [], games: [] }
  }
}

async function getGamesFromIndex(): Promise<Game[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/games-index`, {
      cache: 'no-store'
    })
    
    if (response.ok) {
      const gamesIndex = await response.json()
      return Object.values(gamesIndex)
    }
    return []
  } catch (error) {
    console.error("Erro ao buscar índice de jogos:", error)
    return []
  }
}

export default async function DashboardPage() {
  const { categories } = await getHomePageData();
  const gamesFromIndex = await getGamesFromIndex()
 return (
   <>
     <Header />
     <div className="container mx-auto mt-6 p-4 sm:p-6 lg:p-8">
       <DashboardClient initialCategories={categories} initialGames={gamesFromIndex} />
     </div>
   </>
 )
}