"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DreamDatePickerProps {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  className?: string
}

export function DreamDatePicker({ date, onDateChange, className }: DreamDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date)

  useEffect(() => {
    setSelectedDate(date)
  }, [date])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    onDateChange(date)
  }

  return (
    <div className={cn("w-full", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal glass-input dream-date-trigger",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-dream-purple" />
            {date ? format(date, "PPP") : <span className="text-gray-400">Select date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-dream-dark-blue border border-dream-glass-border">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            className="dream-calendar"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
