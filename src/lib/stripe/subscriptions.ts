import { stripe, PLANS, type PlanType } from "./client";
import { createServiceClient } from "@/lib/supabase/server";

export async function createCheckoutSession({
  userId,
  email,
  plan,
  returnUrl,
}: {
  userId: string;
  email: string;
  plan: PlanType;
  returnUrl: string;
}) {
  const planDetails = PLANS[plan];

  if (!planDetails.priceId) {
    throw new Error("Cannot create checkout for free plan");
  }

  // Get or create Stripe customer
  const supabase = await createServiceClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single();

  let customerId = profile?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email,
      metadata: { userId },
    });
    customerId = customer.id;

    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", userId);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: planDetails.priceId,
        quantity: 1,
      },
    ],
    success_url: `${returnUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${returnUrl}?canceled=true`,
    metadata: {
      userId,
      plan,
    },
  });

  return session;
}

export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId);
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

export async function handleSubscriptionChange({
  subscriptionId,
  customerId,
  status,
  currentPeriodEnd,
}: {
  subscriptionId: string;
  customerId: string;
  status: string;
  currentPeriodEnd: number;
}) {
  const supabase = await createServiceClient();

  // Get user by Stripe customer ID
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!profile) {
    console.error("No profile found for customer:", customerId);
    return;
  }

  // Update subscription in database
  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: profile.id,
      stripe_subscription_id: subscriptionId,
      status,
      current_period_end: new Date(currentPeriodEnd * 1000).toISOString(),
    },
    {
      onConflict: "stripe_subscription_id",
    }
  );

  if (error) {
    console.error("Error updating subscription:", error);
    throw error;
  }

  // Update user's subscription tier
  const tier = status === "active" ? "pro" : "free"; // Simplified, expand as needed
  await supabase
    .from("profiles")
    .update({
      subscription_tier: tier,
      stripe_subscription_id: subscriptionId,
    })
    .eq("id", profile.id);
}
