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

  // Update internal state when prop changes
  useEffect(() => {
    if (date) {
      setSelectedDate(date)
    }
  }, [date])

  const handleDateSelect = (newDate) => {
    if (!newDate) return

    setSelectedDate(newDate)
    onDateChange(newDate)

    // Close dialog if open
    if (isDialogOpen) {
      setIsDialogOpen(false)
    }
  }

  const formatDisplayDate = (date) => {
    if (!date) return ""
    return format(date, "MMMM d, yyyy")
  }

  // Common calendar props for both mobile and desktop
  const calendarProps = {
    mode: "single",
    selected: selectedDate,
    onSelect: handleDateSelect,
    initialFocus: true,
    disabled: { after: new Date() }, // Can't select future dates
  }

  // Simple calendar styles with minimal animations
  const calendarClassNames = {
    day_selected: "bg-dream-purple text-white",
    day_today: "bg-dream-blue/20 text-white font-bold border border-dream-blue",
    day: "text-white hover:bg-dream-purple/20 h-9 w-9 p-0 font-normal",
    head_cell: "text-white font-medium text-sm py-2 px-1",
    caption: "text-white text-base font-bold py-2",
    nav_button: "text-white hover:bg-dream-purple/20 p-1 rounded-md",
    table: "border-collapse space-y-1",
    cell: "p-0 text-center",
    button: "p-0 font-normal w-full h-full",
    nav: "space-x-2 flex items-center py-2",
    caption_label: "text-base font-bold",
    months: "space-y-4 px-1.5",
  }

  return (
    <div className="w-full">
      {isMobile ? (
        // Mobile version - Dialog with minimal styling
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

              <div className="py-4 flex justify-center">
                <Calendar {...calendarProps} classNames={calendarClassNames} />
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
        // Desktop version - Popover with minimal styling
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal glass-input">
              <CalendarIcon className="mr-3 h-5 w-5 text-dream-purple" />
              <span className="text-white">{formatDisplayDate(selectedDate)}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-3 bg-dream-dark-blue border border-dream-glass-border w-auto" align="start">
            <Calendar {...calendarProps} classNames={calendarClassNames} />
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
