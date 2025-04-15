"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DreamDatePicker({ date, onDateChange }) {
  const [selectedDate, setSelectedDate] = useState(date || new Date())

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    onDateChange(date)
  }

  return (
    <div className="w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full justify-start text-left font-normal glass-input", !date && "text-white")}
          >
            <CalendarIcon className="mr-3 h-4 w-4 text-dream-purple" />
            {selectedDate ? (
              <span className="text-white">{format(selectedDate, "PPP")}</span>
            ) : (
              <span className="text-white/70">Select date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-dream-dark-blue border border-dream-glass-border">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            className="bg-dream-dark-blue"
            classNames={{
              day_selected: "bg-dream-purple text-white",
              day_today: "bg-dream-blue text-white",
              day: "text-white hover:bg-dream-purple/20",
              head_cell: "text-white",
              caption: "text-white",
              nav_button: "text-white hover:bg-dream-purple/20",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
