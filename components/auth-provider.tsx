"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { supabase, type User } from "@/lib/supabase"

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: any; user: any }>
  signOut: () => Promise<void>
  updateUser: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

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

  // Protect routes that require authentication
  useEffect(() => {
    if (!loading) {
      const protectedRoutes = ["/dashboard", "/dashboard/interpret"]
      const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

      if (isProtectedRoute && !user) {
        toast({
          title: "Authentication required",
          description: "Please login to access this page",
          variant: "destructive",
        })
        router.push("/auth/login")
      }
    }
  }, [loading, user, pathname, router, toast])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      // Get user profile data
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

      if (profile) {
        setUser(profile as User)
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) {
        return { error, user: null }
      }

      // Update the user's dream credits to 3 when they sign up
      if (data.user) {
        await supabase.from("profiles").update({ dream_credits: 3 }).eq("id", data.user.id)
      }

      return { error: null, user: data.user }
    } catch (error) {
      return { error, user: null }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
  }

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return

    try {
      const { error } = await supabase.from("profiles").update(updates).eq("id", user.id)

      if (error) {
        throw error
      }

      // Refresh user data
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profile) {
        setUser(profile as User)
      }
    } catch (error) {
      console.error("Error updating user:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
