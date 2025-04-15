"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DreamDatePicker({ date, onDateChange }) {
  const [selectedDate, setSelectedDate] = useState(date || new Date())

  // Update component if date prop changes
  useEffect(() => {
    if (date && date.toString() !== selectedDate.toString()) {
      setSelectedDate(date)
    }
  }, [date])

  const handleDateSelect = (date) => {
    if (!date) return
    setSelectedDate(date)
    onDateChange(date)
  }

  return (
    <div className="w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal glass-input",
              !selectedDate && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-dream-purple" />
            {selectedDate ? format(selectedDate, "PPP") : <span className="text-gray-400">Select date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-dream-dark-blue border border-dream-glass-border">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            className="dream-calendar bg-dream-dark-blue"
            classNames={{
              day_selected: "bg-dream-purple text-white",
              day_today: "bg-dream-blue/30 text-white font-bold",
              day: "text-white hover:bg-dream-purple/20",
              caption: "text-white",
              nav_button: "text-white hover:bg-dream-purple/20",
              head_cell: "text-gray-400 font-medium",
              table: "border-dream-glass-border",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
