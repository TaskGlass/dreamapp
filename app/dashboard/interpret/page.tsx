"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeftIcon, SparklesIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { DreamDatePicker } from "@/components/dream-date-picker"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { getClientFallbackInterpretation } from "@/lib/client-fallback"

export default function DashboardInterpretPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formProgress, setFormProgress] = useState(0)
  const [dreamData, setDreamData] = useState({
    title: "",
    date: new Date(),
    content: "",
    emotion: "",
    clarity: "medium",
  })

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

    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to interpret your dreams",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    if (user.dream_credits <= 0 && !user.is_subscribed) {
      toast({
        title: "No credits remaining",
        description: "Please upgrade your plan to continue interpreting dreams",
        variant: "destructive",
      })
      router.push("/pricing")
      return
    }

    setIsSubmitting(true)

    try {
      // Call our API route
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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to interpret dream")
      }

      if (data.error) {
        throw new Error(data.error)
      }

      const generatedInterpretation = data.interpretation

      toast({
        title: "Dream interpreted",
        description: "Your dream has been analyzed successfully",
      })

      try {
        // Save dream to database
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

        if (dreamError) throw dreamError

        // Save interpretation to database
        const { error: interpretationError } = await supabase.from("interpretations").insert({
          dream_id: dreamRecord.id,
          interpretation_text: generatedInterpretation.interpretation,
          symbols: generatedInterpretation.symbols,
          actions: generatedInterpretation.actions,
        })

        if (interpretationError) throw interpretationError

        // Update user credits if not subscribed
        if (!user.is_subscribed) {
          await supabase
            .from("profiles")
            .update({
              dream_credits: user.dream_credits - 1,
            })
            .eq("id", user.id)
        }

        toast({
          title: "Dream saved",
          description: "Your dream has been analyzed and saved to your journal",
        })

        // Redirect to the dream detail page
        router.push(`/dashboard/dreams/${dreamRecord.id}`)
      } catch (dbError) {
        console.error("Database error:", dbError)

        toast({
          title: "Dream interpreted",
          description: "Your dream has been analyzed, but there was an issue saving it to your journal.",
        })
      }
    } catch (error) {
      console.error("Error interpreting dream:", error)
      toast({
        title: "Using fallback interpretation",
        description: "We encountered an issue with our AI service. Using our basic interpretation instead.",
      })

      // Use client-side fallback interpretation
      const fallbackInterpretation = getClientFallbackInterpretation(
        dreamData.content,
        dreamData.emotion || "",
        dreamData.clarity || "medium",
      )

      try {
        // Try to save the fallback interpretation
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

        if (!dreamError) {
          await supabase.from("interpretations").insert({
            dream_id: dreamRecord.id,
            interpretation_text: fallbackInterpretation.interpretation,
            symbols: fallbackInterpretation.symbols,
            actions: fallbackInterpretation.actions,
          })

          // Update user credits if not subscribed
          if (!user.is_subscribed) {
            await supabase
              .from("profiles")
              .update({
                dream_credits: user.dream_credits - 1,
              })
              .eq("id", user.id)
          }

          // Redirect to the dream detail page
          router.push(`/dashboard/dreams/${dreamRecord.id}`)
        }
      } catch (dbError) {
        console.error("Error saving fallback interpretation:", dbError)
      }
    } finally {
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Dream Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Give your dream a title"
              value={dreamData.title}
              onChange={handleChange}
              required
              className="glass-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-white">
              Date of Dream
            </Label>
            <DreamDatePicker date={dreamData.date} onDateChange={handleDateChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-white">
              Dream Description
            </Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Describe your dream in as much detail as you can remember..."
              rows={6}
              value={dreamData.content}
              onChange={handleChange}
              required
              className="glass-input resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="emotion" className="text-white">
                Primary Emotion
              </Label>
              <Select value={dreamData.emotion} onValueChange={(value) => handleSelectChange("emotion", value)}>
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

            <div className="space-y-2">
              <Label htmlFor="clarity" className="text-white">
                Dream Clarity
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

          {!user?.is_subscribed && (
            <div className="mt-4 text-center text-sm text-gray-400">
              <p>
                You have {user?.dream_credits || 0} dream {user?.dream_credits === 1 ? "credit" : "credits"} remaining.
                <br />
                <a href="/pricing" className="text-dream-purple hover:underline">
                  Upgrade your plan
                </a>{" "}
                for unlimited interpretations.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
