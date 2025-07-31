"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { useUser } from "@/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, CheckSquare, ListTodo, Plus, Users, Settings, User, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { t, isRTL } = useLanguage()
  const { user, hasPermission } = useUser()
  const pathname = usePathname()

  const menuItems = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: t("dashboard"),
      show: true,
    },
    {
      href: "/tasks",
      icon: ListTodo,
      label: t("myTasks"),
      show: true,
    },
    {
      href: "/tasks/new",
      icon: Plus,
      label: t("newTask"),
      show: hasPermission("edit_all"),
    },
    {
      href: "/all-tasks",
      icon: CheckSquare,
      label: t("allTasks"),
      show: hasPermission("view_all"),
    },
    {
      href: "/accounts",
      icon: Settings,
      label: t("accounts"),
      show: hasPermission("view_accounts"),
    },
    {
      href: "/users",
      icon: Users,
      label: t("users"),
      show: hasPermission("manage_users"),
    },
    {
      href: "/profile",
      icon: User,
      label: t("profile"),
      show: true,
    },
  ]

  const visibleItems = menuItems.filter((item) => item.show)

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-background border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          open ? "translate-x-0" : "-translate-x-full",
          isRTL && "right-0 left-auto lg:right-auto lg:left-0",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b lg:hidden">
          <h2 className="text-lg font-semibold">{t("dashboard")}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (item.href === "/tasks" && pathname.startsWith("/tasks") && pathname !== "/tasks/new") ||
              (item.href === "/all-tasks" && pathname.startsWith("/all-tasks"))

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  isRTL && "flex-row-reverse",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className={cn("flex items-center gap-3 p-3 bg-muted rounded-lg", isRTL && "flex-row-reverse")}>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{t(user?.role || "")}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
