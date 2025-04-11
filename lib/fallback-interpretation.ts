// Enhanced fallback interpretation function that doesn't require any API keys
export function generateFallbackInterpretation(dreamContent: string, dreamEmotion: string, dreamClarity: string) {
  // Extract keywords from the dream content to make the interpretation more relevant
  const keywords = extractKeywords(dreamContent)

  // Get a random interpretation template and fill it with the keywords
  const interpretationTemplate = getRandomInterpretationTemplate(keywords, dreamEmotion)

  // Generate symbols based on the keywords
  const symbols = generateSymbols(keywords, dreamEmotion)

  // Generate recommended actions
  const actions = generateActions(keywords, dreamEmotion, dreamClarity)

  return {
    interpretation: interpretationTemplate,
    symbols,
    actions,
  }
}

// Helper function to extract keywords from the dream content
function extractKeywords(content: string): string[] {
  if (!content) return ["elements", "symbols"]

  // Simple keyword extraction - in a real app, this could be more sophisticated
  const words = content.toLowerCase().split(/\s+/)
  const commonWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "with",
    "by",
    "about",
    "like",
    "was",
    "were",
    "is",
    "are",
    "am",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "should",
    "could",
    "may",
    "might",
    "must",
    "can",
    "of",
    "from",
    "as",
    "i",
    "me",
    "my",
    "mine",
    "myself",
    "you",
    "your",
    "yours",
    "yourself",
    "he",
    "him",
    "his",
    "himself",
    "she",
    "her",
    "hers",
    "herself",
    "it",
    "its",
    "itself",
    "we",
    "us",
    "our",
    "ours",
    "ourselves",
    "they",
    "them",
    "their",
    "theirs",
    "themselves",
  ])

  // Filter out common words and get unique keywords
  const filteredWords = words.filter((word) => word.length > 3 && !commonWords.has(word))

  // Get unique words and take the first 5
  const uniqueWords = [...new Set(filteredWords)].slice(0, 5)

  return uniqueWords.length > 0 ? uniqueWords : ["elements", "symbols"]
}

// Function to get a random interpretation template and fill it with keywords
function getRandomInterpretationTemplate(keywords: string[], emotion: string): string {
  const templates = [
    `Your dream about ${keywords.join(", ")} reflects your subconscious processing recent experiences and emotions. The imagery and themes in your dream suggest connections to your current life situation that may need attention. Dreams often serve as a way for our minds to work through unresolved feelings and experiences from our waking life.`,

    `The presence of ${keywords[0] || "certain elements"} in your dream, along with ${keywords[1] || "other symbols"}, suggests that your mind is exploring themes related to personal growth and self-discovery. The ${emotion || "emotions"} you experienced during this dream indicate that these themes hold significant meaning for you right now.`,

    `Dreams featuring ${keywords[0] || "such imagery"} often represent your inner thoughts about change and transformation. The appearance of ${keywords[1] || "certain elements"} alongside ${keywords[2] || "other symbols"} suggests that you may be processing feelings about a transition or evolution in your waking life.`,

    `This dream about ${keywords.join(" and ")} appears to be reflecting your inner emotional landscape. The subconscious often uses such imagery to process complex feelings that may not be fully acknowledged in your waking hours. Pay attention to how these symbols connect to your current life circumstances.`,

    `The symbolism of ${keywords[0] || "the elements"} in your dream, combined with the presence of ${keywords[1] || "other symbols"}, suggests that your mind is working through important emotional material. Dreams like this often emerge when we're processing significant life events or considering important decisions.`,
  ]

  // Select a random template
  const randomIndex = Math.floor(Math.random() * templates.length)
  return templates[randomIndex]
}

// Function to generate symbols based on keywords
function generateSymbols(keywords: string[], emotion: string): { name: string; meaning: string }[] {
  const symbols = []

  // Add symbols based on keywords
  if (keywords[0]) {
    symbols.push({
      name: capitalizeFirstLetter(keywords[0]),
      meaning: `The ${keywords[0]} in your dream represents your current emotional landscape or life situation. It may symbolize aspects of yourself that you're currently exploring or developing.`,
    })
  } else {
    symbols.push({
      name: "Dream Setting",
      meaning: "The environment in your dream represents your current emotional landscape or life situation.",
    })
  }

  if (keywords[1]) {
    symbols.push({
      name: capitalizeFirstLetter(keywords[1]),
      meaning: `The presence of ${keywords[1]} suggests that you're processing feelings related to personal connections or significant relationships in your life.`,
    })
  } else {
    symbols.push({
      name: "Dream Characters",
      meaning:
        "People or beings in your dream often represent aspects of yourself or significant influences in your life.",
    })
  }

  // Always add an emotion-based symbol
  symbols.push({
    name: "Emotional Tone",
    meaning: `The ${emotion || "emotions"} you experienced suggest these feelings may need attention in your waking life. Your dream is helping you process these emotions in a safe space.`,
  })

  return symbols
}

// Function to generate recommended actions
function generateActions(keywords: string[], emotion: string, clarity: string): string[] {
  const baseActions = [
    "Reflect on how the emotions in your dream connect to your current life situation",
    "Journal about any personal associations you have with the key elements in your dream",
    "Consider how this dream might be helping you process recent experiences",
    "Pay attention to recurring themes if this dream happens again",
  ]

  // Add a keyword-specific action if we have keywords
  if (keywords.length > 0) {
    baseActions.push(
      `Explore what ${keywords[0]} means to you personally and how it relates to your current life journey`,
    )
  }

  // Add an emotion-specific action if we have an emotion
  if (emotion) {
    baseActions.push(`Take time to acknowledge and process feelings of ${emotion.toLowerCase()} in your waking life`)
  }

  // Add a clarity-specific action
  if (clarity === "low") {
    baseActions.push("Practice dream recall techniques before sleep to improve dream clarity in the future")
  } else if (clarity === "high") {
    baseActions.push("Consider keeping a dream symbol dictionary to track personal meanings of recurring symbols")
  }

  // Return 4-5 actions
  return baseActions.slice(0, 5)
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
