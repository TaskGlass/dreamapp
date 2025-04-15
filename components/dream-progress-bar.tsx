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
  const [animationFrame, setAnimationFrame] = useState<number | null>(null)

  // Reset progress when active state changes
  useEffect(() => {
    if (isActive) {
      setProgress(0)
    } else {
      setProgress(0)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isActive, animationFrame])

  // Handle external progress updates
  useEffect(() => {
    if (externalProgress !== undefined) {
      setProgress(externalProgress)
    }
  }, [externalProgress])

  // Auto increment progress if enabled - using requestAnimationFrame for better performance
  useEffect(() => {
    if (!isActive || !autoIncrement || externalProgress !== undefined) {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      return
    }

    let lastTimestamp = 0
    const incrementStep = 0.05

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp

      const elapsed = timestamp - lastTimestamp

      // Update every 50ms for smoother animation
      if (elapsed > 50) {
        lastTimestamp = timestamp

        setProgress((prev) => {
          // Slow down as we approach 90%
          if (prev >= 90) {
            return prev
          }

          const increment = prev < 30 ? 5 : prev < 60 ? 3 : prev < 80 ? 1 : 0.5
          return Math.min(prev + increment * incrementStep, 90)
        })
      }

      const frame = requestAnimationFrame(animate)
      setAnimationFrame(frame)
    }

    const frame = requestAnimationFrame(animate)
    setAnimationFrame(frame)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isActive, autoIncrement, externalProgress])

  if (!isActive) return null

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm text-gray-400">
        <span>Interpreting your dream...</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="dream-progress-bar">
        <div className="dream-progress-indicator" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
