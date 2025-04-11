"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase" // Using the existing supabase client

// Define the User type based on your application's needs
export type User = {
  id: string
  email: string
  name: string
  dream_credits: number
  is_subscribed: boolean
  subscription_plan?: string
  subscription_end_date?: string
}

type UserContextType = {
  user: User | null
  loading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          // Get user profile data
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

          if (profile) {
            setUser(profile as User)
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Get user profile data
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        if (profile) {
          setUser(profile as User)
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return <UserContext.Provider value={{ user, loading }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
