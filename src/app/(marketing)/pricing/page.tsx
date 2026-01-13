import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { PLANS } from "@/lib/stripe/client";

export const metadata = {
  title: "Pricing",
  description:
    "Choose the perfect plan for your injury prevention journey. Start free or go Pro for full access.",
};

export default function PricingPage() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="section-heading">
            Simple, Transparent Pricing
          </h1>
          <p className="section-subheading">
            Start free and upgrade when you're ready. No hidden fees, cancel
            anytime.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-6">
          {/* Free Plan */}
          <div className="card flex flex-col">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {PLANS.free.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {PLANS.free.description}
              </p>
              <div className="mt-6">
                <span className="font-heading text-4xl font-bold text-gray-900">
                  $0
                </span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>
            <div className="flex-1 p-6 pt-0">
              <ul className="space-y-3">
                {PLANS.free.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary-600" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 pt-0">
              <Link href="/signup">
                <Button variant="secondary" className="w-full">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>

          {/* Pro Plan - Featured */}
          <div className="card flex flex-col border-2 border-primary-600 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-primary-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                Most Popular
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {PLANS.pro.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {PLANS.pro.description}
              </p>
              <div className="mt-6">
                <span className="font-heading text-4xl font-bold text-gray-900">
                  ${PLANS.pro.price / 100}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>
            <div className="flex-1 p-6 pt-0">
              <ul className="space-y-3">
                {PLANS.pro.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary-600" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 pt-0">
              <Link href="/signup?plan=pro">
                <Button className="w-full">Start Pro Trial</Button>
              </Link>
            </div>
          </div>

          {/* Elite Plan */}
          <div className="card flex flex-col">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {PLANS.elite.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {PLANS.elite.description}
              </p>
              <div className="mt-6">
                <span className="font-heading text-4xl font-bold text-gray-900">
                  ${PLANS.elite.price / 100}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>
            <div className="flex-1 p-6 pt-0">
              <ul className="space-y-3">
                {PLANS.elite.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary-600" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 pt-0">
              <Link href="/signup?plan=elite">
                <Button variant="secondary" className="w-full">
                  Start Elite Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes! You can cancel your subscription at any time. You'll keep access until the end of your billing period.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes! The Free plan is free forever. For Pro and Elite, you get full access to all features from day one.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment system.",
              },
              {
                q: "Can I switch plans later?",
                a: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, we offer a 14-day money-back guarantee. If you're not satisfied, contact us for a full refund.",
              },
              {
                q: "Is my data secure?",
                a: "Yes! We use industry-standard encryption and never share your data with third parties.",
              },
            ].map((faq) => (
              <div key={faq.q} className="card">
                <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                <p className="mt-2 text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
