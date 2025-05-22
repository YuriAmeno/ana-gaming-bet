"use client"

import { useState, useMemo, useCallback } from "react"
import { Game, SportCategory } from "@/types"
import CategoryCard from "@/components/CategoryCard"
import CategoryFilters from "@/components/CategoryFilters"
import GameCard from "@/components/GameCard"
import SortControls from "@/components/SortControls"
import DraggableFavorites from "@/components/DraggableFavorites"
import { useSortedData, SortOption, SortDirection } from "@/hooks/useSortedData"
import { useFavorites } from "@/contexts/FavoritesContext"
import Onboarding from '@/components/Onboarding'

interface DashboardClientProps {
  initialCategories: SportCategory[]
  initialGames: Game[]
}

export default function DashboardClient({ initialCategories, initialGames }: DashboardClientProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
  
  const { favoriteCategories } = useFavorites()

  const filteredGames = useMemo(() => {
    if (selectedCategories.length === 0 && !showOnlyFavorites) {
      return initialGames
    }
    
    let filtered = initialGames
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((game) =>
        selectedCategories.some((categoryId) => {
          const category = initialCategories.find((cat) => cat.id === categoryId)
          return category && game.category.toLowerCase().includes(category.name.toLowerCase())
        }),
      )
    }
    
    if (showOnlyFavorites) {
      filtered = filtered.filter((game) =>
        favoriteCategories.some((favId) => {
          const category = initialCategories.find((cat) => cat.id === favId)
          return category && game.category.toLowerCase().includes(category.name.toLowerCase())
        }),
      )
    }
    
    return filtered
  }, [initialGames, selectedCategories, initialCategories, showOnlyFavorites, favoriteCategories])

  const { sortedGames, sortedCategories, gameStats } = useSortedData({
    games: filteredGames,
    categories: initialCategories,
    favoriteCategories,
    sortBy,
    sortDirection
  })

  const handleFilterChange = useCallback((categoryIds: string[]) => {
    setSelectedCategories(categoryIds)
    setShowOnlyFavorites(false)
  }, [])

  const handleSortChange = useCallback((newSortBy: SortOption, newDirection: SortDirection) => {
    setSortBy(newSortBy)
    setSortDirection(newDirection)
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
    <div className="space-y-8">
      <Onboarding />
      
      <section id="categories-section">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Categorias de Esportes</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {sortedCategories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={handleCategoryClick}
              index={index}
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1" id="favorites-panel">
          <DraggableFavorites categories={initialCategories} />
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtros Rápidos</h3>
            <CategoryFilters
              categories={initialCategories}
              selectedCategories={selectedCategories}
              onFilterChange={handleFilterChange}
            />
            
            <div className="mt-4 pt-4 border-t">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyFavorites}
                  onChange={(e) => setShowOnlyFavorites(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  🌟 Mostrar apenas jogos de categorias favoritas
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div id="sort-controls">
        <SortControls
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          gameStats={gameStats}
        />
      </div>

      <section id="games-section">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {selectedCategories.length > 0 || showOnlyFavorites
              ? `Jogos Filtrados (${sortedGames.length})`
              : `Todos os Jogos (${sortedGames.length})`
            }
          </h2>
          {(selectedCategories.length > 0 || showOnlyFavorites) && (
            <button
              onClick={() => {
                setSelectedCategories([])
                setShowOnlyFavorites(false)
              }}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Limpar todos os filtros
            </button>
          )}
        </div>

        {sortedGames.length > 0 ? (
          <div className="space-y-6">
            {sortedGames.map((game, index) => (
              <GameCard
                key={game.id}
                game={game}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum jogo encontrado</h3>
            <p className="text-gray-600">
              {selectedCategories.length > 0 || showOnlyFavorites
                ? "Tente ajustar os filtros ou selecionar outras categorias."
                : "Não há jogos disponíveis no momento."}
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
