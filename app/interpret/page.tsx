"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, SparklesIcon, MoonIcon, ArrowRightIcon, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { DreamDatePicker } from "@/components/dream-date-picker"

export default function PublicInterpretPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [interpretation, setInterpretation] = useState(null)
  const [interpretationSource, setInterpretationSource] = useState(null)
  const [progress, setProgress] = useState(0)
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
    <div className="min-h-screen dream-bg">
      {/* Glow blobs */}
      <div className="glow-blob glow-blob-1 animate-pulse-glow"></div>
      <div className="glow-blob glow-blob-2 animate-pulse-glow"></div>
      <div className="glow-blob glow-blob-3 animate-pulse-glow"></div>
      <div className="glow-blob glow-blob-4 animate-pulse-glow"></div>

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

      <main className="container mx-auto px-6 py-16 relative z-10">
        {interpretation ? (
          <div className="space-y-10 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div>
                <SparklesIcon className="h-12 w-12 text-dream-purple mx-auto mb-6" />
              </div>
              <h1 className="text-4xl font-bold gradient-text mb-4">Your Dream Interpretation</h1>
              <p className="text-white text-lg">Insights into your subconscious mind</p>
            </div>

            <div className="glass-card p-10 border-dream-purple">
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-2xl font-bold gradient-text">{dreamData.title}</h2>
                <Button variant="outline" className="glass-button" onClick={() => setInterpretation(null)}>
                  <MoonIcon className="mr-2 h-4 w-4" />
                  Interpret Another Dream
                </Button>
              </div>

              <div className="mb-10 p-8 bg-dream-dark rounded-lg border border-dream-glass-border">
                <h3 className="text-lg font-medium text-white mb-4">Your Dream</h3>
                <p className="text-white whitespace-pre-line leading-relaxed">{dreamData.content}</p>
                <div className="mt-6 flex items-center gap-2">
                  <span className="px-3 py-1 text-xs rounded-full bg-dream-purple/30 text-white border border-dream-purple/30">
                    {interpretationSource === "openai" ? "AI Analysis" : "Dream Analysis"}
                  </span>
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Interpretation</h3>
                  <p className="text-white whitespace-pre-line leading-relaxed">{interpretation.interpretation}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Key Symbols</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {interpretation.symbols.map((symbol, index) => (
                      <div key={index} className="glass-card p-6 bg-dream-dark-blue">
                        <h4 className="font-medium text-dream-blue mb-3">{symbol.name}</h4>
                        <p className="text-white leading-relaxed">{symbol.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Recommended Actions</h3>
                  <ul className="space-y-5">
                    {interpretation.actions.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-dream-pink bg-opacity-20 p-1.5 rounded-full mr-4 mt-1.5">
                          <div className="w-2 h-2 bg-dream-pink rounded-full"></div>
                        </div>
                        <span className="text-white leading-relaxed">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-dream-glass-border">
                <div className="text-center">
                  <h3 className="text-xl font-bold gradient-text mb-4">Continue Your Dream Journey</h3>
                  <p className="text-white mb-8">
                    Create an account to save your dream interpretations and build a personal dream journal.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
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
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div>
                <MoonIcon className="h-12 w-12 text-dream-purple mx-auto mb-6" />
              </div>
              <h1 className="text-4xl font-bold gradient-text mb-4">Interpret Your Dream</h1>
              <p className="text-white text-lg">Describe your dream in detail for the most accurate interpretation</p>
            </div>

            <div className="glass-card p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-3">
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

                  <div className="space-y-3">
                    <Label htmlFor="date" className="text-white text-base">
                      Date of Dream <span className="text-dream-pink">*</span>
                    </Label>
                    <DreamDatePicker date={dreamData.date} onDateChange={handleDateChange} />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="content" className="text-white text-base">
                      Dream Description <span className="text-dream-pink">*</span>
                    </Label>
                    <Textarea
                      id="content"
                      name="content"
                      placeholder="Describe your dream in as much detail as you can remember (minimum 100 characters)..."
                      rows={8}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
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

                    <div className="space-y-3">
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

                {isSubmitting && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-white">
                      <span>Interpreting your dream...</span>
                      <span>{progress}%</span>
                    </div>
                    {/* Custom progress bar instead of using the Progress component */}
                    <div className="h-2 w-full bg-dream-card-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-dream-purple to-dream-blue transition-all duration-500 ease-in-out"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="pt-6">
                  <Button type="submit" disabled={isSubmitting} className="glass-button-primary w-full py-6 text-lg">
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
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-dream-glass-border backdrop-blur-md bg-dream-card-bg py-10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <SparklesIcon className="h-5 w-5 text-dream-purple mr-2" />
            <span className="text-xl font-bold gradient-text">DreamSage</span>
          </div>
          <div className="flex justify-center space-x-6 mb-6">
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
