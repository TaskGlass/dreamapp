"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeftIcon, SparklesIcon, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { DreamDatePicker } from "@/components/dream-date-picker"
import { saveDream } from "@/lib/server-actions"

export default function DashboardInterpretPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    emotion: "",
  })
  const [dreamData, setDreamData] = useState<{
    title: string;
    date: Date | null;
    content: string;
    emotion: string;
    clarity: string;
  }>({
    title: "",
    date: null,
    content: "",
    emotion: "",
    clarity: "medium",
  })

  useEffect(() => {
    setDreamData((prev) => ({ ...prev, date: new Date() }))
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDreamData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if ((errors as any)[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleDateChange = (date: Date | null) => {
    setDreamData((prev) => ({ ...prev, date: date || new Date() }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setDreamData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user selects
    if ((errors as any)[name]) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to interpret your dreams",
        variant: "destructive",
      })
      router.push("/auth/login")
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

    if (!dreamData.date) {
      toast({
        title: "Missing date",
        description: "Please select a date for your dream.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    const progressInterval = startProgressAnimation()

    try {
      // Format date as ISO string for database
      const formattedDate = dreamData.date.toISOString().split("T")[0]

      // Save dream using server action
      const result = await saveDream(user.id, {
        title: dreamData.title,
        content: dreamData.content,
        date: formattedDate,
        emotion: dreamData.emotion,
        clarity: dreamData.clarity,
      })

      // Complete the progress bar
      clearInterval(progressInterval)
      setProgress(100)

      toast({
        title: "Dream saved",
        description: "Your dream has been saved and interpreted successfully",
      })

      // Redirect to the dream detail page
      setTimeout(() => {
        router.push(`/dashboard/dreams/${result.dream.id}`)
      }, 500)
    } catch (error) {
      console.error("Error saving dream:", error)

      toast({
        title: "Error",
        description: "There was a problem saving your dream. Please try again.",
        variant: "destructive",
      })

      setIsSubmitting(false)
      clearInterval(progressInterval)
      setProgress(0)
    }
  }

  return (
    <div className="container mx-auto px-6 py-10 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Interpret Your Dream</h1>
          <p className="text-white">Record and analyze your dream experience</p>
        </div>
        <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-white/10">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="glass-card p-10 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-white text-base">
                Dream Title <span className="text-dream-pink">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Give your dream a title"
                value={dreamData.title}
                onChange={handleChange}
                required
                className={"glass-input " + (errors.title ? "border-red-500" : "")}
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
              <Input
                id="date"
                name="date"
                type="date"
                value={dreamData.date ? dreamData.date.toISOString().split('T')[0] : ''}
                onChange={e => handleDateChange(e.target.value ? new Date(e.target.value) : null)}
                required
                className={"glass-input date-input-dream"}
              />
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
                  <SelectTrigger className={"glass-input " + (errors.emotion ? "border-red-500" : "")}>
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

          <div className="flex justify-end gap-6 pt-6">
            <Button type="button" variant="outline" onClick={() => router.back()} className="glass-button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="glass-button-primary">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Interpreting...
                </>
              ) : (
                <>
                  <SparklesIcon className="mr-2 h-4 w-4" />
                  Interpret Dream
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
