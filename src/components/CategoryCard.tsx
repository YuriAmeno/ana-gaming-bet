"use client"

import { useFavorites } from "@/contexts/FavoritesContext"
import { SportCategory } from "@/types"
import { useCallback } from "react"
import { motion } from 'framer-motion';

interface ICategoryProps {
    category: SportCategory,
    onClick: (categoryID: string) => void
    index: number
}

export default function CategoryCard({category, onClick, index = 0}: ICategoryProps) {
    const {isFavorite, toggleFavorite} = useFavorites()
    const isCurrentlyFavorite = isFavorite(category.id)


  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      toggleFavorite(category.id)
    },
    [category.id, toggleFavorite],
  )


    const handleCardClick = useCallback(() => {
        onClick(category.id)
    }, [category.id, onClick])


    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: index * 0.1,
          ease: "easeOut",
        }}
        whileHover={{
          scale: 1.05,
          rotateY: 5,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCardClick}
        className={`group p-4 bg-white shadow-lg rounded-lg text-center cursor-pointer hover:shadow-xl transition-all duration-300 border-2 ${
          isCurrentlyFavorite
            ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50"
            : "border-gray-200 hover:border-blue-500"
        }`}
      >
        <div className="flex justify-end mb-2">
          <motion.button
            onClick={handleFavoriteClick}
            whileHover={{ scale: 1.2, rotate: 15 }}
            whileTap={{ scale: 0.8 }}
            className={`p-1 rounded-full transition-all duration-200 ${
              isCurrentlyFavorite
                ? "text-yellow-500 hover:text-yellow-600 hover:bg-yellow-100"
                : "text-gray-400 hover:text-yellow-500 hover:bg-gray-100"
            }`}
            aria-label={isCurrentlyFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isCurrentlyFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              animate={{
                rotate: isCurrentlyFavorite ? [0, -10, 10, -5, 0] : 0,
              }}
              transition={{ duration: 0.6 }}
            >
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
            </motion.svg>
          </motion.button>
        </div>

        <motion.div
          className={`text-5xl mb-3 transition-transform duration-300 ${
            isCurrentlyFavorite ? "scale-105" : ""
          }`}
          whileHover={{
            scale: 1.2,
            rotate: 360,
            transition: { duration: 0.6 },
          }}
        >
          {category.icon || "🏅"}
        </motion.div>

        <h3
          className={`font-medium transition-colors ${
            isCurrentlyFavorite ? "text-yellow-700" : "text-gray-700 group-hover:text-blue-600"
          }`}
        >
          {category.name}
        </h3>

        {isCurrentlyFavorite && (
          <motion.div
            className="mt-2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              ⭐ Favorito
            </span>
          </motion.div>
        )}
      </motion.div>
    )
}
    