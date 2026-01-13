import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Free",
    description: "Basic injury prevention tools",
    price: 0,
    priceId: null,
    features: [
      "Basic warm-up routine",
      "Injury risk quiz",
      "3 AI tips per week",
      "Limited exercise library",
    ],
  },
  pro: {
    name: "Pro",
    description: "Full access to injury prevention tools",
    price: 1200, // $12.00 in cents
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      "Everything in Free",
      "Full exercise library (50+ exercises)",
      "Personalized conditioning plans",
      "Unlimited AI coaching tips",
      "Email support",
      "Progress tracking",
    ],
  },
  elite: {
    name: "Elite",
    description: "Premium coaching and video analysis",
    price: 2900, // $29.00 in cents
    priceId: process.env.STRIPE_ELITE_PRICE_ID,
    features: [
      "Everything in Pro",
      "Video analysis feedback",
      "1-on-1 AI coaching sessions",
      "Priority support",
      "Custom training programs",
      "Injury recovery protocols",
    ],
  },
} as const;

export type PlanType = keyof typeof PLANS;
