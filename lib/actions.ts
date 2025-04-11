"use server"

import { supabase } from "./supabaseClient"
import type { User } from "./supabaseClient"

/**
 * Updates a user's profile information in the database
 * @param updates Partial user object with fields to update
 * @returns Promise that resolves when the update is complete
 */
export async function updateUser(updates: Partial<User>) {
  if (!updates.id) {
    throw new Error("User ID is required for updates")
  }

  try {
    const { error } = await supabase.from("profiles").update(updates).eq("id", updates.id)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

/**
 * Decrements a user's dream credits by the specified amount
 * @param userId The user's ID
 * @param amount The amount to decrement (defaults to 1)
 * @returns Promise that resolves when the update is complete
 */
export async function decrementDreamCredits(userId: string, amount = 1) {
  try {
    // First get the current credits
    const { data, error } = await supabase.from("profiles").select("dream_credits").eq("id", userId).single()

    if (error) throw error
    if (!data) throw new Error("User not found")

    const currentCredits = data.dream_credits
    const newCredits = Math.max(0, currentCredits - amount) // Ensure credits don't go below 0

    // Update the credits
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ dream_credits: newCredits })
      .eq("id", userId)

    if (updateError) throw updateError

    return { success: true, remainingCredits: newCredits }
  } catch (error) {
    console.error("Error decrementing dream credits:", error)
    throw error
  }
}
