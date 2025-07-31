"use client"

import type React from "react"

import { useLanguage } from "@/contexts/LanguageContext"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"
import { useState } from "react"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { isRTL } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-6 lg:ml-64">{children}</main>
      </div>
    </div>
  )
}
