-- Add Stripe-related fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN stripe_customer_id text,
ADD COLUMN stripe_subscription_id text;
