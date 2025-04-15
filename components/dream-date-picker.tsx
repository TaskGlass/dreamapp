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
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    onDateChange(date)

    // On mobile, close the popover after selection
    if (isMobile) {
      setTimeout(() => setIsOpen(false), 300)
    }
  }

  return (
    <div className="w-full">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal glass-input",
              !date && "text-white",
              "relative h-12 md:h-10", // Taller on mobile for easier tapping
            )}
          >
            <CalendarIcon className="mr-3 h-5 w-5 text-dream-purple" />
            {selectedDate ? (
              <span className="text-white">{format(selectedDate, "PPP")}</span>
            ) : (
              <span className="text-white/70">Select date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "p-0 bg-dream-dark-blue border border-dream-glass-border",
            isMobile ? "w-[calc(100vw-2rem)] max-w-[350px]" : "w-auto",
          )}
          align="center"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            className="bg-dream-dark-blue"
            classNames={{
              day_selected: "bg-dream-purple text-white",
              day_today: "bg-dream-blue text-white",
              day: "text-white hover:bg-dream-purple/20 h-10 w-10 text-base", // Larger touch targets
              head_cell: "text-white",
              caption: "text-white",
              nav_button: "text-white hover:bg-dream-purple/20 h-9 w-9", // Larger buttons
              table: "space-y-2", // More spacing
              cell: "p-0 relative [&:has([aria-selected])]:bg-dream-purple/10", // Better selected state
              button: "h-10 w-10 p-0 font-normal aria-selected:opacity-100", // Larger buttons
              nav: "space-x-1 flex items-center",
              caption_label: "text-base font-medium", // Larger text
              months: "space-y-4 p-2", // More padding
            }}
          />
          {isMobile && (
            <div className="p-3 border-t border-dream-glass-border flex justify-end">
              <Button size="sm" className="glass-button-primary" onClick={() => setIsOpen(false)}>
                Done
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
