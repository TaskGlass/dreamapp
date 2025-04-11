// This file is only used on the server
import "server-only"
import { getClientFallbackInterpretation } from "../client-fallback"

export async function generateFallbackInterpretation(content: string, emotion: string, clarity: string) {
  console.log("Using server-side fallback interpretation service")

  // Use the same client fallback function but wrap it in a Promise to mimic the API service
  return new Promise((resolve) => {
    const interpretation = getClientFallbackInterpretation(content, emotion, clarity)
    resolve(interpretation)
  })
}
