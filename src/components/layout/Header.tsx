// src/components/layout/Header.tsx
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
// import LogoutButton from "@/components/LogoutButton"

export default async function Header() {
  const session = await getServerSession(authOptions)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link
              href="/dashboard"
              className="text-2xl font-bold text-blue-600 hover:text-blue-700"
            >
              ANA Gaming Bets
            </Link>
          </div>
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700 hidden sm:block">
                  Olá, {session.user?.name || session.user?.email}
                </span>
                {/* <LogoutButton /> */}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="md:hidden bg-gray-100 border-t border-b">
            <nav className="container mx-auto px-4 py-2 flex space-x-4 overflow-x-auto">
              <Link href="#" className="text-gray-700 hover:text-blue-600">Futebol</Link>
              <Link href="#" className="text-gray-700 hover:text-blue-600">Basquete</Link>
              <Link href="#" className="text-gray-700 hover:text-blue-600">Tênis</Link>
            </nav>
          </div> 
    </header>
  )
}
