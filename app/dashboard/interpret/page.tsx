"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeftIcon, SparklesIcon, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { DreamDatePicker } from "@/components/dream-date-picker"
import { DreamProgressBar } from "@/components/dream-progress-bar"

export default function DashboardInterpretPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
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

    setIsSubmitting(true)

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

      // Save dream to database with interpretation
      const { data: dreamRecord, error: dreamError } = await supabase
        .from("dreams")
        .insert({
          user_id: user.id,
          title: dreamData.title,
          content: dreamData.content,
          date: dreamData.date.toISOString().split("T")[0],
          emotion: dreamData.emotion,
          clarity: dreamData.clarity,
        })
        .select()
        .single()

      if (dreamError) {
        throw dreamError
      }

      // Save interpretation to database
      await supabase.from("interpretations").insert({
        dream_id: dreamRecord.id,
        interpretation_text: data.interpretation.interpretation,
        symbols: data.interpretation.symbols,
        actions: data.interpretation.actions,
      })

      toast({
        title: "Dream saved",
        description: "Your dream has been saved to your journal",
      })

      // Redirect to the dream detail page
      router.push(`/dashboard/dreams/${dreamRecord.id}`)
    } catch (error) {
      console.error("Error saving dream:", error)
      toast({
        title: "Error",
        description: "There was a problem saving your dream. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Interpret Your Dream</h1>
          <p className="text-gray-400">Record and analyze your dream experience</p>
        </div>
        <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-white/10">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="glass-card p-8 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">
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

          <div className="flex justify-end gap-4 pt-4">
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
