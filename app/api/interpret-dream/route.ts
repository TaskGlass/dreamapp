import { NextResponse } from "next/server"
import { generateDreamInterpretation } from "@/lib/server/openai-service"
import { generateFallbackInterpretation } from "@/lib/fallback-interpretation"

// This ensures the route is only processed on the server
export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()
    const { content, emotion, clarity } = body

    console.log("Received dream interpretation request")

    // Validate required fields
    if (!content) {
      return NextResponse.json({ error: "Dream content is required" }, { status: 400 })
    }

    // Always use fallback if USE_FALLBACK_ONLY is true
    if (process.env.USE_FALLBACK_ONLY === "true") {
      console.log("Using fallback interpretation (fallback only mode)")
      const interpretation = generateFallbackInterpretation(content, emotion || "", clarity || "medium")
      return NextResponse.json({
        interpretation,
        source: "fallback",
      })
    }

    // Try to use OpenAI with robust error handling
    try {
      console.log("Attempting to use OpenAI for dream interpretation")

      const interpretation = await generateDreamInterpretation(content, emotion || "", clarity || "medium")

      return NextResponse.json({
        interpretation,
        source: "openai",
      })
    } catch (aiError) {
      console.error("OpenAI error:", aiError)

      // Fall back to local interpretation if OpenAI fails
      console.log("Falling back to local interpretation due to API error")
      const interpretation = generateFallbackInterpretation(content, emotion || "", clarity || "medium")

      return NextResponse.json({
        interpretation,
        source: "fallback",
        error: "AI service unavailable, using fallback interpretation",
      })
    }
  } catch (error: any) {
    console.error("Error processing dream interpretation request:", error)

    // Always return a valid response even if there's an error
    const fallbackInterpretation = generateFallbackInterpretation("", "", "medium")

    return NextResponse.json({
      interpretation: fallbackInterpretation,
      source: "error-fallback",
      error: error.message || "An unexpected error occurred",
    })
  }
}
