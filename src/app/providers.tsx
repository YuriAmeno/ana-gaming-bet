"use client"

import { FavoritesProvider } from "@/contexts/FavoritesContext"
import { SessionProvider } from "next-auth/react"

export default function Provider({children}: {children: React.ReactNode}) {
    return (
        <SessionProvider>
            <FavoritesProvider>
                {children}
            </FavoritesProvider>
        </SessionProvider>
    )
}