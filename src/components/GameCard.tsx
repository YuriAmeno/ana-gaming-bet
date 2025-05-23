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

  const getTimeUntilGame = () => {
    const now = new Date()
    const gameTime = new Date(game.startTime)
    const diffMs = gameTime.getTime() - now.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    if (diffHours < 0) {
      return { status: "LIVE", color: "bg-red-500", textColor: "text-white", pulse: true }
    } else if (diffHours < 2) {
      return { status: "Em breve", color: "bg-orange-500", textColor: "text-white", pulse: false }
    } else if (diffHours < 24) {
      return { status: "Hoje", color: "bg-green-500", textColor: "text-white", pulse: false }
    } else {
      return { status: "Futuro", color: "bg-blue-500", textColor: "text-white", pulse: false }
    }
  }

  const timeStatus = getTimeUntilGame()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{
        y: -5,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        transition: { duration: 0.3 },
      }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <span className="text-xl">⚽</span>
              </div>
              <div>
                <div className="text-sm text-blue-200">{game.category}</div>
                <div className="text-xs text-blue-300">{game.league}</div>
              </div>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${timeStatus.color} ${timeStatus.textColor} ${timeStatus.pulse ? 'animate-pulse' : ''}`}>
              {timeStatus.status}
            </div>
          </div>

          <Link href={`/odds/${game.id}`} onClick={handleOddsClick}>
            <motion.h3
              className="text-2xl font-bold hover:text-blue-200 cursor-pointer transition-colors"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {game.name}
            </motion.h3>
          </Link>

          <div className="mt-3 text-blue-200 text-sm">
            📅 {new Date(game.startTime).toLocaleString("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-800">🎯 Melhores Odds</h4>
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {game.bestOdds.length} opções
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {game.bestOdds.slice(0, 3).map((odd, oddIndex) => (
              <motion.div
                key={odd.id}
                className="relative group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + oddIndex * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 group-hover:border-blue-300 group-hover:shadow-lg transition-all duration-200">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2 font-medium">{odd.name}</div>
                    <motion.div
                      className="text-2xl font-bold text-blue-600 mb-2"
                      whileHover={{ scale: 1.1 }}
                    >
                      {odd.value.toFixed(2)}
                    </motion.div>
                    <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md">
                      {odd.provider}
                    </div>
                  </div>
                  
                  {oddIndex === 0 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      🥇 Top
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="border-t border-gray-100 pt-4"
          whileHover={{ backgroundColor: "#f8fafc" }}
          transition={{ duration: 0.2 }}
        >
          <Link
            href={`/odds/${game.id}`}
            onClick={handleOddsClick}
            className="group block w-full"
          >
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:border-blue-200 transition-all duration-200">
              <div className="flex items-center space-x-3">
                {isNavigating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
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
                    <span className="text-blue-600 font-semibold">Carregando...</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">📊</span>
                    <div>
                      <div className="text-blue-700 font-bold text-lg">Ver Análise Completa</div>
                      <div className="text-blue-600 text-sm">Comparar odds • Estatísticas • Mercados</div>
                    </div>
                  </>
                )}
              </div>
              
              <motion.div
                className="text-blue-600"
                animate={{ x: isNavigating ? 0 : [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            </div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
