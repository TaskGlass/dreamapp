"use server"

// This file contains server-only code
import OpenAI from "openai"

// Fallback interpretation function
function generateFallbackInterpretation(dreamContent: string, dreamEmotion: string, dreamClarity: string) {
  return {
    interpretation:
      "Your dream appears to reflect your subconscious processing recent experiences and emotions. Dreams often serve as a way for our minds to work through unresolved feelings and situations from our waking life. The specific imagery and emotions in your dream may connect to current challenges or desires you're experiencing.",
    symbols: [
      {
        name: "Dream Setting",
        meaning: "The environment in your dream represents your current emotional landscape or life situation.",
      },
      {
        name: "Dream Characters",
        meaning:
          "People in your dreams often represent aspects of yourself or individuals who have emotional significance in your life.",
      },
      {
        name: "Emotional Tone",
        meaning: `The ${dreamEmotion || "emotions"} you experienced suggest these feelings may need attention in your waking life.`,
      },
    ],
    actions: [
      "Reflect on how the emotions in your dream connect to your current life situation",
      "Journal about any personal associations you have with the key elements in your dream",
      "Consider how this dream might be helping you process recent experiences",
      "Pay attention to recurring themes if this dream happens again",
    ],
  }
}

// Server action for dream interpretation
export async function interpretDream(formData: FormData) {
  try {
    const content = formData.get("content") as string
    const emotion = formData.get("emotion") as string
    const clarity = formData.get("clarity") as string

    if (!content) {
      return { error: "Dream content is required" }
    }

    try {
      // Initialize OpenAI client only on the server
      const apiKey = process.env.OPENAI_API_KEY
      if (!apiKey) {
        console.warn("OpenAI API key not configured, using fallback interpretation")
        return { interpretation: generateFallbackInterpretation(content, emotion || "", clarity || "medium") }
      }

      // Create OpenAI client
      const openai = new OpenAI({
        apiKey: apiKey,
      })

      // Generate interpretation
      const response = await openai.chat.completions.create({
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
        return { interpretation: parsedResponse }
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", parseError)
        throw new Error("Invalid JSON response from OpenAI")
      }
    } catch (interpretError) {
      console.error("Error generating interpretation:", interpretError)

      // Use fallback interpretation if OpenAI fails
      console.log("Using fallback interpretation")
      return { interpretation: generateFallbackInterpretation(content, emotion || "", clarity || "medium") }
    }
  } catch (error: any) {
    console.error("Error processing dream interpretation request:", error)
    return {
      error: "Failed to interpret dream",
      message: error.message || "An unexpected error occurred",
    }
  }
}
