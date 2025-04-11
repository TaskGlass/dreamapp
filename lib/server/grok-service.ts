// This file is only used on the server
import "server-only"
import { shouldUseGrokAPI, getGrokAPIEndpoint } from "./api-config"

// Initialize the Grok client
const apiKey = process.env.GROK_API_KEY

// Type definitions for Grok API responses
interface GrokResponse {
  choices: {
    message: {
      content: string
    }
  }[]
}

export async function generateDreamInterpretation(content: string, emotion: string, clarity: string) {
  // Check if we should use the Grok API
  if (!shouldUseGrokAPI()) {
    console.log("Grok API is disabled or not configured, using fallback interpretation")
    return null
  }

  try {
    console.log("Initializing Grok API request with dream content length:", content.length)

    // Create a controller for the timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

    try {
      // Get the API endpoint
      const apiEndpoint = getGrokAPIEndpoint()
      console.log(`Using Grok API endpoint: ${apiEndpoint}`)

      // Make API request to Grok
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
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
        const errorText = await response.text().catch(() => "Could not read error response")
        console.error(`Grok API error: ${response.status} ${response.statusText}`, errorText)
        throw new Error(`Grok API error: ${response.status} ${response.statusText}`)
      }

      const data: GrokResponse = await response.json()
      console.log("Received Grok API response successfully")

      // Parse and validate the response
      const responseContent = data.choices[0]?.message?.content
      if (!responseContent) {
        console.error("Empty response content from Grok API")
        throw new Error("Empty response from Grok")
      }

      try {
        const parsedResponse = JSON.parse(responseContent)

        // Validate the response structure
        if (!parsedResponse.interpretation) {
          console.error("Missing interpretation field in Grok response")
          throw new Error("Invalid response format from Grok: missing interpretation")
        }

        if (!Array.isArray(parsedResponse.symbols) || parsedResponse.symbols.length === 0) {
          console.error("Missing or invalid symbols array in Grok response")
          throw new Error("Invalid response format from Grok: missing symbols")
        }

        if (!Array.isArray(parsedResponse.actions) || parsedResponse.actions.length === 0) {
          console.error("Missing or invalid actions array in Grok response")
          throw new Error("Invalid response format from Grok: missing actions")
        }

        console.log("Successfully parsed and validated Grok response")
        return parsedResponse
      } catch (parseError) {
        console.error("Failed to parse Grok response:", parseError, "Response content:", responseContent)
        throw new Error("Invalid JSON response from Grok")
      }
    } catch (fetchError) {
      // Clear the timeout if there was a fetch error
      clearTimeout(timeoutId)

      // Log detailed fetch error
      console.error("Fetch error with Grok API:", fetchError)
      throw fetchError
    }
  } catch (error) {
    console.error("Grok API error:", error)
    // Return null to trigger fallback
    return null
  }
}
