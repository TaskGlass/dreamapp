import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { supabase } from "@/lib/supabase"

// This is your Stripe webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  const payload = await req.text()
  const sig = req.headers.get("stripe-signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object
      const userId = session.metadata.userId
      const subscriptionId = session.subscription

      // Retrieve subscription details
      const subscription = await stripe.subscriptions.retrieve(subscriptionId as string)
      const priceId = subscription.items.data[0].price.id

      // Determine plan type based on price ID
      let planType = "standard"
      if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY || priceId === process.env.STRIPE_PRICE_PRO_YEARLY) {
        planType = "pro"
      }

      // Calculate end date
      const endDate = new Date(subscription.current_period_end * 1000)

      // Determine dream credits based on plan type
      const dreamCredits = planType === "pro" ? 20 : 10

      // Update user subscription in database
      await supabase
        .from("profiles")
        .update({
          is_subscribed: true,
          subscription_plan: planType,
          subscription_end_date: endDate.toISOString(),
          stripe_subscription_id: subscriptionId,
          dream_credits: dreamCredits,
        })
        .eq("id", userId)

      break
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object
      const userId = (await stripe.customers.retrieve(subscription.customer as string)).metadata.userId

      // Calculate end date
      const endDate = new Date(subscription.current_period_end * 1000)

      // Update subscription end date
      await supabase
        .from("profiles")
        .update({
          subscription_end_date: endDate.toISOString(),
        })
        .eq("id", userId)

      break
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object
      const userId = (await stripe.customers.retrieve(subscription.customer as string)).metadata.userId

      // Update user subscription status
      await supabase
        .from("profiles")
        .update({
          is_subscribed: false,
          subscription_plan: "free",
          subscription_end_date: null,
          stripe_subscription_id: null,
        })
        .eq("id", userId)

      break
    }
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

export const config = {
  api: {
    bodyParser: false,
  },
}
