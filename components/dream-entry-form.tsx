"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { DreamDatePicker } from "./dream-date-picker"

export default function DreamEntryForm({ onComplete }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
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
  }

  const handleDateChange = (date) => {
    setDreamData((prev) => ({ ...prev, date: date || new Date() }))
  }

  const handleSelectChange = (name, value) => {
    setDreamData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call for dream interpretation
    try {
      // In a real app, this would be an API call to your AI service
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // After successful submission
      setIsSubmitting(false)
      onComplete()
    } catch (error) {
      console.error("Error submitting dream:", error)
      setIsSubmitting(false)
    }
  }

  return (
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

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onComplete} className="glass-button">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="glass-button-primary">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Interpreting...
            </>
          ) : (
            "Save & Interpret Dream"
          )}
        </Button>
      </div>
    </form>
  )
}
