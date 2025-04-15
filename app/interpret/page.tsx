"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, SparklesIcon, MoonIcon, ArrowRightIcon, AlertCircle, UserPlus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { DreamDatePicker } from "@/components/dream-date-picker"
import { DreamProgressBar } from "@/components/dream-progress-bar"
import { MobileHeader } from "@/components/mobile-header"
import { useIsMobile } from "@/hooks/use-mobile"

// Lazy load components that aren't needed immediately
const InterpretationResult = lazy(() => import("@/components/interpretation-result"))

export default function PublicInterpretPage() {
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [interpretation, setInterpretation] = useState(null)
  const [interpretationSource, setInterpretationSource] = useState(null)
  const [progress, setProgress] = useState(0)
  const [hasUsedFreeTrial, setHasUsedFreeTrial] = useState(false)
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    emotion: "",
  })
  const [dreamData, setDreamData] = useState({
    title: "",
    date: new Date(),
    content: "",
    emotion: "",
    clarity: "medium",
  })

  // Check if user has already used their free interpretation
  useEffect(() => {
    const hasUsed = localStorage.getItem("hasUsedFreeInterpretation") === "true"
    setHasUsedFreeTrial(hasUsed)
  }, [])

  // Progress bar animation
  const startProgressAnimation = () => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + 10
      })
    }, 500)
    return interval
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setDreamData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleDateChange = (date) => {
    setDreamData((prev) => ({ ...prev, date: date || new Date() }))
  }

  const handleSelectChange = (name, value) => {
    setDreamData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user selects
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      title: "",
      content: "",
      emotion: "",
    }
    let isValid = true

    if (!dreamData.title.trim()) {
      newErrors.title = "Dream title is required"
      isValid = false
    }

    if (!dreamData.content.trim()) {
      newErrors.content = "Dream description is required"
      isValid = false
    } else if (dreamData.content.trim().length < 100) {
      newErrors.content = "Dream description must be at least 100 characters"
      isValid = false
    }

    if (!dreamData.emotion) {
      newErrors.emotion = "Please select an emotion"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (hasUsedFreeTrial) {
      toast({
        title: "Free trial used",
        description: "You've already used your free interpretation. Create an account to continue.",
        variant: "destructive",
      })
      return
    }

    if (!validateForm()) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields correctly",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setInterpretation(null)
    const progressInterval = startProgressAnimation()

    try {
      // Call the API to interpret the dream
      const response = await fetch("/api/interpret-dream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: dreamData.content,
          emotion: dreamData.emotion,
          clarity: dreamData.clarity,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()

      // Complete the progress bar
      clearInterval(progressInterval)
      setProgress(100)

      setTimeout(() => {
        setInterpretation(data.interpretation)
        setInterpretationSource(data.source)

        // Mark that the user has used their free interpretation
        localStorage.setItem("hasUsedFreeInterpretation", "true")
        setHasUsedFreeTrial(true)

        toast({
          title: "Dream interpreted",
          description: "Your dream has been analyzed successfully",
        })

        setIsSubmitting(false)
      }, 500) // Short delay to show the completed progress bar
    } catch (error) {
      console.error("Error interpreting dream:", error)

      toast({
        title: "Error interpreting dream",
        description: "There was a problem interpreting your dream. Please try again.",
        variant: "destructive",
      })

      setIsSubmitting(false)
      clearInterval(progressInterval)
      setProgress(0)
    }
  }

  return (
    <div className="h-screen overflow-auto dream-bg">
      {/* Glow blobs - reduced for better performance */}
      <div className="glow-blob glow-blob-1 animate-pulse-glow"></div>
      <div className="glow-blob glow-blob-2 animate-pulse-glow"></div>

      {/* Use mobile-optimized header on small screens */}
      {isMobile ? (
        <MobileHeader />
      ) : (
        <header className="relative z-10 py-6 border-b border-dream-glass-border backdrop-blur-md bg-dream-card-bg sticky top-0">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center">
                <SparklesIcon className="h-5 w-5 text-dream-purple mr-2" />
                <h1 className="text-2xl font-bold gradient-text">DreamSage</h1>
              </Link>
              <div className="flex gap-4">
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="glass-button-primary">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 relative z-10">
        {interpretation ? (
          <Suspense
            fallback={
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-dream-purple" />
              </div>
            }
          >
            <InterpretationResult
              interpretation={interpretation}
              interpretationSource={interpretationSource}
              dreamData={dreamData}
              hasUsedFreeTrial={hasUsedFreeTrial}
              onReset={() => setInterpretation(null)}
            />
          </Suspense>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6 sm:mb-10">
              <div>
                <MoonIcon className="h-10 w-10 sm:h-12 sm:w-12 text-dream-purple mx-auto mb-4 sm:mb-6" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2 sm:mb-4">Interpret Your Dream</h1>
              <p className="text-white text-base sm:text-lg">
                Describe your dream in detail for the most accurate interpretation
              </p>

              {/* Free trial banner */}
              <div className="glass-card p-4 sm:p-6 border-dream-purple bg-dream-purple/10 mt-6 sm:mt-8 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <SparklesIcon className="h-6 w-6 sm:h-8 sm:w-8 text-dream-purple mb-2 sm:mb-0 sm:mr-3 mx-auto sm:mx-0" />
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-bold text-white">Try one free dream interpretation</h3>
                    <p className="text-white text-sm sm:text-base">
                      Create an account after to get 3 more free interpretations and save your dreams!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 sm:p-10">
              {hasUsedFreeTrial && (
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-dream-purple/10 rounded-lg border border-dream-purple">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center text-center sm:text-left">
                      <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-dream-purple mr-0 sm:mr-3 mb-2 sm:mb-0 mx-auto sm:mx-0" />
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                          You've used your free interpretation
                        </h3>
                        <p className="text-white">Create an account to get 3 more free interpretations!</p>
                      </div>
                    </div>
                    <Link href="/auth/signup" className="w-full sm:w-auto">
                      <Button size="lg" className="glass-button-primary w-full">
                        <UserPlus className="mr-2 h-5 w-5" />
                        Create Free Account
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="title" className="text-white text-base">
                      Dream Title <span className="text-dream-pink">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="E.g., Flying Over Mountains, Endless Maze..."
                      value={dreamData.title}
                      onChange={handleChange}
                      required
                      className={`glass-input ${errors.title ? "border-red-500" : ""}`}
                    />
                    {errors.title && (
                      <div className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.title}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="date" className="text-white text-base">
                      Date of Dream <span className="text-dream-pink">*</span>
                    </Label>
                    <DreamDatePicker date={dreamData.date} onDateChange={handleDateChange} />
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="content" className="text-white text-base">
                      Dream Description <span className="text-dream-pink">*</span>
                    </Label>
                    <Textarea
                      id="content"
                      name="content"
                      placeholder="Describe your dream in as much detail as you can remember (minimum 100 characters)..."
                      rows={6}
                      value={dreamData.content}
                      onChange={handleChange}
                      required
                      className={`glass-input resize-none ${errors.content ? "border-red-500" : ""}`}
                    />
                    <div className="flex justify-between">
                      {errors.content ? (
                        <div className="text-red-500 text-sm flex items-center mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.content}
                        </div>
                      ) : (
                        <div className="text-white text-sm">{dreamData.content.length}/100 characters minimum</div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="emotion" className="text-white text-base">
                        Primary Emotion <span className="text-dream-pink">*</span>
                      </Label>
                      <Select value={dreamData.emotion} onValueChange={(value) => handleSelectChange("emotion", value)}>
                        <SelectTrigger className={`glass-input ${errors.emotion ? "border-red-500" : ""}`}>
                          <SelectValue placeholder="Select primary emotion" />
                        </SelectTrigger>
                        <SelectContent className="bg-dream-dark-blue border border-dream-glass-border">
                          <SelectItem value="Joy">Joy</SelectItem>
                          <SelectItem value="Fear">Fear</SelectItem>
                          <SelectItem value="Sadness">Sadness</SelectItem>
                          <SelectItem value="Anger">Anger</SelectItem>
                          <SelectItem value="Confusion">Confusion</SelectItem>
                          <SelectItem value="Surprise">Surprise</SelectItem>
                          <SelectItem value="Anxiety">Anxiety</SelectItem>
                          <SelectItem value="Peace">Peace</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.emotion && (
                        <div className="text-red-500 text-sm flex items-center mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.emotion}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="clarity" className="text-white text-base">
                        Dream Clarity <span className="text-dream-pink">*</span>
                      </Label>
                      <Select value={dreamData.clarity} onValueChange={(value) => handleSelectChange("clarity", value)}>
                        <SelectTrigger className="glass-input">
                          <SelectValue placeholder="Select clarity level" />
                        </SelectTrigger>
                        <SelectContent className="bg-dream-dark-blue border border-dream-glass-border">
                          <SelectItem value="low">Low - Fuzzy details</SelectItem>
                          <SelectItem value="medium">Medium - Some clear parts</SelectItem>
                          <SelectItem value="high">High - Vivid and clear</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {isSubmitting && <DreamProgressBar isActive={isSubmitting} progress={progress} className="my-6" />}

                <div className="pt-4 sm:pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting || hasUsedFreeTrial}
                    className={`w-full py-4 sm:py-6 text-base sm:text-lg ${hasUsedFreeTrial ? "glass-button opacity-70" : "glass-button-primary"}`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Interpreting Dream...
                      </>
                    ) : hasUsedFreeTrial ? (
                      <>Free Trial Used</>
                    ) : (
                      <>
                        Interpret Dream
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  {hasUsedFreeTrial && (
                    <div className="mt-4 text-center">
                      <Link href="/auth/signup">
                        <Button className="glass-button-primary py-4 sm:py-6 text-base sm:text-lg w-full">
                          <UserPlus className="mr-2 h-5 w-5" />
                          Create Account for 3 More Free Interpretations
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-dream-glass-border backdrop-blur-md bg-dream-card-bg py-8 sm:py-10 mt-8 sm:mt-10">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <SparklesIcon className="h-5 w-5 text-dream-purple mr-2" />
            <span className="text-xl font-bold gradient-text">DreamSage</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
            <Link href="/about" className="text-white hover:text-dream-purple transition-colors">
              About Us
            </Link>
            <Link href="/privacy" className="text-white hover:text-dream-purple transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white hover:text-dream-purple transition-colors">
              Terms of Service
            </Link>
          </div>
          <p className="text-white">© {new Date().getFullYear()} DreamSage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
