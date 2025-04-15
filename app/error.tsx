'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Runtime error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass-card max-w-md p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong!</h2>
        <p className="text-gray-300 mb-6">{error.message || 'An unexpected error occurred'}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            className="glass-button-primary"
          >
            Try again
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="glass-button"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  )
} 