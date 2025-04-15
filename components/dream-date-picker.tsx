"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function DreamDatePicker({ date, onDateChange }: { date: Date; onDateChange: (date: Date) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            "bg-dream-dark-blue/50 border-dream-glass-border text-white",
            "hover:bg-dream-dark-blue/70 hover:border-dream-purple",
            "h-12"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-dream-purple" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-dream-dark-blue border-dream-glass-border">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            if (newDate) {
              onDateChange(newDate)
              setOpen(false)
            }
          }}
          initialFocus
          className="bg-transparent"
          classNames={{
            day_selected: "bg-dream-purple text-white hover:bg-dream-purple/90",
            day_today: "bg-dream-blue/30 text-white border border-dream-blue",
            day: "text-white hover:bg-dream-purple/20",
            head_cell: "text-white/80",
            caption: "text-white",
            nav_button: "text-white hover:bg-dream-purple/20",
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
