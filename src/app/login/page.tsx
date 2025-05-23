"use client"

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard')
        }
    }, [status, router, session])

    const handleGitHubLogin = async () => {
        setIsLoading(true)
        try {
            await signIn("github", { callbackUrl: '/dashboard' })
        } catch (error) {
            console.error('Erro no login:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-lg text-gray-600">Carregando...</p>
                </motion.div>
            </div>
        )
    }

    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
                <motion.div 
                    className="w-full max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div 
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-2xl">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            ANA Gaming
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Plataforma de Odds & Apostas
                        </p>
                    </motion.div>

                    <motion.div 
                        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">
                                Bem-vindo de volta!
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Faça login para acessar as melhores odds e 
                                acompanhar suas apostas favoritas em tempo real.
                            </p>
                        </div>

                        <motion.button
                            onClick={handleGitHubLogin}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 ease-in-out flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Conectando...</span>
                                </>
                            ) : (
                                <>
                                    <svg 
                                        className="w-6 h-6 group-hover:scale-110 transition-transform" 
                                        fill="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                    <span>Continuar com GitHub</span>
                                    <svg 
                                        className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </motion.button>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-500 text-center mb-4">
                                O que você terá acesso:
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <FeatureItem icon="📊" text="Odds em tempo real" />
                                <FeatureItem icon="⭐" text="Favoritos personalizados" />
                                <FeatureItem icon="🏆" text="Múltiplos esportes" />
                                <FeatureItem icon="📱" text="Interface responsiva" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="text-center mt-8 text-sm text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <p>
                            Ao fazer login, você concorda com nossos{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                                Termos de Serviço
                            </a>
                        </p>
                    </motion.div>
                </motion.div>

                <div className="fixed inset-0 -z-10 overflow-hidden">
                    <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-40 left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>
            </div>
        )
    }

    return null
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
    return (
        <motion.div 
            className="flex items-center space-x-2 text-gray-600"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
        >
            <span className="text-lg">{icon}</span>
            <span className="text-xs font-medium">{text}</span>
        </motion.div>
    )
}