"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { useUser } from "@/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Menu, Globe } from "lucide-react"

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { lang, setLang, t, isRTL } = useLanguage()
  const { user } = useUser()

  const toggleLanguage = () => {
    setLang(lang === "ar" ? "en" : "ar")
  }

  return (
    <nav className="bg-white shadow-sm border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">
            {lang === "ar" ? "نظام إدارة السير الذاتية" : "CV Management System"}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2 bg-transparent"
          >
            <Globe className="h-4 w-4" />
            {lang === "ar" ? "English" : "العربية"}
          </Button>

          <div className={`text-sm ${isRTL ? "text-right" : "text-left"}`}>
            <div className="font-medium">{user?.name}</div>
            <div className="text-gray-500">{t(user?.role || "")}</div>
          </div>
        </div>
      </div>
    </nav>
  )
}
