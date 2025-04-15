export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      dreams: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          date: string
          emotion: string
          clarity: "low" | "medium" | "high"
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          date: string
          emotion: string
          clarity: "low" | "medium" | "high"
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          date?: string
          emotion?: string
          clarity?: "low" | "medium" | "high"
          created_at?: string
          updated_at?: string | null
        }
      }
      interpretations: {
        Row: {
          id: string
          dream_id: string
          interpretation_text: string
          symbols: Json
          actions: Json
          created_at: string
        }
        Insert: {
          id?: string
          dream_id: string
          interpretation_text: string
          symbols: Json
          actions: Json
          created_at?: string
        }
        Update: {
          id?: string
          dream_id?: string
          interpretation_text?: string
          symbols?: Json
          actions?: Json
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string
          dream_credits: number
          is_subscribed: boolean
          subscription_plan: string | null
          subscription_end_date: string | null
          created_at: string
          updated_at: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
        }
        Insert: {
          id: string
          name?: string | null
          email: string
          dream_credits?: number
          is_subscribed?: boolean
          subscription_plan?: string | null
          subscription_end_date?: string | null
          created_at?: string
          updated_at?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          email?: string
          dream_credits?: number
          is_subscribed?: boolean
          subscription_plan?: string | null
          subscription_end_date?: string | null
          created_at?: string
          updated_at?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
        }
      }
    }
  }
}
