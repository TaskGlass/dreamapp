'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-dream-dark-blue">
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-white">Something went wrong!</h2>
            <p className="text-dream-gray-300">{error.message}</p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => reset()}
                className="glass-button-primary"
              >
                Try again
              </Button>
              <Button
                onClick={() => router.push('/')}
                className="glass-button"
              >
                Go home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 