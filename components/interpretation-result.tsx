"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SparklesIcon, MoonIcon, UserPlus, CheckCircle } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

export default function InterpretationResult({
  interpretation,
  interpretationSource,
  dreamData,
  hasUsedFreeTrial,
  onReset,
}) {
  const isMobile = useIsMobile()

  return (
    <div className="space-y-6 sm:space-y-10 max-w-4xl mx-auto">
      <div className="text-center mb-6 sm:mb-10">
        <div>
          <SparklesIcon className="h-10 w-10 sm:h-12 sm:w-12 text-dream-purple mx-auto mb-4 sm:mb-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2 sm:mb-4">Your Dream Interpretation</h1>
        <p className="text-white text-base sm:text-lg">Insights into your subconscious mind</p>
      </div>

      {/* Free trial banner */}
      <div className="glass-card p-4 sm:p-6 border-dream-purple bg-dream-purple/10 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
            <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-dream-purple mr-0 sm:mr-3 mb-2 sm:mb-0" />
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">You've used your free interpretation</h3>
              <p className="text-white">
                Create an account to get 3 more free interpretations and save this dream to your library!
              </p>
            </div>
          </div>
          <Link href="/auth/signup" className="w-full sm:w-auto">
            <Button size="lg" className="glass-button-primary w-full">
              <UserPlus className="mr-2 h-5 w-5" />
              Create Free Account
            </Button>
          </Link>
        </div>
      </div>

      <div className="glass-card p-6 sm:p-10 border-dream-purple">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold gradient-text">{dreamData.title}</h2>
          <Button variant="outline" className="glass-button w-full sm:w-auto" onClick={onReset}>
            <MoonIcon className="mr-2 h-4 w-4" />
            Interpret Another Dream
          </Button>
        </div>

        <div className="mb-8 sm:mb-10 p-4 sm:p-8 bg-dream-dark rounded-lg border border-dream-glass-border">
          <h3 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4">Your Dream</h3>
          <p className="text-white whitespace-pre-line leading-relaxed">{dreamData.content}</p>
          <div className="mt-4 sm:mt-6 flex items-center gap-2">
            <span className="px-3 py-1 text-xs rounded-full bg-dream-purple/30 text-white border border-dream-purple/30">
              {interpretationSource === "openai" ? "AI Analysis" : "Dream Analysis"}
            </span>
          </div>
        </div>

        <div className="space-y-8 sm:space-y-10">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Interpretation</h3>
            <p className="text-white whitespace-pre-line leading-relaxed">{interpretation.interpretation}</p>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Key Symbols</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {interpretation.symbols.map((symbol, index) => (
                <div key={index} className="glass-card p-4 sm:p-6 bg-dream-dark-blue">
                  <h4 className="font-medium text-dream-blue mb-2 sm:mb-3">{symbol.name}</h4>
                  <p className="text-white leading-relaxed">{symbol.meaning}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Recommended Actions</h3>
            <ul className="space-y-4 sm:space-y-5">
              {interpretation.actions.map((action, index) => (
                <li key={index} className="flex items-start">
                  <div className="bg-dream-pink bg-opacity-20 p-1.5 rounded-full mr-3 sm:mr-4 mt-1.5 flex-shrink-0">
                    <div className="w-2 h-2 bg-dream-pink rounded-full"></div>
                  </div>
                  <span className="text-white leading-relaxed">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-dream-glass-border">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-bold gradient-text mb-3 sm:mb-4">Continue Your Dream Journey</h3>
            <p className="text-white mb-6 sm:mb-8">
              Create an account to save this dream interpretation and get 3 more free interpretations!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button size="lg" className="glass-button-primary w-full">
                  <SparklesIcon className="mr-2 h-5 w-5" />
                  Create Free Account
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="glass-button w-full sm:w-auto" onClick={onReset}>
                <MoonIcon className="mr-2 h-5 w-5" />
                Interpret Another Dream
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
