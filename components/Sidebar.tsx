"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { useUser } from "@/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, CheckSquare, List, Plus, CreditCard, User, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t, isRTL } = useLanguage()
  const { user, hasPermission } = useUser()
  const pathname = usePathname()

  const menuItems = [
    {
      href: "/",
      icon: LayoutDashboard,
      label: t("dashboard"),
      permission: null,
    },
    {
      href: "/tasks",
      icon: CheckSquare,
      label: t("myTasks"),
      permission: null,
    },
    {
      href: "/tasks/new",
      icon: Plus,
      label: t("newTask"),
      permission: "edit_all",
    },
    {
      href: "/all-tasks",
      icon: List,
      label: t("allTasks"),
      permission: "view_all",
    },
    {
      href: "/accounts",
      icon: CreditCard,
      label: t("accounts"),
      permission: "view_accounts",
    },
    {
      href: "/profile",
      icon: User,
      label: t("profile"),
      permission: null,
    },
  ]

  const filteredItems = menuItems.filter((item) => !item.permission || hasPermission(item.permission))

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50",
          "lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isRTL ? "right-0 lg:right-auto" : "left-0",
        )}
      >
        <div className="p-4 border-b lg:hidden">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{t("dashboard")}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn("w-full justify-start gap-3", isRTL && "flex-row-reverse")}
                  onClick={onClose}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
