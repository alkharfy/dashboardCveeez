"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export type UserRole = "admin" | "designer" | "reviewer" | "manager"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: string
  workplace: string
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  hasPermission: (permission: string) => boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  // Mock user for demo - in real app this would come from authentication
  const [user, setUser] = useState<User | null>({
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@company.com",
    role: "admin",
    status: "Available",
    workplace: "الرياض",
  })

  const hasPermission = (permission: string): boolean => {
    if (!user) return false

    const permissions = {
      admin: ["view_all", "edit_all", "delete_all", "manage_users", "view_accounts"],
      manager: ["view_all"],
      designer: ["view_own", "edit_own"],
      reviewer: ["view_assigned", "edit_review"],
    }

    return permissions[user.role]?.includes(permission) || false
  }

  return <UserContext.Provider value={{ user, setUser, hasPermission }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
