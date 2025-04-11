"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SparklesIcon, MailIcon } from "lucide-react"

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Glow blobs - fixed position */}
      <div className="glow-blob glow-blob-1 animate-pulse-glow"></div>
      <div className="glow-blob glow-blob-2 animate-pulse-glow"></div>
      <div className="glow-blob glow-blob-3 animate-pulse-glow"></div>
      <div className="glow-blob glow-blob-4 animate-pulse-glow"></div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="flex items-center mb-8">
          <SparklesIcon className="h-6 w-6 text-dream-purple mr-2" />
          <span className="text-2xl font-bold gradient-text">DreamSage</span>
        </Link>

        <div className="glass-card w-full max-w-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-dream-purple/20 flex items-center justify-center">
              <MailIcon className="h-8 w-8 text-dream-purple" />
            </div>
          </div>

          <h1 className="text-2xl font-bold gradient-text mb-4">Check Your Email</h1>
          <p className="text-gray-300 mb-6">
            We've sent you a confirmation email. Please check your inbox and click the link to verify your account.
          </p>

          <div className="space-y-4">
            <Button className="glass-button-primary w-full" asChild>
              <Link href="/auth/login">Go to Login</Link>
            </Button>

            <p className="text-sm text-gray-400">
              Didn't receive an email? Check your spam folder or{" "}
              <Link href="/auth/signup" className="text-dream-purple hover:underline">
                try again
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
