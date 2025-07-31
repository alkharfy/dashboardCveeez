import { createClient } from "@supabase/supabase-js"
import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client component client
export const createSupabaseClient = () => createClientComponentClient()

// Server component client
export const createSupabaseServerClient = () => createServerComponentClient({ cookies })

// Admin client for server-side operations (only if service key is available)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string
          role: "admin" | "designer" | "reviewer" | "manager"
          status: string
          workplace: string | null
          avatar_url: string | null
          phone: string | null
          department: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email: string
          role?: "admin" | "designer" | "reviewer" | "manager"
          status?: string
          workplace?: string | null
          avatar_url?: string | null
          phone?: string | null
          department?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          email?: string
          role?: "admin" | "designer" | "reviewer" | "manager"
          status?: string
          workplace?: string | null
          avatar_url?: string | null
          phone?: string | null
          department?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          client_name: string
          birthdate: string | null
          contact_info: string | null
          address: string | null
          job_title: string | null
          education: string | null
          experience: number | null
          skills: string | null
          services: string[]
          service1: string | null
          service2: string | null
          service3: string | null
          service4: string | null
          service5: string | null
          service6: string | null
          designer_notes: string | null
          reviewer_notes: string | null
          payment_status: string
          down_payment: number | null
          remaining_amount: number | null
          transfer_number: string | null
          payment_method: string | null
          status: string
          priority: string | null
          date: string
          due_date: string | null
          designer_rating: number | null
          reviewer_rating: number | null
          designer_feedback: string | null
          reviewer_feedback: string | null
          assigned_designer: string | null
          assigned_reviewer: string | null
          attachments: any[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          client_name: string
          birthdate?: string | null
          contact_info?: string | null
          address?: string | null
          job_title?: string | null
          education?: string | null
          experience?: number | null
          skills?: string | null
          services?: string[]
          service1?: string | null
          service2?: string | null
          service3?: string | null
          service4?: string | null
          service5?: string | null
          service6?: string | null
          designer_notes?: string | null
          reviewer_notes?: string | null
          payment_status?: string
          down_payment?: number | null
          remaining_amount?: number | null
          transfer_number?: string | null
          payment_method?: string | null
          status?: string
          priority?: string | null
          date?: string
          due_date?: string | null
          designer_rating?: number | null
          reviewer_rating?: number | null
          designer_feedback?: string | null
          reviewer_feedback?: string | null
          assigned_designer?: string | null
          assigned_reviewer?: string | null
          attachments?: any[] | null
        }
        Update: {
          client_name?: string
          birthdate?: string | null
          contact_info?: string | null
          address?: string | null
          job_title?: string | null
          education?: string | null
          experience?: number | null
          skills?: string | null
          services?: string[]
          service1?: string | null
          service2?: string | null
          service3?: string | null
          service4?: string | null
          service5?: string | null
          service6?: string | null
          designer_notes?: string | null
          reviewer_notes?: string | null
          payment_status?: string
          down_payment?: number | null
          remaining_amount?: number | null
          transfer_number?: string | null
          payment_method?: string | null
          status?: string
          priority?: string | null
          date?: string
          due_date?: string | null
          designer_rating?: number | null
          reviewer_rating?: number | null
          designer_feedback?: string | null
          reviewer_feedback?: string | null
          assigned_designer?: string | null
          assigned_reviewer?: string | null
          attachments?: any[] | null
        }
      }
      accounts: {
        Row: {
          id: string
          service_name: string
          username: string
          password: string
          notes: string | null
          login_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          service_name: string
          username: string
          password: string
          notes?: string | null
          login_url?: string | null
        }
        Update: {
          service_name?: string
          username?: string
          password?: string
          notes?: string | null
          login_url?: string | null
        }
      }
    }
  }
}
