// src/hooks/useSortedData.ts
import { useMemo } from "react"
import { orderBy, groupBy } from "lodash"
import { Game, SportCategory } from "@/types"

export type SortOption = "date" | "name" | "category" | "odds" | "favorites"
export type SortDirection = "asc" | "desc"

interface UseSortedDataProps {
  games: Game[]
  categories: SportCategory[]
  favoriteCategories: string[]
  sortBy: SortOption
  sortDirection: SortDirection
}

export function useSortedData({
  games,
  categories,
  favoriteCategories,
  sortBy: sortOption,
  sortDirection,
}: UseSortedDataProps) {
  const sortedGames = useMemo(() => {
    let sorted = [...games]

    switch (sortOption) {
      case "date":
        sorted = orderBy(sorted, ["startTime"], [sortDirection])
        break
      case "name":
        sorted = orderBy(sorted, ["name"], [sortDirection])
        break
      case "category":
        sorted = orderBy(sorted, ["category"], [sortDirection])
        break
      case "odds":
        sorted = orderBy(
          sorted,
          [(game) => Math.min(...game.bestOdds.map((odd) => odd.value))],
          [sortDirection === "asc" ? "desc" : "asc"],
        )
        break
      case "favorites":
        sorted = orderBy(
          sorted,
          [
            (game) =>
              favoriteCategories.some((favId) => {
                const category = categories.find((cat) => cat.id === favId)
                return category && game.category.toLowerCase().includes(category.name.toLowerCase())
              }),
          ],
          ["desc"],
        )
        break
    }

    return sorted
  }, [games, categories, favoriteCategories, sortOption, sortDirection])

  const groupedGames = useMemo(() => {
    return groupBy(sortedGames, "category")
  }, [sortedGames])

  const sortedCategories = useMemo(() => {
    return orderBy(
      categories,
      [
        (cat) => favoriteCategories.includes(cat.id),
        "name",
      ],
      ["desc", "asc"],
    )
  }, [categories, favoriteCategories])

  const gameStats = useMemo(() => {
    const totalGames = games.length
    const categoriesWithGames = Object.keys(groupedGames).length
    const avgOdds =
      games.reduce((acc, game) => {
        const gameAvg =
          game.bestOdds.reduce((sum, odd) => sum + odd.value, 0) / game.bestOdds.length
        return acc + gameAvg
      }, 0) / (games.length || 1)

    return {
      totalGames,
      categoriesWithGames,
      avgOdds: avgOdds.toFixed(2),
      favoriteCategories: favoriteCategories.length,
    }
  }, [games, groupedGames, favoriteCategories])

  return {
    sortedGames,
    groupedGames,
    sortedCategories,
    gameStats,
  }
}
