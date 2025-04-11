// This file is only used on the server
import "server-only"
import OpenAI from "openai"

// Initialize the OpenAI client
const apiKey = process.env.OPENAI_API_KEY
let openaiClient: OpenAI | null = null

// Only initialize the client on the server
if (apiKey) {
  try {
    openaiClient = new OpenAI({
      apiKey: apiKey,
    })
  } catch (error) {
    console.error("Failed to initialize OpenAI client:", error)
  }
}

export async function generateDreamInterpretation(content: string, emotion: string, clarity: string) {
  // If client isn't initialized, return null to trigger fallback
  if (!openaiClient) {
    console.warn("OpenAI client not initialized, using fallback interpretation")
    return null
  }

  try {
    console.log("Using OpenAI API for dream interpretation")

    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
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
    })

    // Parse and validate the response
    const responseContent = response.choices[0]?.message?.content
    if (!responseContent) {
      throw new Error("Empty response from OpenAI")
    }

    try {
      const parsedResponse = JSON.parse(responseContent)
      if (!parsedResponse.interpretation || !parsedResponse.symbols || !parsedResponse.actions) {
        throw new Error("Invalid response format from OpenAI")
      }
      return parsedResponse
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError)
      throw new Error("Invalid JSON response from OpenAI")
    }
  } catch (error) {
    console.error("OpenAI API error:", error)
    // Return null to trigger fallback
    return null
  }
}
