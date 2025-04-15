"use client"

import { useState, useEffect } from "react"

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if window is defined (browser environment)
    if (typeof window === "undefined") return

    // Initial check
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Run on mount
    checkMobile()

    // Add event listener
    window.addEventListener("resize", checkMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkMobile)
  }, [breakpoint])

  return isMobile
}
