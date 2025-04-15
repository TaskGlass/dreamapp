import OpenAI from "openai"

// Initialize the OpenAI client
const getOpenAIClient = () => {
  // Check if API key exists
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("OpenAI API key is missing")
  }

  return new OpenAI({
    apiKey: apiKey,
  })
}

export async function generateDreamInterpretation(dreamContent: string, dreamEmotion: string, dreamClarity: string) {
  try {
    // Create the OpenAI client
    const openai = getOpenAIClient()

    console.log("Using OpenAI for dream interpretation")

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
          Content: ${dreamContent}
          Primary emotion: ${dreamEmotion || "Not specified"}
          Dream clarity: ${dreamClarity || "medium"}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000,
      timeout: 15000, // 15 second timeout
    })

    // Parse the JSON response
    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error("Empty response from OpenAI")
    }

    try {
      const interpretation = JSON.parse(content)

      // Validate the response structure
      if (!interpretation.interpretation || !interpretation.symbols || !interpretation.actions) {
        throw new Error("Invalid response format from OpenAI")
      }

      return interpretation
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError)
      throw new Error("Invalid JSON response from OpenAI")
    }
  } catch (error) {
    console.error("OpenAI API error:", error)
    throw error
  }
}
