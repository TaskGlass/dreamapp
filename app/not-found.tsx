import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SparklesIcon } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass-card max-w-md p-6 text-center">
        <SparklesIcon className="h-12 w-12 text-dream-purple mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-gray-300 mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="glass-button-primary w-full sm:w-auto">
              Return Home
            </Button>
          </Link>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="glass-button w-full sm:w-auto"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
} 