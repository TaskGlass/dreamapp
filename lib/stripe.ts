import Stripe from "stripe"
import { supabase } from "./supabase" // Import supabase

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16", // Use the latest API version
})

export const getStripeCustomer = async (userId: string) => {
  // Check if customer exists in Supabase
  const { data: profile } = await supabase.from("profiles").select("stripe_customer_id").eq("id", userId).single()

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id
  }

  // If not, create a new customer
  const { data: userData } = await supabase.from("profiles").select("email, name").eq("id", userId).single()

  const customer = await stripe.customers.create({
    email: userData.email,
    name: userData.name,
    metadata: {
      userId,
    },
  })

  // Save customer ID to Supabase
  await supabase.from("profiles").update({ stripe_customer_id: customer.id }).eq("id", userId)

  return customer.id
}

export const createCheckoutSession = async (userId: string, priceId: string, returnUrl: string) => {
  const customerId = await getStripeCustomer(userId)

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${returnUrl}/dashboard?subscription=success`,
    cancel_url: `${returnUrl}/pricing?subscription=canceled`,
    metadata: {
      userId,
    },
  })

  return session
}

export const createPortalSession = async (userId: string, returnUrl: string) => {
  const customerId = await getStripeCustomer(userId)

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${returnUrl}/dashboard/settings`,
  })

  return session
}
