"use client"

import { useState, useMemo, useCallback } from "react"
import { Game, SportCategory } from "@/types"
import CategoryCard from "@/components/CategoryCard"
import CategoryFilters from "@/components/CategoryFilters"
import Link from "next/link"

interface DashboardClientProps {
  initialCategories: SportCategory[]
  initialGames: Game[]
}

export default function DashboardClient({ initialCategories, initialGames }: DashboardClientProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const filteredGames = useMemo(() => {
    if (selectedCategories.length === 0) {
      return initialGames
    }

    return initialGames.filter((game) =>
      selectedCategories.some((categoryId) => {
        const category = initialCategories.find((cat) => cat.id === categoryId)
        return category && game.category.toLowerCase().includes(category.name.toLowerCase())
      }),
    )
  }, [initialGames, selectedCategories, initialCategories])

  const handleFilterChange = useCallback((categoryIds: string[]) => {
    setSelectedCategories(categoryIds)
  }, [])

  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      if (selectedCategories.includes(categoryId)) {
        setSelectedCategories((prev) => prev.filter((id) => id !== categoryId))
      } else {
        setSelectedCategories((prev) => [...prev, categoryId])
      }
    },
    [selectedCategories],
  )

  return (
    <>
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Categorias de Esportes</h2>

        <CategoryFilters
          categories={initialCategories}
          selectedCategories={selectedCategories}
          onFilterChange={handleFilterChange}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {initialCategories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={handleCategoryClick}
              index={index}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {selectedCategories.length > 0
              ? `Jogos Filtrados (${filteredGames.length})`
              : `Todos os Jogos (${filteredGames.length})`}
          </h2>
          {selectedCategories.length > 0 && (
            <button
              onClick={() => setSelectedCategories([])}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {filteredGames.length > 0 ? (
          <div className="space-y-6">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
                    <Link href={`/odds/${game.id}`}>
                      <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 cursor-pointer">
                        {game.name}
                      </h3>
                    </Link>
                    <span className="text-xs text-gray-500 mt-1 sm:mt-0 bg-gray-100 px-2 py-1 rounded">
                      {game.league}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Esporte: {game.category}</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Início:{" "}
                    <span className="font-semibold">
                      {new Date(game.startTime).toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </p>

                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Odds Principais:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                      {game.bestOdds.slice(0, 3).map((odd) => (
                        <div
                          key={odd.id}
                          className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <span className="block text-sm text-gray-500">{odd.name}</span>
                          <span className="block text-lg font-bold text-blue-600">
                            {odd.value.toFixed(2)}
                          </span>
                          <span className="block text-xs text-gray-400">{odd.provider}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3 text-right">
                  <Link
                    href={`/odds/${game.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Ver todas as odds &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum jogo encontrado</h3>
            <p className="text-gray-600">
              {selectedCategories.length > 0
                ? "Tente ajustar os filtros ou selecionar outras categorias."
                : "Não há jogos disponíveis no momento."}
            </p>
          </div>
        )}
      </section>
    </>
  )
}
