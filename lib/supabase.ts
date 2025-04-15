import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file or Vercel environment variables.",
  )
}

// Create the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Types for our database tables
export type User = {
  id: string
  email: string
  name: string
  created_at: string
  dream_credits: number
  is_subscribed: boolean
  subscription_plan?: string
  subscription_end_date?: string
}

export type Dream = {
  id: string
  user_id: string
  title: string
  content: string
  date: string
  emotion: string
  clarity: "low" | "medium" | "high"
  created_at: string
  updated_at?: string
}

export type Interpretation = {
  id: string
  dream_id: string
  interpretation_text: string
  symbols: {
    name: string
    meaning: string
  }[]
  actions: string[]
  created_at: string
}
