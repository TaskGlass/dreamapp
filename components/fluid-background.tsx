"use client"

import type React from "react"
import { useEffect, useRef } from "react"

export function FluidBackground({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Animation variables
    let animationFrameId: number
    const particles: Particle[] = []
    const particleCount = 15

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: getRandomColor(),
        speed: Math.random() * 0.2 + 0.1,
        direction: Math.random() * Math.PI * 2,
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width,
      )
      gradient.addColorStop(0, "#131320")
      gradient.addColorStop(1, "#0f0f12")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        // Move particle
        particle.x += Math.cos(particle.direction) * particle.speed
        particle.y += Math.sin(particle.direction) * particle.speed

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.direction = Math.PI - particle.direction
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.direction = -particle.direction
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = 0.3
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" style={{ opacity: 0.8 }} />
      {children}
    </div>
  )
}

// Helper functions
function getRandomColor() {
  const colors = [
    "rgba(139, 92, 246, 0.5)", // Purple
    "rgba(99, 102, 241, 0.5)", // Blue
    "rgba(236, 72, 153, 0.5)", // Pink
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Types
interface Particle {
  x: number
  y: number
  radius: number
  color: string
  speed: number
  direction: number
}
