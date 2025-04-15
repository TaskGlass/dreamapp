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
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session error:", sessionError)
          toast({
            title: "Authentication Error",
            description: "There was a problem checking your session. Please try again.",
            variant: "destructive",
          })
          return
        }

        if (session) {
          // Get user profile data
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (profileError) {
            console.error("Profile error:", profileError)
            toast({
              title: "Profile Error",
              description: "There was a problem loading your profile. Please try again.",
              variant: "destructive",
            })
            return
          }

          if (profile) {
            setUser(profile as User)
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
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
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (profileError) {
          console.error("Profile error:", profileError)
          return
        }

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
        console.error("Sign in error:", error)
        return { error }
      }

      if (data?.user) {
        // Get user profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (profileError) {
          // If profile doesn't exist, create it
          if (profileError.code === 'PGRST116') {
            const { error: createError } = await supabase
              .from("profiles")
              .insert([
                {
                  id: data.user.id,
                  email: data.user.email,
                  name: data.user.user_metadata?.name || 'User',
                  dream_credits: 3,
                  is_subscribed: false,
                },
              ])

            if (createError) {
              console.error("Profile creation error:", createError)
              return { error: createError }
            }

            // Get the newly created profile
            const { data: newProfile, error: newProfileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", data.user.id)
              .single()

            if (newProfileError) {
              console.error("New profile error:", newProfileError)
              return { error: newProfileError }
            }

            setUser(newProfile as User)
          } else {
            console.error("Profile error:", profileError)
            return { error: profileError }
          }
        } else if (profile) {
          setUser(profile as User)
        }
      }

      return { error: null }
    } catch (error) {
      console.error("Sign in error:", error)
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
        console.error("Sign up error:", error)
        return { error, user: null }
      }

      if (data?.user) {
        // Create user profile
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            email,
            name,
            dream_credits: 3, // Start with 3 free credits
            is_subscribed: false,
          },
        ])

        if (profileError) {
          console.error("Profile creation error:", profileError)
          return { error: profileError, user: null }
        }

        setUser({
          id: data.user.id,
          email,
          name,
          created_at: new Date().toISOString(),
          dream_credits: 3,
          is_subscribed: false,
        })
      }

      return { error: null, user: data?.user }
    } catch (error) {
      console.error("Sign up error:", error)
      return { error, user: null }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Sign out error:", error)
      }
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const updateUser = async (updates: Partial<User>) => {
    try {
      if (!user) return

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)

      if (error) {
        console.error("Update user error:", error)
        return
      }

      setUser((prev) => (prev ? { ...prev, ...updates } : null))
    } catch (error) {
      console.error("Update user error:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
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
