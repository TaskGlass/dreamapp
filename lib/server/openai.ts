// This file is only used on the server
import "server-only"
import OpenAI from "openai"
import { generateFallbackInterpretation } from "../fallback-interpretation"

// Initialize the OpenAI client
let openaiClient: OpenAI | null = null

// This function ensures the client is only created on the server
export async function generateDreamInterpretation(dreamContent: string, dreamEmotion: string, dreamClarity: string) {
  // Initialize the client only when needed and only on the server
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.warn("OpenAI API key not configured, using fallback interpretation")
      return generateFallbackInterpretation(dreamContent, dreamEmotion, dreamClarity)
    }

    try {
      openaiClient = new OpenAI({
        apiKey: apiKey,
      })
    } catch (error) {
      console.error("Failed to initialize OpenAI client:", error)
      return generateFallbackInterpretation(dreamContent, dreamEmotion, dreamClarity)
    }
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
          Content: ${dreamContent}
          Primary emotion: ${dreamEmotion || "Not specified"}
          Dream clarity: ${dreamClarity || "medium"}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000,
      timeout: 30000, // 30 second timeout
    })

    console.log("OpenAI API response received")

    // Validate the response
    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error("Empty response from OpenAI")
    }

    try {
      // Parse and validate the JSON
      const parsedResponse = JSON.parse(content)
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
    // Fall back to local interpretation
    console.log("Falling back to local interpretation")
    return generateFallbackInterpretation(dreamContent, dreamEmotion, dreamClarity)
  }
}
