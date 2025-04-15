"use server"

import { supabase } from "@/lib/supabase"
import { generateDreamInterpretation } from "@/lib/server/openai-service"
import { generateFallbackInterpretation } from "@/lib/fallback-interpretation"
import { revalidatePath } from "next/cache"
import OpenAI from "openai"

// Save a dream and its interpretation
export async function saveDream(
  userId: string,
  dreamData: {
    title: string
    content: string
    date: string
    emotion: string
    clarity: string
  },
) {
  try {
    // Insert the dream
    const { data: dream, error: dreamError } = await supabase
      .from("dreams")
      .insert({
        user_id: userId,
        title: dreamData.title,
        content: dreamData.content,
        date: dreamData.date,
        emotion: dreamData.emotion,
        clarity: dreamData.clarity as "low" | "medium" | "high",
      })
      .select()
      .single()

    if (dreamError) throw dreamError

    // Generate interpretation
    let interpretation
    let source = "fallback"

    try {
      // Try to use OpenAI
      interpretation = await generateDreamInterpretation(dreamData.content, dreamData.emotion, dreamData.clarity)
      source = "openai"
    } catch (error) {
      // Fall back to local interpretation
      console.error("Error generating OpenAI interpretation:", error)
      interpretation = generateFallbackInterpretation(dreamData.content, dreamData.emotion, dreamData.clarity)
    }

    // Save the interpretation
    const { error: interpretationError } = await supabase.from("interpretations").insert({
      dream_id: dream.id,
      interpretation_text: interpretation.interpretation,
      symbols: interpretation.symbols,
      actions: interpretation.actions,
    })

    if (interpretationError) throw interpretationError

    // Decrement dream credits if not subscribed
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_subscribed, dream_credits")
      .eq("id", userId)
      .single()

    if (profile && !profile.is_subscribed && profile.dream_credits > 0) {
      await supabase
        .from("profiles")
        .update({ dream_credits: profile.dream_credits - 1 })
        .eq("id", userId)
    }

    revalidatePath("/dashboard/dreams")

    return { dream, interpretation, source }
  } catch (error) {
    console.error("Error saving dream:", error)
    throw error
  }
}

// Get all dreams for a user
export async function getUserDreams(userId: string) {
  try {
    const { data, error } = await supabase
      .from("dreams")
      .select(`
        *,
        interpretations (*)
      `)
      .eq("user_id", userId)
      .order("date", { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching dreams:", error)
    throw error
  }
}

// Get a single dream with its interpretation
export async function getDream(dreamId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from("dreams")
      .select(`
        *,
        interpretations (*)
      `)
      .eq("id", dreamId)
      .eq("user_id", userId)
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error fetching dream:", error)
    throw error
  }
}

// Delete a dream
export async function deleteDream(dreamId: string, userId: string) {
  try {
    const { error } = await supabase.from("dreams").delete().eq("id", dreamId).eq("user_id", userId)

    if (error) throw error

    revalidatePath("/dashboard/dreams")
    return { success: true }
  } catch (error) {
    console.error("Error deleting dream:", error)
    throw error
  }
}

export async function interpretDreamServerAction(content: string, emotion: string, clarity: string) {
  try {
    // Check if we should use fallback
    if (process.env.USE_FALLBACK_ONLY === "true") {
      console.log("Using fallback interpretation (fallback only mode)")
      return {
        interpretation: generateFallbackInterpretation(content, emotion, clarity),
        source: "fallback",
      }
    }

    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.warn("OpenAI API key not configured, using fallback interpretation")
      return {
        interpretation: generateFallbackInterpretation(content, emotion, clarity),
        source: "fallback",
      }
    }

    // Create a new OpenAI client for this request
    const openai = new OpenAI({
      apiKey: apiKey,
    })

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

    const responseContent = response.choices[0]?.message?.content
    if (!responseContent) {
      throw new Error("Empty response from OpenAI")
    }

    const interpretation = JSON.parse(responseContent)
    return {
      interpretation,
      source: "openai",
    }
  } catch (error) {
    console.error("Error in interpretDreamServerAction:", error)
    return {
      interpretation: generateFallbackInterpretation(content, emotion, clarity),
      source: "fallback",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
