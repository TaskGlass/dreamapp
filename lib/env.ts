// Environment configuration helper

// Check if we're in a development or preview environment
export const isDevelopmentOrPreview = () => {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.VERCEL_ENV === "preview" ||
    process.env.VERCEL_ENV === "development"
  )
}

// Check if we should use the fallback interpretation
export const shouldUseFallback = () => {
  return process.env.USE_FALLBACK_ONLY === "true" || !process.env.OPENAI_API_KEY
}
