import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { UserProvider } from "@/contexts/UserContext"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CV Management System | نظام إدارة السير الذاتية",
  description: "Internal CV management system with bilingual support",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <UserProvider>
            {children}
            <Toaster />
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
