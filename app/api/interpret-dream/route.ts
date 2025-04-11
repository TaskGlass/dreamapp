import { NextResponse } from "next/server"
import { generateFallbackInterpretation } from "@/lib/fallback-interpretation"

// Check if Grok API is configured
const isGrokConfigured = process.env.GROK_API_KEY && process.env.GROK_API_ENDPOINT

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

    // Check if we should use fallback
    if (process.env.USE_FALLBACK_ONLY === "true" || !isGrokConfigured) {
      console.log("Using fallback interpretation service")
      const interpretation = generateFallbackInterpretation(content, emotion || "", clarity || "medium")
      return NextResponse.json({
        interpretation,
        source: "fallback",
      })
    }

    // Use Grok for interpretation
    console.log("Using Grok for dream interpretation")
    try {
      // Ensure all JSON objects are properly formatted
      // Check for any unclosed brackets or parentheses

      // Make sure the Grok API request is properly formatted
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      const response = await fetch(process.env.GROK_API_ENDPOINT!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "grok-1",
          messages: [
            {
              role: "system",
              content: `You are an expert dream interpreter with deep knowledge of psychology, symbolism, and subconscious meaning. 
              Analyze dreams with empathy and insight, providing meaningful interpretations that help the dreamer understand their subconscious.
              Structure your response in JSON format with the following fields:
              - interpretation: A detailed interpretation of the dream (500-800 characters)
              - symbols: An array of objects with 'name' and 'meaning' for key symbols in the dream (3-5 symbols)
              - actions: An array of strings with recommended actions based on the dream (3-5 actions)`,
            },
            {
              role: "user",
              content: `Interpret this dream:
              Content: ${content}
              Primary emotion: ${emotion || "Not specified"}
              Dream clarity: ${clarity || "medium"}`,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 1000,
        }),
        signal: controller.signal,
      })

      // Clear the timeout
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Grok API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Parse the response
      const responseContent = data.choices[0]?.message?.content
      if (!responseContent) {
        throw new Error("Empty response from Grok")
      }

      const interpretation = JSON.parse(responseContent)
      return NextResponse.json({
        interpretation,
        source: "grok",
      })
    } catch (aiError) {
      console.error("Grok API error:", aiError)
      // Fall back to local interpretation if Grok fails
      console.log("Falling back to local interpretation")
      const interpretation = generateFallbackInterpretation(content, emotion || "", clarity || "medium")
      return NextResponse.json({
        interpretation,
        source: "fallback",
      })
    }
  } catch (error: any) {
    console.error("Error processing dream interpretation request:", error)
    return NextResponse.json(
      {
        error: "Failed to interpret dream",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
