// This file is only used on the server
import "server-only"

// Check if we should use the Grok API
export function shouldUseGrokAPI() {
  // If USE_FALLBACK_ONLY is set to true, don't use Grok API
  if (process.env.USE_FALLBACK_ONLY === "true") {
    return false
  }

  // Check if Grok API key is available
  return !!process.env.GROK_API_KEY
}

// Get the correct API endpoint for Grok
export function getGrokAPIEndpoint() {
  // Default to a standard endpoint if none is provided
  return process.env.GROK_API_ENDPOINT || "https://api.grok.ai/v1/chat/completions"
}
