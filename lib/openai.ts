import OpenAI from "openai"

// Check if API key exists
const apiKey = process.env.OPENAI_API_KEY

// Initialize the OpenAI client with proper error handling
const getOpenAIClient = () => {
  if (!apiKey) {
    throw new Error("OpenAI API key is missing. Please add OPENAI_API_KEY to your environment variables.")
  }

  return new OpenAI({
    apiKey: apiKey,
  })
}

export async function generateDreamInterpretation(dreamContent: string, dreamEmotion: string, dreamClarity: string) {
  try {
    // Only create the client when needed
    const openai = getOpenAIClient()

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
          Primary emotion: ${dreamEmotion}
          Dream clarity: ${dreamClarity}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    })

    // Parse the JSON response
    const interpretation = JSON.parse(response.choices[0].message.content)
    return interpretation
  } catch (error) {
    console.error("Error generating dream interpretation:", error)
    throw error
  }
}
