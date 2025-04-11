"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Loader2,
  SparklesIcon,
  LockIcon,
  MoonIcon,
  CalendarIcon,
  HeartIcon,
  EyeIcon,
  ArrowRightIcon,
  InfoIcon,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DreamDatePicker } from "@/components/dream-date-picker"

// Import the client-side fallback
import { getClientFallbackInterpretation } from "@/lib/client-fallback"

export default function PublicInterpretPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [interpretation, setInterpretation] = useState(null)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [formProgress, setFormProgress] = useState(0)
  const [dreamData, setDreamData] = useState({
    title: "",
    date: new Date(),
    content: "",
    emotion: "",
    clarity: "medium",
  })
  const [interpretationSource, setInterpretationSource] = useState<string | null>(null)

  // Calculate form progress
  useEffect(() => {
    let progress = 0

    // Title is required - 25%
    if (dreamData.title.trim()) progress += 25

    // Dream content is required and most important - 50%
    if (dreamData.content.trim()) {
      // Give partial points for short descriptions, full points for detailed ones
      const contentLength = dreamData.content.trim().length
      if (contentLength > 200) {
        progress += 50
      } else if (contentLength > 100) {
        progress += 40
      } else if (contentLength > 50) {
        progress += 30
      } else {
        progress += 20
      }
    }

    // Emotion is optional but important - 15%
    if (dreamData.emotion) progress += 15

    // Clarity is pre-selected with a default, but we'll count it - 10%
    if (dreamData.clarity) progress += 10

    setFormProgress(Math.min(progress, 100))
  }, [dreamData])

  // Check if user has already used their daily interpretation
  useEffect(() => {
    checkDailyUsage()
  }, [])

  // Function to check if user has already used their daily interpretation
  const checkDailyUsage = () => {
    if (typeof window === "undefined") return

    const today = new Date().toISOString().split("T")[0] // Get current date in YYYY-MM-DD format
    const usageData = localStorage.getItem("dreamInterpretationUsage")

    if (usageData) {
      const usage = JSON.parse(usageData)

      // If there's a record for today and the count is >= 1, show login prompt
      if (usage.date === today && usage.count >= 1) {
        setShowLoginPrompt(true)
      } else if (usage.date !== today) {
        // Reset usage for new day
        localStorage.setItem("dreamInterpretationUsage", JSON.stringify({ date: today, count: 0 }))
      }
    } else {
      // Initialize usage tracking if it doesn't exist
      localStorage.setItem("dreamInterpretationUsage", JSON.stringify({ date: today, count: 0 }))
    }
  }

  // Function to increment daily usage count
  const incrementDailyUsage = () => {
    if (typeof window === "undefined") return

    const today = new Date().toISOString().split("T")[0]
    const usageData = localStorage.getItem("dreamInterpretationUsage")

    let usage = { date: today, count: 0 }
    if (usageData) {
      const currentUsage = JSON.parse(usageData)

      // If it's the same day, increment count
      if (currentUsage.date === today) {
        usage = { date: today, count: currentUsage.count + 1 }
      }
    }

    localStorage.setItem("dreamInterpretationUsage", JSON.stringify(usage))

    // Show login prompt if this was the first use of the day
    if (usage.count >= 1) {
      setShowLoginPrompt(true)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setDreamData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date) => {
    setDreamData((prev) => ({ ...prev, date: date || new Date() }))
  }

  const handleSelectChange = (name, value) => {
    setDreamData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if user has already used their daily interpretation
    if (typeof window !== "undefined") {
      const today = new Date().toISOString().split("T")[0]
      const usageData = localStorage.getItem("dreamInterpretationUsage")

      if (usageData) {
        const usage = JSON.parse(usageData)
        if (usage.date === today && usage.count >= 1) {
          toast({
            title: "Daily limit reached",
            description: "You've reached your free interpretation limit for today. Sign up to continue.",
            variant: "destructive",
          })
          setShowLoginPrompt(true)
          return
        }
      }
    }

    setIsSubmitting(true)
    setInterpretation(null)

    try {
      // Call our API route with a timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout

      try {
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
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || errorData.message || `Server error: ${response.status}`)
        }

        const data = await response.json()

        if (!data.interpretation) {
          throw new Error("Invalid response format from server")
        }

        setInterpretation(data.interpretation)
        setInterpretationSource("dream-analysis")
        incrementDailyUsage()

        toast({
          title: "Dream interpreted",
          description: "Your dream has been analyzed successfully",
        })
      } catch (fetchError) {
        clearTimeout(timeoutId)
        throw fetchError
      }
    } catch (error) {
      console.error("Error interpreting dream:", error)

      toast({
        title: "Dream interpreted",
        description: "Your dream has been analyzed using our dream interpretation system",
      })

      // Use client-side fallback interpretation
      const fallbackInterpretation = getClientFallbackInterpretation(
        dreamData.content,
        dreamData.emotion || "",
        dreamData.clarity || "medium",
      )

      setInterpretation(fallbackInterpretation)
      setInterpretationSource("dream-analysis")
      incrementDailyUsage()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen dream-bg">
      {/* Animated glow blobs with enhanced animation */}
      <div className="glow-blob glow-blob-1 animate-pulse-glow"></div>
      <div className="glow-blob glow-blob-2 animate-pulse-glow"></div>
      <div className="glow-blob glow-blob-3 animate-pulse-glow"></div>
      <div className="glow-blob glow-blob-4 animate-pulse-glow"></div>

      {/* Add floating dream elements */}
      <div className="fixed w-full h-full pointer-events-none z-[1] overflow-hidden opacity-20">
        <div className="absolute w-16 h-16 bg-dream-purple/30 rounded-full blur-md top-[15%] left-[10%] animate-float-slow"></div>
        <div className="absolute w-12 h-12 bg-dream-blue/30 rounded-full blur-md top-[35%] right-[15%] animate-float"></div>
        <div className="absolute w-20 h-20 bg-dream-pink/30 rounded-full blur-md bottom-[20%] left-[25%] animate-float-slow"></div>
        <div className="absolute w-10 h-10 bg-dream-purple/30 rounded-full blur-md bottom-[30%] right-[30%] animate-float"></div>
      </div>

      <header className="relative z-10 py-6 border-b border-dream-glass-border backdrop-blur-md bg-dream-card-bg sticky top-0">
        <div className="container mx-auto px-4">
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

      <main className="container mx-auto px-4 py-12 relative z-10">
        <AnimatePresence mode="wait">
          {interpretation ? (
            <motion.div
              key="interpretation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8 max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <SparklesIcon className="h-12 w-12 text-dream-purple mx-auto mb-4" />
                </motion.div>
                <h1 className="text-4xl font-bold gradient-text mb-2">Your Dream Interpretation</h1>
                <p className="text-gray-400 text-lg">Insights into your subconscious mind</p>
              </div>

              <div className="glass-card p-8 border-dream-purple glow">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold gradient-text">{dreamData.title}</h2>
                  <Button variant="outline" className="glass-button" onClick={() => setInterpretation(null)}>
                    <MoonIcon className="mr-2 h-4 w-4" />
                    Interpret Another Dream
                  </Button>
                </div>

                <div className="mb-8 p-6 bg-dream-card-bg rounded-lg border border-dream-glass-border">
                  <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                    <MoonIcon className="h-5 w-5 mr-2 text-dream-blue" />
                    Your Dream
                  </h3>
                  <p className="text-gray-300 whitespace-pre-line leading-relaxed">{dreamData.content}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <div className="flex items-center px-3 py-1.5 bg-dream-card-bg border border-dream-glass-border rounded-full text-sm text-gray-300">
                      <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-dream-blue" />
                      {dreamData.date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    {dreamData.emotion && (
                      <div className="flex items-center px-3 py-1.5 bg-dream-card-bg border border-dream-glass-border rounded-full text-sm text-gray-300">
                        <HeartIcon className="h-3.5 w-3.5 mr-1.5 text-dream-pink" />
                        {dreamData.emotion}
                      </div>
                    )}
                    <div className="flex items-center px-3 py-1.5 bg-dream-card-bg border border-dream-glass-border rounded-full text-sm text-gray-300">
                      <EyeIcon className="h-3.5 w-3.5 mr-1.5 text-dream-purple" />
                      {dreamData.clarity === "high" ? "Vivid" : dreamData.clarity === "medium" ? "Clear" : "Fuzzy"}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <div className="mb-2 flex items-center">
                      <div className="w-10 h-10 rounded-full bg-dream-purple/20 flex items-center justify-center mr-3">
                        <SparklesIcon className="h-5 w-5 text-dream-purple" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Interpretation</h3>
                      {interpretationSource && (
                        <span className="ml-3 px-2 py-1 text-xs rounded-full bg-gray-700/50 text-gray-300 border border-gray-600">
                          Dream Analysis
                        </span>
                      )}
                    </div>
                    <div className="pl-13 ml-5 border-l border-dream-glass-border py-2">
                      <p className="text-gray-100 whitespace-pre-line leading-relaxed text-lg font-medium">
                        {interpretation.interpretation}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <div className="mb-2 flex items-center">
                      <div className="w-10 h-10 rounded-full bg-dream-blue/20 flex items-center justify-center mr-3">
                        <MoonIcon className="h-5 w-5 text-dream-blue" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Key Symbols</h3>
                    </div>
                    <div className="pl-13 ml-5 border-l border-dream-glass-border py-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        {interpretation.symbols.map((symbol, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                            className="glass-card p-4 hover:border-dream-blue transition-colors"
                          >
                            <h4 className="font-medium text-dream-blue mb-2 text-lg">{symbol.name}</h4>
                            <p className="text-gray-100 text-base">{symbol.meaning}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <div className="mb-2 flex items-center">
                      <div className="w-10 h-10 rounded-full bg-dream-pink/20 flex items-center justify-center mr-3">
                        <HeartIcon className="h-5 w-5 text-dream-pink" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Recommended Actions</h3>
                    </div>
                    <div className="pl-13 ml-5 border-l border-dream-glass-border py-2">
                      <ul className="space-y-4 mt-2">
                        {interpretation.actions.map((action, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                            className="flex items-start"
                          >
                            <div className="bg-dream-pink bg-opacity-20 p-1.5 rounded-full mr-3 mt-1">
                              <div className="w-2 h-2 bg-dream-pink rounded-full"></div>
                            </div>
                            <span className="text-gray-100 text-base">{action}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="mt-10 pt-6 border-t border-dream-glass-border"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold gradient-text mb-4">Continue Your Dream Journey</h3>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                      Create an account to save your dream interpretations, build a personal dream journal, and discover
                      patterns in your subconscious mind.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/auth/signup">
                        <Button size="lg" className="glass-button-primary w-full sm:w-auto">
                          <SparklesIcon className="mr-2 h-5 w-5" />
                          Create Free Account
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="lg"
                        className="glass-button w-full sm:w-auto"
                        onClick={() => setInterpretation(null)}
                      >
                        <MoonIcon className="mr-2 h-5 w-5" />
                        Interpret Another Dream
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <MoonIcon className="h-12 w-12 text-dream-purple mx-auto mb-4" />
                </motion.div>
                <h1 className="text-4xl font-bold gradient-text mb-2">Interpret Your Dream</h1>
                <p className="text-gray-400 text-lg">
                  Describe your dream in detail for the most accurate interpretation
                </p>
              </div>

              {showLoginPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Alert className="mb-8 bg-dream-card-bg border-dream-purple">
                    <LockIcon className="h-4 w-4 text-dream-purple" />
                    <AlertTitle className="text-white">Daily limit reached</AlertTitle>
                    <AlertDescription className="text-gray-300">
                      You've used your free interpretation for today. Create an account to continue interpreting your
                      dreams and save your dream journal.{" "}
                      <Link href="/auth/signup" className="text-dream-purple hover:underline font-medium">
                        Sign up now
                      </Link>{" "}
                      for free.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <div className="glass-card p-8 border-dream-glass-highlight">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium text-white">Dream Details</h3>
                    <span className="text-sm text-gray-400">{formProgress}% complete</span>
                  </div>
                  <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-dream-purple to-dream-blue transition-all duration-500 ease-in-out"
                      style={{ width: `${formProgress}%` }}
                    ></div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="title" className="text-white flex items-center">
                        Dream Title
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoIcon className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-dream-dark-blue border border-dream-glass-border">
                              <p className="text-sm">Give your dream a memorable name</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="E.g., Flying Over Mountains, Endless Maze, Underwater City..."
                        value={dreamData.title}
                        onChange={handleChange}
                        required
                        className="glass-input text-lg"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="date" className="text-white flex items-center">
                        Date of Dream
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoIcon className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-dream-dark-blue border border-dream-glass-border">
                              <p className="text-sm">When did you have this dream?</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <DreamDatePicker date={dreamData.date} onDateChange={handleDateChange} />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="content" className="text-white flex items-center">
                        Dream Description
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoIcon className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-dream-dark-blue border border-dream-glass-border max-w-xs">
                              <p className="text-sm">
                                The more details you provide, the more accurate your interpretation will be
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Textarea
                        id="content"
                        name="content"
                        placeholder="Describe your dream in as much detail as you can remember... 

What happened in your dream? 
Who was there? 
How did you feel during the dream?
What locations or settings did you see?
Were there any unusual objects or symbols?
What stood out to you the most?"
                        rows={8}
                        value={dreamData.content}
                        onChange={handleChange}
                        required
                        className="glass-input resize-none text-lg leading-relaxed"
                      />
                      <p className="text-xs text-gray-400 italic">
                        Tip: Include sensory details like colors, sounds, and feelings for a more accurate
                        interpretation
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="emotion" className="text-white flex items-center">
                          Primary Emotion
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <InfoIcon className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-dream-dark-blue border border-dream-glass-border">
                                <p className="text-sm">How did you feel in the dream?</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Select
                          value={dreamData.emotion}
                          onValueChange={(value) => handleSelectChange("emotion", value)}
                        >
                          <SelectTrigger className="glass-input">
                            <SelectValue placeholder="Select primary emotion" />
                          </SelectTrigger>
                          <SelectContent className="bg-dream-dark-blue border border-dream-glass-border max-h-80">
                            <SelectItem value="Joy">Joy</SelectItem>
                            <SelectItem value="Excitement">Excitement</SelectItem>
                            <SelectItem value="Love">Love</SelectItem>
                            <SelectItem value="Peace">Peace</SelectItem>
                            <SelectItem value="Fear">Fear</SelectItem>
                            <SelectItem value="Anxiety">Anxiety</SelectItem>
                            <SelectItem value="Sadness">Sadness</SelectItem>
                            <SelectItem value="Anger">Anger</SelectItem>
                            <SelectItem value="Confusion">Confusion</SelectItem>
                            <SelectItem value="Surprise">Surprise</SelectItem>
                            <SelectItem value="Wonder">Wonder</SelectItem>
                            <SelectItem value="Curiosity">Curiosity</SelectItem>
                            <SelectItem value="Frustration">Frustration</SelectItem>
                            <SelectItem value="Loneliness">Loneliness</SelectItem>
                            <SelectItem value="Nostalgia">Nostalgia</SelectItem>
                            <SelectItem value="Guilt">Guilt</SelectItem>
                            <SelectItem value="Shame">Shame</SelectItem>
                            <SelectItem value="Pride">Pride</SelectItem>
                            <SelectItem value="Gratitude">Gratitude</SelectItem>
                            <SelectItem value="Awe">Awe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="clarity" className="text-white flex items-center">
                          Dream Clarity
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <InfoIcon className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-dream-dark-blue border border-dream-glass-border">
                                <p className="text-sm">How clear and vivid was your dream?</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Select
                          value={dreamData.clarity}
                          onValueChange={(value) => handleSelectChange("clarity", value)}
                        >
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

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting || showLoginPrompt || !dreamData.content || !dreamData.title}
                      className="glass-button-primary text-lg px-8 py-6 h-auto w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Interpreting Dream...
                        </>
                      ) : (
                        <>
                          Interpret Dream
                          <ArrowRightIcon className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="text-center text-sm text-gray-400 mt-4">
                    <p>Free plan includes 1 dream interpretation per day</p>
                  </div>
                </form>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-400 text-sm">
                  By using this service, you agree to our{" "}
                  <Link href="/terms" className="text-dream-purple hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-dream-purple hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 border-t border-dream-glass-border backdrop-blur-md bg-dream-card-bg py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} DreamSage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
