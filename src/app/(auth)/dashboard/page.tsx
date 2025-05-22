// src/app/(auth)/dashboard/page.tsx
import { Game, SportCategory } from "@/types";
import Header from "@/components/layout/Header"; 
import DashboardClient from "./DashboardClient";


async function getHomePageData(): Promise<{ categories: SportCategory[]; games: Game[] }> {
  try {
    const baseUrl = process.env.APP_URL || "http://localhost:3000"

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


export default async function DashboardPage() {
  const { categories, games } = await getHomePageData();
 return (
   <>
     <Header />
     <div className="container mx-auto mt-6 p-4 sm:p-6 lg:p-8">
       <DashboardClient initialCategories={categories} initialGames={games} />
     </div>
   </>
 )
}