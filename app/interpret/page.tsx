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
import { DreamProgressBar } from "@/components/dream-progress-bar"

export default function PublicInterpretPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [interpretation, setInterpretation] = useState(null)
  const [interpretationSource, setInterpretationSource] = useState(null)
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

      // Complete the progress bar by setting isSubmitting to false after a short delay
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
        {interpretation ? (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div>
                <SparklesIcon className="h-12 w-12 text-dream-purple mx-auto mb-4" />
              </div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Your Dream Interpretation</h1>
              <p className="text-gray-400 text-lg">Insights into your subconscious mind</p>
            </div>

            <div className="glass-card p-8 border-dream-purple">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold gradient-text">{dreamData.title}</h2>
                <Button variant="outline" className="glass-button" onClick={() => setInterpretation(null)}>
                  <MoonIcon className="mr-2 h-4 w-4" />
                  Interpret Another Dream
                </Button>
              </div>

              <div className="mb-8 p-6 bg-dream-card-bg rounded-lg border border-dream-glass-border">
                <h3 className="text-lg font-medium text-white mb-3">Your Dream</h3>
                <p className="text-gray-300 whitespace-pre-line">{dreamData.content}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-700/50 text-gray-300 border border-gray-600">
                    {interpretationSource === "openai" ? "AI Analysis" : "Dream Analysis"}
                  </span>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Interpretation</h3>
                  <p className="text-gray-100 whitespace-pre-line">{interpretation.interpretation}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Key Symbols</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {interpretation.symbols.map((symbol, index) => (
                      <div key={index} className="glass-card p-4">
                        <h4 className="font-medium text-dream-blue mb-2">{symbol.name}</h4>
                        <p className="text-gray-100">{symbol.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Recommended Actions</h3>
                  <ul className="space-y-4">
                    {interpretation.actions.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-dream-pink bg-opacity-20 p-1.5 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-dream-pink rounded-full"></div>
                        </div>
                        <span className="text-gray-100">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-dream-glass-border">
                <div className="text-center">
                  <h3 className="text-xl font-bold gradient-text mb-4">Continue Your Dream Journey</h3>
                  <p className="text-gray-300 mb-6">
                    Create an account to save your dream interpretations and build a personal dream journal.
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
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div>
                <MoonIcon className="h-12 w-12 text-dream-purple mx-auto mb-4" />
              </div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Interpret Your Dream</h1>
              <p className="text-gray-400 text-lg">
                Describe your dream in detail for the most accurate interpretation
              </p>
            </div>

            <div className="glass-card p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">
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

                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-white">
                      Date of Dream <span className="text-dream-pink">*</span>
                    </Label>
                    <DreamDatePicker date={dreamData.date} onDateChange={handleDateChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-white">
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
                        <div className="text-gray-400 text-sm">{dreamData.content.length}/100 characters minimum</div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emotion" className="text-white">
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

                    <div className="space-y-2">
                      <Label htmlFor="clarity" className="text-white">
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

                {/* Progress Bar */}
                <DreamProgressBar isActive={isSubmitting} />

                <div className="pt-4">
                  <Button type="submit" disabled={isSubmitting} className="glass-button-primary w-full py-6">
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

      <footer className="relative z-10 border-t border-dream-glass-border backdrop-blur-md bg-dream-card-bg py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} DreamSage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
