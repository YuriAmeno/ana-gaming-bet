"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signOut } from "next-auth/react"

export default function Header() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.header 
      className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 shadow-xl sticky top-0 z-50 backdrop-blur-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 text-white"
            >
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">ANA Gaming</div>
                <div className="text-xs text-blue-200 -mt-1">Odds & Betting</div>
              </div>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <span className="text-white text-sm font-medium">
                    👋 {session.user?.name?.split(' ')[0] || 'Usuário'}
                  </span>
                </div>
                <motion.button
                  onClick={() => signOut()}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sair
                </motion.button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg text-sm shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Login
              </Link>
            )}
          </div>

          <motion.button
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="py-4 space-y-2 border-t border-white/20">
                <MobileNavLink href="/dashboard" icon="🏠">Dashboard</MobileNavLink>
                <MobileNavLink href="/odds" icon="📊">Live Odds</MobileNavLink>
                <MobileNavLink href="/results" icon="🏆">Resultados</MobileNavLink>
                <MobileNavLink href="/statistics" icon="📈">Estatísticas</MobileNavLink>
                
                {session && (
                  <div className="pt-4 border-t border-white/20">
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left text-red-300 hover:text-red-100 py-2 px-3 rounded-lg transition-colors"
                    >
                      🚪 Sair
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-black/20 backdrop-blur-sm border-t border-white/10">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-center space-x-8 text-xs text-blue-100">
            <span>🔴 <strong>12</strong> Jogos ao Vivo</span>
            <span>⚽ <strong>156</strong> Partidas Hoje</span>
            <span>📊 <strong>2.847</strong> Odds Ativas</span>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

function MobileNavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon: string }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 text-blue-100 hover:text-white py-2 px-3 rounded-lg hover:bg-white/10 transition-colors"
    >
      <span>{icon}</span>
      <span>{children}</span>
    </Link>
  )
}
