"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { CalendarIcon } from "lucide-react"

export function SimpleDateInput({ date, onDateChange }) {
  const [dateString, setDateString] = useState("")

  // Format date to YYYY-MM-DD when component mounts or date prop changes
  useEffect(() => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0]
      setDateString(formattedDate)
    }
  }, [date])

  const handleChange = (e) => {
    const newDateString = e.target.value
    setDateString(newDateString)

    // Convert string back to Date object and call the callback
    if (newDateString) {
      const newDate = new Date(newDateString)
      if (!isNaN(newDate.getTime())) {
        onDateChange(newDate)
      }
    }
  }

  return (
    <div className="relative">
      <Input type="date" value={dateString} onChange={handleChange} className="glass-input pl-10" />
      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    </div>
  )
}
