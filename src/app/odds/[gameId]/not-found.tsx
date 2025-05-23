import Link from "next/link"
import Header from "@/components/layout/Header"

export default function OddNotFound() {
  return (
    <>
      <Header />
      <div className="container mx-auto mt-6 p-4 sm:p-6 lg:p-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Odd não encontrada</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            O jogo que você está procurando não existe ou não está mais disponível.
          </p>
          <div className="space-x-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Voltar ao Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              🔍 Explorar Jogos
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
