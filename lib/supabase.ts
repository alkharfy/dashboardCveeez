import { createClient } from "@supabase/supabase-js"
import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL")
}

if (!supabaseAnonKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

// Client for use in client components
export const createSupabaseClient = () => {
  return createClientComponentClient()
}

// Client for use in server components
export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}

// Admin client for server-side operations (only if service key is available)
export const createSupabaseAdminClient = () => {
  if (!supabaseServiceKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY not found. Admin operations will not be available.")
    return null
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Default client for general use
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: "admin" | "user"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "admin" | "user"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "admin" | "user"
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: "pending" | "in_progress" | "completed"
          priority: "low" | "medium" | "high"
          assigned_to: string | null
          created_by: string
          due_date: string | null
          attachments: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: "pending" | "in_progress" | "completed"
          priority?: "low" | "medium" | "high"
          assigned_to?: string | null
          created_by: string
          due_date?: string | null
          attachments?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: "pending" | "in_progress" | "completed"
          priority?: "low" | "medium" | "high"
          assigned_to?: string | null
          created_by?: string
          due_date?: string | null
          attachments?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      accounts: {
        Row: {
          id: string
          name: string
          type: string
          industry: string | null
          contact_person: string | null
          email: string | null
          phone: string | null
          address: string | null
          status: "active" | "inactive"
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          industry?: string | null
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          status?: "active" | "inactive"
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          industry?: string | null
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          status?: "active" | "inactive"
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
