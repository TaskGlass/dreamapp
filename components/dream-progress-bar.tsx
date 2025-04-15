"use client"

import { useEffect, useState } from "react"

interface DreamProgressBarProps {
  isActive: boolean
  progress?: number
  autoIncrement?: boolean
  className?: string
}

export function DreamProgressBar({
  isActive,
  progress: externalProgress,
  autoIncrement = true,
  className = "",
}: DreamProgressBarProps) {
  const [progress, setProgress] = useState(0)

  // Reset progress when active state changes
  useEffect(() => {
    if (isActive) {
      setProgress(0)
    } else {
      setProgress(0)
    }
  }, [isActive])

  // Handle external progress updates
  useEffect(() => {
    if (externalProgress !== undefined) {
      setProgress(externalProgress)
    }
  }, [externalProgress])

  // Auto increment progress if enabled
  useEffect(() => {
    if (!isActive || !autoIncrement || externalProgress !== undefined) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        // Slow down as we approach 90%
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }

        const increment = prev < 30 ? 5 : prev < 60 ? 3 : prev < 80 ? 1 : 0.5
        return Math.min(prev + increment, 90)
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isActive, autoIncrement, externalProgress])

  if (!isActive) return null

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm text-gray-400">
        <span>Interpreting your dream...</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full bg-dream-card-bg rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-dream-purple to-dream-blue transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
