"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  CalendarIcon,
  BookOpenIcon,
  BrainIcon,
  SparklesIcon,
  MoonIcon,
  StarIcon,
  ArrowRightIcon,
  CheckIcon,
  XIcon,
  GiftIcon,
  UserPlus,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
// Import the FluidBackground component at the top of the file
import { FluidBackground } from "@/components/fluid-background"

export default function Home() {
  const { user } = useAuth()
  const [isAnnual, setIsAnnual] = useState(true)

  return (
    <FluidBackground>
      <div className="flex flex-col min-h-screen">
        <header className="relative z-10 py-6 backdrop-blur-md sticky top-0">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <SparklesIcon className="h-5 w-5 text-dream-purple mr-2" />
                <h1 className="text-2xl font-bold gradient-text">DreamSage</h1>
              </div>
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

        <main className="flex-grow relative z-10">
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-5xl md:text-6xl font-bold mb-8 gradient-text leading-tight">
                  Unlock the Wisdom of Your Dreams
                </h2>
                <p className="text-xl mb-10 text-white leading-relaxed">
                  Record, interpret, and transform your dreams into meaningful insights for personal growth and healing.
                </p>

                {/* New prominent CTA section */}
                <div className="glass-card p-6 border-dream-purple bg-dream-purple/10 mb-10">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center">
                      <GiftIcon className="h-10 w-10 text-dream-purple mr-4 flex-shrink-0" />
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-white">Try one free interpretation</h3>
                        <p className="text-white">Create an account after to get 3 more free interpretations!</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/interpret">
                        <Button size="lg" className="glass-button w-full sm:w-auto whitespace-nowrap">
                          <MoonIcon className="mr-2 h-5 w-5" />
                          Try For Free
                        </Button>
                      </Link>
                      <Link href="/auth/signup">
                        <Button size="lg" className="glass-button-primary w-full sm:w-auto whitespace-nowrap">
                          <UserPlus className="mr-2 h-5 w-5" />
                          Create Account
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 relative">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 gradient-text">How DreamSage Works</h2>
              <div className="grid md:grid-cols-3 gap-8 md:gap-10">
                <FeatureCard
                  icon={<BookOpenIcon className="h-10 w-10 text-dream-purple" />}
                  title="Record Your Dreams"
                  description="Keep a detailed log of your dreams with dates, emotions, and key elements that stood out to you."
                />
                <FeatureCard
                  icon={<BrainIcon className="h-10 w-10 text-dream-blue" />}
                  title="AI-Powered Interpretation"
                  description="Our advanced AI analyzes your dreams and provides personalized interpretations based on psychological principles."
                />
                <FeatureCard
                  icon={<CalendarIcon className="h-10 w-10 text-dream-pink" />}
                  title="Track Patterns & Growth"
                  description="Discover recurring themes, track your subconscious healing, and receive actionable insights for personal development."
                />
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="py-20 relative">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Choose Your Dream Journey</h2>
                <p className="text-xl text-white max-w-2xl mx-auto">
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
                    <p className="text-white mt-2">Perfect for casual dream explorers</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    <PricingFeature included>1 free trial interpretation</PricingFeature>
                    <PricingFeature included>3 interpretations after signup</PricingFeature>
                    <PricingFeature included>Dream library</PricingFeature>
                    <PricingFeature included>Basic dream analysis</PricingFeature>
                    <PricingFeature>Advanced insights</PricingFeature>
                    <PricingFeature>Pattern recognition</PricingFeature>
                  </ul>

                  <Link href="/auth/signup">
                    <Button className="glass-button-primary w-full">Sign Up Free</Button>
                  </Link>
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
                    <p className="text-white mt-2">{isAnnual ? "Billed as $108 per year" : "Billed monthly"}</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    <PricingFeature included>10 dream interpretations/month</PricingFeature>
                    <PricingFeature included>Advanced dream analysis</PricingFeature>
                    <PricingFeature included>Dream library</PricingFeature>
                    <PricingFeature included>Advanced insights</PricingFeature>
                    <PricingFeature included>Pattern recognition</PricingFeature>
                    <PricingFeature>Priority support</PricingFeature>
                  </ul>

                  <Link href="/auth/signup">
                    <Button className="glass-button-primary w-full">Subscribe Now</Button>
                  </Link>
                </div>

                {/* Pro Plan */}
                <div className="glass-card p-8 flex flex-col h-full border-dream-purple">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold gradient-text mb-2">Professional</h3>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold text-white">${isAnnual ? "19" : "24"}</span>
                      <span className="text-gray-400 mb-1">/{isAnnual ? "month" : "month"}</span>
                    </div>
                    <p className="text-white mt-2">{isAnnual ? "Billed as $228 per year" : "Billed monthly"}</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    <PricingFeature included>20 dream interpretations/month</PricingFeature>
                    <PricingFeature included>Premium dream analysis</PricingFeature>
                    <PricingFeature included>Dream library</PricingFeature>
                    <PricingFeature included>Advanced insights</PricingFeature>
                    <PricingFeature included>Pattern recognition</PricingFeature>
                    <PricingFeature included>Priority support</PricingFeature>
                  </ul>

                  <Link href="/auth/signup">
                    <Button className="glass-button w-full bg-dream-purple/20 hover:bg-dream-purple/30">
                      Subscribe Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 relative">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 gradient-text">
                  Transform Your Dream Insights Into Action
                </h2>
                <p className="text-xl mb-10 text-white leading-relaxed">
                  DreamSage doesn't just interpret your dreams—it provides practical steps to integrate these insights
                  into your waking life for meaningful personal growth.
                </p>
                <Link href="/interpret">
                  <Button size="lg" className="glass-button-primary px-8 py-6 text-lg">
                    Try For Free <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <section className="py-20 relative">
            <div className="container mx-auto px-4">
              <div className="glass-card p-8 md:p-10 max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="md:w-1/2">
                    <h3 className="text-2xl md:text-3xl font-bold mb-6 gradient-text">Dream Library Preview</h3>
                    <p className="text-lg text-white mb-8 leading-relaxed">
                      Experience the power of dream interpretation with our intuitive and beautiful interface. Track
                      patterns, gain insights, and transform your life through the wisdom of your dreams.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link href="/interpret">
                        <Button className="glass-button text-base">
                          <StarIcon className="h-5 w-5 mr-2" />
                          Try For Free
                        </Button>
                      </Link>
                      <Link href="/auth/signup">
                        <Button className="glass-button-primary text-base">
                          <MoonIcon className="h-5 w-5 mr-2" />
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="md:w-1/2 relative">
                    <div className="absolute -inset-0.5 bg-dream-gradient rounded-xl blur opacity-50"></div>
                    <div className="relative glass-card overflow-hidden rounded-xl">
                      <img
                        src="/placeholder.svg?height=300&width=500"
                        alt="Dream Journal Interface"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 relative">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">What Dreamers Are Saying</h2>
                <p className="text-lg text-white max-w-2xl mx-auto">
                  Join thousands of people who are unlocking the wisdom of their dreams with DreamSage.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <TestimonialCard
                  quote="DreamSage has completely transformed my relationship with my dreams. I've discovered patterns I never noticed before."
                  author="Sarah K."
                  role="Therapist"
                />
                <TestimonialCard
                  quote="The AI interpretations are surprisingly insightful. It's like having a dream analyst available 24/7."
                  author="Michael T."
                  role="Artist"
                />
                <TestimonialCard
                  quote="I've been journaling my dreams for years, but DreamSage adds a whole new dimension with its pattern tracking."
                  author="Jamie L."
                  role="Software Engineer"
                />
              </div>
            </div>
          </section>
        </main>

        <footer className="relative z-10 border-t border-dream-glass-border backdrop-blur-md bg-dream-card-bg py-12">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center mb-8">
              <SparklesIcon className="h-6 w-6 text-dream-purple mr-2" />
              <span className="text-2xl font-bold gradient-text">DreamSage</span>
            </div>
            <div className="flex justify-center space-x-8 mb-8">
              <Link href="/about" className="text-white hover:text-dream-purple transition-colors">
                About Us
              </Link>
              <Link href="/terms" className="text-white hover:text-dream-purple transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-white hover:text-dream-purple transition-colors">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-white hover:text-dream-purple transition-colors">
                Contact
              </Link>
            </div>
            <div className="border-t border-dream-glass-border mt-8 pt-8 text-center text-white">
              <p>© {new Date().getFullYear()} DreamSage. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </FluidBackground>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="glass-card glass-card-hover glow p-8 h-full transition-transform hover:translate-y-[-5px]">
      <div className="flex justify-center mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-4 text-center text-white">{title}</h3>
      <p className="text-white text-center leading-relaxed">{description}</p>
    </div>
  )
}

function TestimonialCard({ quote, author, role }) {
  return (
    <div className="glass-card p-8 h-full">
      <div className="mb-6">
        <StarRating rating={5} />
      </div>
      <p className="text-white mb-6 italic">"{quote}"</p>
      <div>
        <p className="font-semibold text-white">{author}</p>
        <p className="text-white text-sm">{role}</p>
      </div>
    </div>
  )
}

function StarRating({ rating }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />
      ))}
    </div>
  )
}

function PricingFeature({ children, included = false }) {
  return (
    <li className="flex items-start">
      <div className={`mr-2 mt-1 ${included ? "text-dream-purple" : "text-gray-600"}`}>
        {included ? <CheckIcon className="h-4 w-4" /> : <XIcon className="h-4 w-4" />}
      </div>
      <span className={included ? "text-white" : "text-gray-500"}>{children}</span>
    </li>
  )
}
