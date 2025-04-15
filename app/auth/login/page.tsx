"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SparklesIcon, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { signIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await signIn(formData.email, formData.password)

      if (error) {
        toast({
          title: "Login failed",
          description: error.message || "Please check your credentials and try again.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Login successful",
        description: "Welcome back to DreamSage!",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Glow blobs - fixed position */}
      <div className="glow-blob glow-blob-1 animate-pulse-glow"></div>
      <div className="glow-blob glow-blob-2 animate-pulse-glow"></div>
      <div className="glow-blob glow-blob-3 animate-pulse-glow"></div>
      <div className="glow-blob glow-blob-4 animate-pulse-glow"></div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="flex items-center mb-8">
          <SparklesIcon className="h-6 w-6 text-dream-purple mr-2" />
          <span className="text-2xl font-bold gradient-text">DreamSage</span>
        </Link>

        <div className="glass-card w-full max-w-md p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold gradient-text">Welcome Back</h1>
            <p className="text-gray-400 mt-2">Sign in to continue your dream journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="glass-input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" className="text-sm text-dream-purple hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="glass-input"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="glass-button-primary w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-dream-purple hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
