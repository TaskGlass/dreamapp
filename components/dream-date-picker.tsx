"use client"

import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function DreamDatePicker({ date, onDateChange }) {
  const [selectedDate, setSelectedDate] = useState(date || new Date())
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileDialogOpen, setIsMobileDialogOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const triggerRef = useRef(null)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      // Close popover when switching to mobile
      if (mobile && isOpen) {
        setIsOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [isOpen])

  const handleDateSelect = (date) => {
    if (!date) return

    setSelectedDate(date)
    onDateChange(date)

    // Close the appropriate UI component
    if (isMobile) {
      setIsMobileDialogOpen(false)
    } else {
      setIsOpen(false)
    }
  }

  const handleOpenChange = (open) => {
    if (isMobile) {
      if (open) {
        setIsMobileDialogOpen(true)
      }
      return
    }
    setIsOpen(open)
  }

  const openDatePicker = () => {
    if (isMobile) {
      setIsMobileDialogOpen(true)
    } else {
      setIsOpen(true)
    }
  }

  return (
    <div className="w-full">
      {/* Desktop popover version */}
      <Popover open={isOpen && !isMobile} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            onClick={openDatePicker}
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
        <PopoverContent className="p-0 bg-dream-dark-blue border border-dream-glass-border w-auto" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            className="bg-dream-dark-blue rounded-md"
            classNames={{
              day_selected: "bg-dream-purple text-white hover:bg-dream-purple/90",
              day_today: "bg-dream-blue/30 text-white font-bold",
              day: "text-white hover:bg-dream-purple/20 h-9 w-9 p-0 font-normal aria-selected:opacity-100",
              head_cell: "text-white font-medium",
              caption: "text-white",
              nav_button: "text-white hover:bg-dream-purple/20",
              table: "border-collapse space-y-1",
              cell: "p-0 relative [&:has([aria-selected])]:bg-dream-purple/10",
              button: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
              nav: "space-x-1 flex items-center",
              caption_label: "text-base font-medium",
              months: "space-y-4 p-3",
            }}
            components={{
              IconLeft: () => <ChevronLeftIcon className="h-4 w-4" />,
              IconRight: () => <ChevronRightIcon className="h-4 w-4" />,
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Mobile dialog version */}
      <Dialog open={isMobileDialogOpen} onOpenChange={setIsMobileDialogOpen}>
        <Button
          variant="outline"
          onClick={() => setIsMobileDialogOpen(true)}
          className={cn(
            "w-full justify-start text-left font-normal glass-input md:hidden",
            !date && "text-white",
            "relative h-12", // Taller on mobile for easier tapping
          )}
        >
          <CalendarIcon className="mr-3 h-5 w-5 text-dream-purple" />
          {selectedDate ? (
            <span className="text-white">{format(selectedDate, "PPP")}</span>
          ) : (
            <span className="text-white/70">Select date</span>
          )}
        </Button>
        <DialogContent className="bg-dream-dark-blue border border-dream-glass-border p-0 sm:max-w-[425px]">
          <DialogHeader className="p-4 border-b border-dream-glass-border">
            <DialogTitle className="text-white text-center">Select Date</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="bg-dream-dark-blue mx-auto"
              classNames={{
                day_selected: "bg-dream-purple text-white hover:bg-dream-purple/90",
                day_today: "bg-dream-blue/30 text-white font-bold",
                day: "text-white hover:bg-dream-purple/20 h-12 w-12 p-0 font-normal aria-selected:opacity-100 text-lg",
                head_cell: "text-white font-medium text-base",
                caption: "text-white text-lg",
                nav_button: "text-white hover:bg-dream-purple/20 h-10 w-10",
                table: "border-collapse space-y-2",
                cell: "p-0 relative [&:has([aria-selected])]:bg-dream-purple/10",
                button: "h-12 w-12 p-0 font-normal aria-selected:opacity-100",
                nav: "space-x-1 flex items-center",
                caption_label: "text-lg font-medium",
                months: "space-y-4",
              }}
              components={{
                IconLeft: () => <ChevronLeftIcon className="h-6 w-6" />,
                IconRight: () => <ChevronRightIcon className="h-6 w-6" />,
              }}
            />
          </div>
          <div className="p-4 border-t border-dream-glass-border flex justify-between">
            <Button variant="outline" className="glass-button" onClick={() => setIsMobileDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="glass-button-primary" onClick={() => handleDateSelect(selectedDate)}>
              Select
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
