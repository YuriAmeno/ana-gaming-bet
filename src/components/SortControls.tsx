"use client"

import { motion } from "framer-motion"
import { SortOption, SortDirection } from "@/hooks/useSortedData"

interface SortControlsProps {
  sortBy: SortOption
  sortDirection: SortDirection
  onSortChange: (sortBy: SortOption, direction: SortDirection) => void
  gameStats: {
    totalGames: number
    categoriesWithGames: number
    avgOdds: string
    favoriteCategories: number
  }
}

export default function SortControls({
  sortBy,
  sortDirection,
  onSortChange,
  gameStats,
}: SortControlsProps) {
  const sortOptions: { value: SortOption; label: string; icon: string }[] = [
    { value: "date", label: "Data", icon: "📅" },
    { value: "name", label: "Nome", icon: "🔤" },
    { value: "category", label: "Categoria", icon: "🏷️" },
    { value: "odds", label: "Melhores Odds", icon: "📊" },
    { value: "favorites", label: "Favoritos", icon: "⭐" },
  ]

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border p-4 mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{gameStats.totalGames}</div>
          <div className="text-xs text-gray-500">Total de Jogos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{gameStats.categoriesWithGames}</div>
          <div className="text-xs text-gray-500">Categorias Ativas</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{gameStats.avgOdds}</div>
          <div className="text-xs text-gray-500">Odd Média</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{gameStats.favoriteCategories}</div>
          <div className="text-xs text-gray-500">Favoritos</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Ordenar por:</span>

        {sortOptions.map((option) => (
          <motion.button
            key={option.value}
            onClick={() =>
              onSortChange(
                option.value,
                sortBy === option.value && sortDirection === "asc" ? "desc" : "asc",
              )
            }
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              sortBy === option.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{option.icon}</span>
            <span>{option.label}</span>
            {sortBy === option.value && (
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: sortDirection === "desc" ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ↑
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
