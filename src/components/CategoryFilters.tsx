// src/components/CategoryFilters.tsx
"use client"

import { useFavorites } from "@/contexts/FavoritesContext"
import { SportCategory } from "@/types"
import { useMemo } from "react"

interface CategoryFiltersProps {
  categories: SportCategory[]
  selectedCategories: string[]
  onFilterChange: (categoryIds: string[]) => void
}

export default function CategoryFilters({
  categories,
  selectedCategories,
  onFilterChange,
}: CategoryFiltersProps) {
  const { favoriteCategories, hasFavorites, clearFavorites } = useFavorites()

  const favoriteCategs = useMemo(() => {
    return categories.filter((cat) => favoriteCategories.includes(cat.id))
  }, [categories, favoriteCategories])

  const handleShowAll = () => {
    onFilterChange([])
  }

  const handleShowFavorites = () => {
    onFilterChange(favoriteCategories)
  }

  const handleToggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onFilterChange(selectedCategories.filter((id) => id !== categoryId))
    } else {
      onFilterChange([...selectedCategories, categoryId])
    }
  }

  if (!hasFavorites) {
    return (
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-700 text-sm text-center">
          💡 <strong>Dica:</strong> Clique na estrela das categorias para favoritá-las e filtrar
          jogos específicos!
        </p>
      </div>
    )
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleShowAll}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategories.length === 0
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Todos os Jogos
        </button>
        <button
          onClick={handleShowFavorites}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategories.length === favoriteCategories.length &&
            favoriteCategories.every((id) => selectedCategories.includes(id))
              ? "bg-yellow-600 text-white"
              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
          }`}
        >
          ⭐ Apenas Favoritos ({favoriteCategories.length})
        </button>
        <button
          onClick={clearFavorites}
          className="px-4 py-2 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
        >
          🗑️ Limpar Favoritos
        </button>
      </div>

      {favoriteCategs.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Filtrar por categoria favorita:
          </h4>
          <div className="flex flex-wrap gap-2">
            {favoriteCategs.map((category) => (
              <button
                key={category.id}
                onClick={() => handleToggleCategory(category.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategories.includes(category.id)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
