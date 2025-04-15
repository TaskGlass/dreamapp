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
    className: "bg-transparent",
    disabled: { after: new Date() }, // Can't select future dates
  }

  // Update the calendar styles with enhanced UI
  const calendarClassNames = {
    day_selected: "bg-dream-purple text-white hover:bg-dream-purple/90 font-bold shadow-glow",
    day_today: "bg-dream-blue/20 text-white font-bold border-2 border-dream-blue",
    day: "text-white hover:bg-dream-purple/20 font-normal aria-selected:opacity-100 rounded-md focus:bg-dream-purple/30 focus:ring-2 focus:ring-dream-purple focus:ring-offset-2 focus:ring-offset-dream-dark-blue h-10 w-10 p-0 font-normal aria-selected:opacity-100 transition-all duration-200 mx-auto flex items-center justify-center",
    head_cell: "text-white font-medium text-sm py-3 px-2",
    caption: "text-white text-lg font-bold py-3",
    nav_button: "text-white hover:bg-dream-purple/20 p-2 rounded-md transition-colors duration-200",
    table: "border-collapse space-y-2",
    cell: "p-0 relative [&:has([aria-selected])]:bg-dream-purple/10 text-center",
    button: "p-0 font-normal aria-selected:opacity-100 w-full h-full",
    nav: "space-x-2 flex items-center py-2",
    caption_label: "text-lg font-bold",
    months: "space-y-4 px-1.5",
  }

  // Update the mobile calendar styles
  const mobileCalendarClassNames = {
    ...calendarClassNames,
    day: "text-white hover:bg-dream-purple/20 font-normal aria-selected:opacity-100 rounded-md focus:bg-dream-purple/30 focus:ring-2 focus:ring-dream-purple focus:ring-offset-2 focus:ring-offset-dream-dark-blue h-12 w-12 p-0 font-normal aria-selected:opacity-100 transition-all duration-200 mx-auto flex items-center justify-center",
    head_cell: "text-white font-medium text-base py-3 px-2",
    caption: "text-white text-xl font-bold py-3",
    nav_button: "text-white hover:bg-dream-purple/20 p-3 rounded-md transition-colors duration-200",
  }

  return (
    <div className="w-full">
      {isMobile ? (
        // Mobile version - Dialog with enhanced UI
        <>
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(true)}
            className="w-full justify-start text-left font-normal glass-input h-12 relative hover:border-dream-purple/50 transition-colors duration-200 group"
          >
            <CalendarIcon className="mr-3 h-5 w-5 text-dream-purple group-hover:scale-110 transition-transform duration-200" />
            <span className="text-white">{formatDisplayDate(selectedDate)}</span>
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-dream-dark-blue border border-dream-glass-border p-6 sm:max-w-[425px] rounded-xl shadow-glow">
              <DialogHeader className="pb-3 border-b border-dream-glass-border">
                <DialogTitle className="text-white text-center text-xl gradient-text">Select Dream Date</DialogTitle>
              </DialogHeader>

              <div className="py-6 flex justify-center">
                <Calendar
                  {...calendarProps}
                  classNames={mobileCalendarClassNames}
                  styles={{
                    head_cell: { width: "48px", height: "40px" },
                    day: { width: "48px", height: "48px" },
                    caption: { marginBottom: "12px" },
                    table: { margin: "0 auto" },
                  }}
                />
              </div>

              <DialogFooter className="pt-3 border-t border-dream-glass-border">
                <Button className="glass-button-primary w-full text-lg py-3" onClick={() => setIsDialogOpen(false)}>
                  Confirm Date
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        // Desktop version - Popover with enhanced UI
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal glass-input hover:border-dream-purple/50 transition-colors duration-200 group"
            >
              <CalendarIcon className="mr-3 h-5 w-5 text-dream-purple group-hover:scale-110 transition-transform duration-200" />
              <span className="text-white">{formatDisplayDate(selectedDate)}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-4 bg-dream-dark-blue border border-dream-glass-border w-auto rounded-xl shadow-glow"
            align="start"
            sideOffset={5}
          >
            <Calendar
              {...calendarProps}
              classNames={calendarClassNames}
              styles={{
                head_cell: { width: "40px", height: "32px" },
                day: { width: "40px", height: "40px" },
                caption: { marginBottom: "12px" },
                table: { margin: "0 auto" },
              }}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
