"use client"

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useEffect } from "react";



export default function LoginPage() {
    const {data: session, status} = useSession()
    const router = useRouter()


    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard')
        }
    }, [status, router, session])

    if (status === 'loading') {
        return <div>Loading...</div>
    }

    if (status === "unauthenticated") {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div className="p-8 bg-white shadow-md rounded-lg text-center">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              Bem-vindo à Plataforma de Apostas
            </h1>
            <p className="mb-8 text-gray-600">
              Faça login para continuar e explorar as melhores odds!
            </p>
            <button
              onClick={() => signIn("github")}
              className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center justify-center space-x-2"
            >
              {/* Você pode adicionar um ícone do GitHub aqui se desejar */}
              <span>Login com GitHub</span>
            </button>
          </div>
        </div>
      )
    }

    return null
}