"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useIsMobile } from "@/hooks/use-mobile"

export function DreamDatePicker({ date, onDateChange }) {
  const [selectedDate, setSelectedDate] = useState(date || new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (date) {
      setSelectedDate(date)
    }
  }, [date])

  const handleDateSelect = (date) => {
    if (!date) return

    setSelectedDate(date)
    onDateChange(date)

    // Close dialog if open
    if (isDialogOpen) {
      setIsDialogOpen(false)
    }
  }

  const formatDisplayDate = (date) => {
    return format(date, "MMMM d, yyyy")
  }

  // Custom calendar styles for better spacing and appearance
  const calendarClassNames = {
    day_selected: "bg-dream-purple text-white hover:bg-dream-purple/90 font-medium",
    day_today: "bg-dream-blue/30 text-white font-bold border border-dream-blue",
    day: "text-white hover:bg-dream-purple/20 font-normal aria-selected:opacity-100 rounded-md focus:bg-dream-purple/30 focus:ring-2 focus:ring-dream-purple focus:ring-offset-2 focus:ring-offset-dream-dark-blue",
    head_cell: "text-white font-medium text-sm py-2",
    caption: "text-white text-base font-bold py-2",
    nav_button: "text-white hover:bg-dream-purple/20 p-1 rounded-md",
    table: "border-collapse space-y-2",
    cell: "p-0 relative [&:has([aria-selected])]:bg-dream-purple/10 text-center",
    button: "p-0 font-normal aria-selected:opacity-100 w-full h-full",
    nav: "space-x-2 flex items-center py-2",
    caption_label: "text-base font-bold",
    months: "space-y-4 px-1.5",
  }

  // Mobile-specific calendar styles
  const mobileCalendarClassNames = {
    ...calendarClassNames,
    day: "text-white hover:bg-dream-purple/20 font-normal aria-selected:opacity-100 rounded-md focus:bg-dream-purple/30 focus:ring-2 focus:ring-dream-purple focus:ring-offset-2 focus:ring-offset-dream-dark-blue",
    head_cell: "text-white font-medium text-base py-3",
    caption: "text-white text-lg font-bold py-3",
    nav_button: "text-white hover:bg-dream-purple/20 p-2 rounded-md",
  }

  return (
    <div className="w-full">
      {isMobile ? (
        // Mobile version - Dialog
        <>
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(true)}
            className="w-full justify-start text-left font-normal glass-input h-12 relative"
          >
            <CalendarIcon className="mr-3 h-5 w-5 text-dream-purple" />
            <span className="text-white">{formatDisplayDate(selectedDate)}</span>
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-dream-dark-blue border border-dream-glass-border p-4 sm:max-w-[425px]">
              <DialogHeader className="pb-2 border-b border-dream-glass-border">
                <DialogTitle className="text-white text-center text-lg">Select Date</DialogTitle>
              </DialogHeader>

              <div className="py-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="mx-auto bg-transparent"
                  classNames={mobileCalendarClassNames}
                  styles={{
                    head_cell: { width: "48px", height: "40px" },
                    day: { width: "48px", height: "48px" },
                    caption: { marginBottom: "8px" },
                    table: { margin: "0 auto" },
                  }}
                />
              </div>

              <DialogFooter className="pt-2 border-t border-dream-glass-border">
                <Button className="glass-button-primary w-full" onClick={() => setIsDialogOpen(false)}>
                  Done
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        // Desktop version - Popover
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal glass-input">
              <CalendarIcon className="mr-3 h-5 w-5 text-dream-purple" />
              <span className="text-white">{formatDisplayDate(selectedDate)}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-3 bg-dream-dark-blue border border-dream-glass-border w-auto" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
              className="bg-transparent"
              classNames={calendarClassNames}
              styles={{
                head_cell: { width: "40px", height: "32px" },
                day: { width: "40px", height: "40px" },
                caption: { marginBottom: "8px" },
                table: { margin: "0 auto" },
              }}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
