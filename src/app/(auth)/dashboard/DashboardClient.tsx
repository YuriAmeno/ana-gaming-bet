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
import { motion } from "framer-motion"

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <Onboarding />
          
          <motion.div 
            className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-left mb-6 lg:mb-0">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  Odds ao Vivo
                  <span className="block text-2xl lg:text-3xl text-blue-200 font-normal mt-2">
                    Compare as melhores cotações
                  </span>
                </h1>
                <p className="text-blue-100 text-lg">
                  Acompanhe odds em tempo real de mais de 100 casas de apostas
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-6 text-center">
                <StatCard number={initialGames.length} label="Jogos Ativos" icon="⚽" />
                <StatCard number={gameStats.totalGames} label="Odds Disponíveis" icon="📊" />
                <StatCard number={initialCategories.length} label="Esportes" icon="🏆" />
              </div>
            </div>
          </motion.div>

          <motion.section 
            id="categories-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Esportes Disponíveis</h2>
                  <p className="text-gray-600 mt-2">Selecione seus esportes favoritos para filtrar</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {sortedCategories.length} esportes
                </div>
              </div>
              
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
            </div>
          </motion.section>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <DraggableFavorites categories={initialCategories} />
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Filtros Inteligentes</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span>Atualizando em tempo real</span>
                  </div>
                </div>
                
                <CategoryFilters
                  categories={initialCategories}
                  selectedCategories={selectedCategories}
                  onFilterChange={handleFilterChange}
                />
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={showOnlyFavorites}
                      onChange={(e) => setShowOnlyFavorites(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-base font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                      ⭐ Mostrar apenas favoritos
                    </span>
                  </label>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            id="sort-controls"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <SortControls
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
                gameStats={gameStats}
              />
            </div>
          </motion.div>

          <motion.section 
            id="games-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {selectedCategories.length > 0 || showOnlyFavorites
                      ? `Jogos Filtrados`
                      : `Todos os Jogos`
                    }
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {sortedGames.length} partidas encontradas
                  </p>
                </div>
                
                {(selectedCategories.length > 0 || showOnlyFavorites) && (
                  <motion.button
                    onClick={() => {
                      setSelectedCategories([])
                      setShowOnlyFavorites(false)
                    }}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🗑️ Limpar Filtros
                  </motion.button>
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
                <EmptyState
                  hasFilters={selectedCategories.length > 0 || showOnlyFavorites}
                />
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}

function StatCard({ number, label, icon }: { number: number; label: string; icon: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-3xl font-bold">{number.toLocaleString()}</div>
      <div className="text-blue-200 text-sm">{label}</div>
    </div>
  )
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <motion.div 
      className="text-center py-16"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-8xl mb-6">
        {hasFilters ? '🔍' : '⚽'}
      </div>
      <h3 className="text-2xl font-bold text-gray-700 mb-4">
        {hasFilters ? 'Nenhum jogo encontrado' : 'Nenhum jogo disponível'}
      </h3>
      <p className="text-gray-600 text-lg max-w-md mx-auto">
        {hasFilters
          ? "Tente ajustar os filtros ou selecionar outras categorias para encontrar mais jogos."
          : "Não há jogos disponíveis no momento. Volte em breve para conferir as próximas partidas!"}
      </p>
    </motion.div>
  )
}
