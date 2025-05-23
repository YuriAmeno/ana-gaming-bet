"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Game } from "@/types"
import { useState } from "react"

interface GameCardProps {
  game: Game
  index?: number
}

export default function GameCard({ game, index = 0 }: GameCardProps) {
  const [isNavigating, setIsNavigating] = useState(false)

  const handleOddsClick = () => {
    setIsNavigating(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        transition: { duration: 0.2 },
      }}
      className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="p-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
          <Link href={`/odds/${game.id}`} onClick={handleOddsClick}>
            <motion.h3
              className="text-xl font-bold text-gray-800 hover:text-blue-600 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {game.name}
            </motion.h3>
          </Link>
          <motion.span
            className="text-xs text-gray-500 mt-1 sm:mt-0 bg-gray-100 px-2 py-1 rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {game.league}
          </motion.span>
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
            {game.bestOdds.slice(0, 3).map((odd, oddIndex) => (
              <motion.div
                key={odd.id}
                className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#f8fafc",
                  borderColor: "#3b82f6",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + oddIndex * 0.1 }}
              >
                <span className="block text-sm text-gray-500">{odd.name}</span>
                <motion.span
                  className="block text-lg font-bold text-blue-600"
                  whileHover={{ scale: 1.1 }}
                >
                  {odd.value.toFixed(2)}
                </motion.span>
                <span className="block text-xs text-gray-400">{odd.provider}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        className="bg-gray-50 px-5 py-3 text-right"
        whileHover={{ backgroundColor: "#f1f5f9" }}
      >
        <Link
          href={`/odds/${game.id}`}
          onClick={handleOddsClick}
          className="text-sm text-blue-600 hover:text-blue-800 font-semibold relative"
        >
          <motion.span 
            whileHover={{ x: 5 }} 
            transition={{ type: "spring", stiffness: 400 }}
            className="flex items-center gap-2"
          >
            {isNavigating ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Carregando...
              </>
            ) : (
              <>Ver todas as odds →</>
            )}
          </motion.span>
        </Link>
      </motion.div>
    </motion.div>
  )
}
