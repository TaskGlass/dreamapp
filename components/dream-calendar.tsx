"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"

// Mock data for demonstration
const dreamDates = [
  { date: new Date(2023, 4, 3), count: 1, clarity: "high" },
  { date: new Date(2023, 4, 10), count: 1, clarity: "medium" },
  { date: new Date(2023, 4, 15), count: 1, clarity: "high" },
  { date: new Date(2023, 4, 22), count: 2, clarity: "low" },
  { date: new Date(2023, 4, 28), count: 1, clarity: "medium" },
]

export default function DreamCalendar() {
  const [date, setDate] = useState(new Date())
  const [selectedDreamInfo, setSelectedDreamInfo] = useState(null)

  const handleSelect = (selectedDate) => {
    setDate(selectedDate)

    // Find if there are dreams on the selected date
    const dreamInfo = dreamDates.find(
      (d) =>
        d.date.getDate() === selectedDate.getDate() &&
        d.date.getMonth() === selectedDate.getMonth() &&
        d.date.getFullYear() === selectedDate.getFullYear(),
    )

    setSelectedDreamInfo(dreamInfo)
  }

  // Function to render custom day contents
  const renderDay = (day) => {
    const dreamInfo = dreamDates.find(
      (d) =>
        d.date.getDate() === day.date.getDate() &&
        d.date.getMonth() === day.date.getMonth() &&
        d.date.getFullYear() === day.date.getFullYear(),
    )

    if (!dreamInfo) return null

    let bgColor = "bg-gray-600"
    if (dreamInfo.clarity === "high") bgColor = "bg-dream-purple"
    else if (dreamInfo.clarity === "medium") bgColor = "bg-dream-blue"
    else if (dreamInfo.clarity === "low") bgColor = "bg-dream-pink"

    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${bgColor} text-white`}>
          {day.date.getDate()}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4 gradient-text">Dream Calendar</h3>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            className="rounded-md border border-dream-glass-border bg-dream-card-bg text-white"
            classNames={{
              day_selected: "bg-dream-purple text-white",
              day_today: "bg-dream-blue text-white",
              day: "text-gray-300 hover:bg-dream-card-bg hover:text-white",
              day_outside: "text-gray-500 opacity-50",
              head_cell: "text-gray-400",
              cell: "text-gray-300",
              nav_button: "text-gray-300 hover:bg-dream-card-bg",
              table: "border-dream-glass-border",
            }}
            components={{
              DayContent: (props) => renderDay(props),
            }}
          />
          <div className="mt-4 flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-dream-purple mr-2"></div>
              <span className="text-sm text-gray-300">Vivid Dream</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-dream-blue mr-2"></div>
              <span className="text-sm text-gray-300">Clear Dream</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-dream-pink mr-2"></div>
              <span className="text-sm text-gray-300">Fuzzy Dream</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="glass-card p-6 h-full">
          <h3 className="text-xl font-bold mb-4 gradient-text">Selected Date</h3>
          {selectedDreamInfo ? (
            <div>
              <p className="text-lg font-medium text-white">
                {date.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div className="mt-4">
                <Badge className="bg-dream-purple">
                  {selectedDreamInfo.count} {selectedDreamInfo.count === 1 ? "Dream" : "Dreams"}
                </Badge>
                <Badge className="ml-2" variant="outline" className="border-dream-glass-border bg-dream-card-bg">
                  {selectedDreamInfo.clarity === "high"
                    ? "Vivid"
                    : selectedDreamInfo.clarity === "medium"
                      ? "Clear"
                      : "Fuzzy"}
                </Badge>
              </div>
              <p className="mt-4 text-gray-400">
                Click on the dream in the list view to see details and interpretation.
              </p>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400">No dreams recorded on this date</p>
              <p className="text-sm text-gray-500 mt-2">
                Select a date with a colored indicator to view dream information
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
