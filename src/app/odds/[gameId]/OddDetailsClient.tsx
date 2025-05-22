
"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { DetailedGame, MarketData } from "@/types"
import { useFavorites } from "@/contexts/FavoritesContext"

interface OddDetailsClientProps {
  game: DetailedGame
}

export default function OddDetailsClient({ game }: OddDetailsClientProps) {
  const [selectedMarket, setSelectedMarket] = useState(0)
  const { isFavorite, toggleFavorite } = useFavorites()

  const gameCategory = game.category.toLowerCase().replace(/\s+/g, "_")
  const isGameCategoryFavorite = isFavorite(gameCategory)

  const marketStats = useMemo(() => {
    return game.allMarkets.map((market) => {
      const totalBookmakers = market.bookmakers.length
      const avgOdds =
        market.bookmakers.reduce((acc, bookmaker) => {
          const odds = bookmaker.outcomes.map((outcome) => outcome.price)
          const avg = odds.reduce((sum, odd) => sum + odd, 0) / odds.length
          return acc + avg
        }, 0) / totalBookmakers

      return {
        ...market,
        totalBookmakers,
        avgOdds,
      }
    })
  }, [game.allMarkets])

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(date)
  }

  const getGameStatus = () => {
    const now = new Date()
    const gameTime = new Date(game.startTime)
    const diffMs = gameTime.getTime() - now.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    if (diffHours < 0) {
      return { status: "Em andamento ou finalizado", color: "text-red-600", bg: "bg-red-50" }
    } else if (diffHours < 2) {
      return { status: "Começando em breve", color: "text-orange-600", bg: "bg-orange-50" }
    } else if (diffHours < 24) {
      return { status: "Hoje", color: "text-green-600", bg: "bg-green-50" }
    } else {
      return { status: "Futuro", color: "text-blue-600", bg: "bg-blue-50" }
    }
  }

  const gameStatus = getGameStatus()

  return (
    <div className="space-y-8">
      <nav className="text-sm text-gray-600">
        <Link href="/dashboard" className="hover:text-blue-600">
          Dashboard
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">Detalhes da Odd</span>
      </nav>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{game.name}</h1>
              <button
                onClick={() => toggleFavorite(gameCategory)}
                className={`p-2 rounded-full transition-colors ${
                  isGameCategoryFavorite
                    ? "text-yellow-500 bg-yellow-100 hover:bg-yellow-200"
                    : "text-gray-400 bg-gray-100 hover:bg-gray-200"
                }`}
                title={
                  isGameCategoryFavorite
                    ? "Remover categoria dos favoritos"
                    : "Adicionar categoria aos favoritos"
                }
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={isGameCategoryFavorite ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>🏆 {game.league}</span>
              <span>⚽ {game.category}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${gameStatus.bg} ${gameStatus.color}`}
              >
                {gameStatus.status}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-lg font-semibold text-gray-800">
                📅 {formatDateTime(new Date(game.startTime))}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-3">Melhores Odds (1X2)</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              {game.bestOdds.slice(0, 3).map((odd) => (
                <div key={odd.id} className="p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500 mb-1">{odd.name}</div>
                  <div className="text-lg font-bold text-blue-600">{odd.value.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="border-b bg-gray-50 p-4">
          <h2 className="text-xl font-semibold text-gray-800">Mercados de Apostas</h2>
          <p className="text-sm text-gray-600 mt-1">
            Compare odds de{" "}
            {game.allMarkets.reduce((total, market) => total + market.bookmakers.length, 0)} casas
            de apostas
          </p>
        </div>

        <div className="border-b">
          <nav className="flex overflow-x-auto">
            {marketStats.map((market, index) => (
              <button
                key={market.key}
                onClick={() => setSelectedMarket(index)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  selectedMarket === index
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="text-center">
                  <div>{market.name}</div>
                  <div className="text-xs text-gray-500">{market.totalBookmakers} casas</div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {game.allMarkets[selectedMarket] ? (
            <MarketDisplay market={game.allMarkets[selectedMarket]} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📊</div>
              <p>Nenhum mercado disponível</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MarketDisplay({ market }: { market: MarketData }) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">{market.name}</h3>
        <p className="text-sm text-gray-600">{market.description}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                Casa de Apostas
              </th>
              {market.bookmakers[0]?.outcomes.map((outcome, index) => (
                <th
                  key={index}
                  className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700"
                >
                  {outcome.name}
                </th>
              ))}
              <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
                Atualizado
              </th>
            </tr>
          </thead>
          <tbody>
            {market.bookmakers.map((bookmaker, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">
                  {bookmaker.name}
                </td>
                {bookmaker.outcomes.map((outcome, outcomeIndex) => (
                  <td key={outcomeIndex} className="border border-gray-200 px-4 py-3 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {outcome.price.toFixed(2)}
                    </span>
                  </td>
                ))}
                <td className="border border-gray-200 px-4 py-3 text-center text-xs text-gray-500">
                  {new Date(bookmaker.lastUpdate).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
