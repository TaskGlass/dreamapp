"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SparklesIcon, CheckIcon, XIcon, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"

export default function PricingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, updateUser } = useAuth()
  const [isAnnual, setIsAnnual] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubscribe = async (plan) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login or create an account to subscribe.",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    setIsProcessing(true)

    try {
      // In a real app, you would integrate with a payment provider here
      // For this demo, we'll just update the user's subscription status

      if (plan === "free") {
        await updateUser({
          is_subscribed: false,
          dream_credits: 10,
          subscription_plan: "free",
          subscription_end_date: null,
        })

        toast({
          title: "Free plan activated",
          description: "You now have 10 dream interpretations to use.",
        })
      } else {
        // Calculate subscription end date (1 month or 1 year from now)
        const endDate = new Date()
        if (isAnnual) {
          endDate.setFullYear(endDate.getFullYear() + 1)
        } else {
          endDate.setMonth(endDate.getMonth() + 1)
        }

        await updateUser({
          is_subscribed: true,
          dream_credits: plan === "pro" ? 20 : 10,
          subscription_plan: plan,
          subscription_end_date: endDate.toISOString(),
        })

        toast({
          title: "Subscription successful",
          description: `You are now subscribed to the ${plan === "pro" ? "Professional" : "Standard"} plan.`,
        })
      }

      router.push("/dashboard")
    } catch (error) {
      console.error("Error updating subscription:", error)
      toast({
        title: "Subscription failed",
        description: "There was an error processing your subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Glow blobs - fixed position */}
      <div className="glow-blob glow-blob-1 animate-pulse-glow"></div>
      <div className="glow-blob glow-blob-2 animate-pulse-glow"></div>
      <div className="glow-blob glow-blob-3 animate-pulse-glow"></div>
      <div className="glow-blob glow-blob-4 animate-pulse-glow"></div>

      <header className="relative z-10 py-6 border-b border-dream-glass-border backdrop-blur-md bg-dream-card-bg sticky top-0">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <SparklesIcon className="h-5 w-5 text-dream-purple mr-2" />
              <h1 className="text-2xl font-bold gradient-text">DreamSage</h1>
            </Link>
            <div className="flex gap-4">
              {user ? (
                <Link href="/dashboard">
                  <Button className="glass-button-primary">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="glass-button-primary">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow relative z-10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Choose Your Dream Journey</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Select the plan that best fits your dream exploration needs
            </p>

            <div className="flex items-center justify-center mt-8">
              <div className="bg-dream-card-bg border border-dream-glass-border rounded-full p-1 inline-flex">
                <button
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    isAnnual ? "bg-dream-purple text-white" : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setIsAnnual(true)}
                >
                  Annual (Save 20%)
                </button>
                <button
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    !isAnnual ? "bg-dream-purple text-white" : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setIsAnnual(false)}
                >
                  Monthly
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="glass-card p-8 flex flex-col h-full">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-gray-400 mb-1">/forever</span>
                </div>
                <p className="text-gray-400 mt-2">Perfect for casual dream explorers</p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                <PricingFeature included>10 dream interpretations</PricingFeature>
                <PricingFeature included>Basic dream analysis</PricingFeature>
                <PricingFeature included>Dream journal</PricingFeature>
                <PricingFeature>Advanced insights</PricingFeature>
                <PricingFeature>Pattern recognition</PricingFeature>
                <PricingFeature>Priority support</PricingFeature>
              </ul>

              <Button className="glass-button w-full" onClick={() => handleSubscribe("free")} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Get Started"
                )}
              </Button>
            </div>

            {/* Standard Plan */}
            <div className="glass-card p-8 flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-dream-blue py-1 px-4 text-xs font-medium text-white">
                POPULAR
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Standard</h3>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">${isAnnual ? "9" : "12"}</span>
                  <span className="text-gray-400 mb-1">/{isAnnual ? "month" : "month"}</span>
                </div>
                <p className="text-gray-400 mt-2">{isAnnual ? "Billed as $108 per year" : "Billed monthly"}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                <PricingFeature included>10 dream interpretations/month</PricingFeature>
                <PricingFeature included>Advanced dream analysis</PricingFeature>
                <PricingFeature included>Dream journal</PricingFeature>
                <PricingFeature included>Advanced insights</PricingFeature>
                <PricingFeature included>Pattern recognition</PricingFeature>
                <PricingFeature>Priority support</PricingFeature>
              </ul>

              <Button
                className="glass-button-primary w-full"
                onClick={() => handleSubscribe("standard")}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Subscribe Now"
                )}
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="glass-card p-8 flex flex-col h-full border-dream-purple">
              <div className="mb-6">
                <h3 className="text-xl font-bold gradient-text mb-2">Professional</h3>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">${isAnnual ? "19" : "24"}</span>
                  <span className="text-gray-400 mb-1">/{isAnnual ? "month" : "month"}</span>
                </div>
                <p className="text-gray-400 mt-2">{isAnnual ? "Billed as $228 per year" : "Billed monthly"}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                <PricingFeature included>20 dream interpretations/month</PricingFeature>
                <PricingFeature included>Premium dream analysis</PricingFeature>
                <PricingFeature included>Dream journal</PricingFeature>
                <PricingFeature included>Advanced insights</PricingFeature>
                <PricingFeature included>Pattern recognition</PricingFeature>
                <PricingFeature included>Priority support</PricingFeature>
              </ul>

              <Button
                className="glass-button w-full bg-dream-purple/20 hover:bg-dream-purple/30"
                onClick={() => handleSubscribe("pro")}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Subscribe Now"
                )}
              </Button>
            </div>
          </div>

          <div className="mt-16 glass-card p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold gradient-text mb-4">Frequently Asked Questions</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-white mb-2">What happens when I run out of dream interpretations?</h4>
                <p className="text-gray-400">
                  On the free plan, once you've used your 10 interpretations, you'll need to upgrade to a paid plan to
                  continue. Your dream journal will still be accessible.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Can I cancel my subscription anytime?</h4>
                <p className="text-gray-400">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of
                  your billing period.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">How accurate are the dream interpretations?</h4>
                <p className="text-gray-400">
                  Our AI provides insights based on psychological principles and dream symbolism. While no
                  interpretation is definitive, many users find our analysis remarkably insightful for self-reflection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-dream-glass-border backdrop-blur-md bg-dream-card-bg py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} DreamSage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function PricingFeature({ children, included = false }) {
  return (
    <li className="flex items-start">
      <div className={`mr-2 mt-1 ${included ? "text-dream-purple" : "text-gray-600"}`}>
        {included ? <CheckIcon className="h-4 w-4" /> : <XIcon className="h-4 w-4" />}
      </div>
      <span className={included ? "text-gray-300" : "text-gray-500"}>{children}</span>
    </li>
  )
}
