import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { FavoriteContextType } from "@/types/favorites"

const FavoritesContext = createContext<FavoriteContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteCategories, setFavoriteCategories] = useState<string[]>([])

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteCategories")
    if (storedFavorites) {
      try {
        const parsed = JSON.parse(storedFavorites)
        setFavoriteCategories(Array.isArray(parsed) ? parsed : [])
      } catch (error) {
        console.error("Erro ao carregar categorias favoritas:", error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("favoriteCategories", JSON.stringify(favoriteCategories))
  }, [favoriteCategories])

  const toggleFavorite = useCallback((categoryId: string) => {
    setFavoriteCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }, [])

  const isFavorite = useCallback(
    (categoryId: string) => {
      return favoriteCategories.includes(categoryId)
    },
    [favoriteCategories],
  )

  const clearFavorites = useCallback(() => {
    setFavoriteCategories([])
  }, [])

  const hasFavorites = useMemo(() => {
    return favoriteCategories.length > 0
  }, [favoriteCategories])

  const value = useMemo(
    () => ({
      favoriteCategories,
      toggleFavorite,
      isFavorite,
      clearFavorites,
      hasFavorites,
    }),
    [favoriteCategories, toggleFavorite, isFavorite, clearFavorites, hasFavorites],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites deve ser usado dentro de um FavoritesProvider")
  }
  return context
}