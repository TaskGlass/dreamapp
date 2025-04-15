"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { SparklesIcon, Loader2, GiftIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { signUp } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agreeTerms: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      agreeTerms: checked,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error, user } = await signUp(formData.email, formData.password, formData.name)

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message || "There was an error creating your account. Please try again.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Account created",
        description: "Welcome to DreamSage! You've received 3 free dream interpretations.",
      })

      // If email confirmation is required, redirect to a confirmation page
      // Otherwise, redirect to dashboard
      router.push("/auth/confirmation")
    } catch (error) {
      toast({
        title: "Signup failed",
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
            <h1 className="text-2xl font-bold gradient-text">Create Your Account</h1>
            <p className="text-gray-400 mt-2">Start your journey of dream exploration</p>
          </div>

          {/* Bonus banner */}
          <div className="mb-6 p-4 bg-dream-purple/10 rounded-lg border border-dream-purple flex items-center">
            <GiftIcon className="h-10 w-10 text-dream-purple mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-white">Sign up today and get:</h3>
              <ul className="text-white mt-1">
                <li>• 3 free dream interpretations</li>
                <li>• Personal dream library</li>
                <li>• Dream pattern insights</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
                className="glass-input"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

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
              <Label htmlFor="password">Password</Label>
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
              <p className="text-xs text-gray-400">Must be at least 8 characters</p>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={handleCheckboxChange}
                className="data-[state=checked]:bg-dream-purple data-[state=checked]:border-dream-purple"
              />
              <label
                htmlFor="agreeTerms"
                className="text-sm text-gray-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-dream-purple hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-dream-purple hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button type="submit" className="glass-button-primary w-full" disabled={isLoading || !formData.agreeTerms}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account & Get 3 Free Interpretations"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-dream-purple hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
