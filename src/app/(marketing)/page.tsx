import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Zap,
  Brain,
  Activity,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    name: "AI-Powered Warm-ups",
    description:
      "Get personalized warm-up routines based on your injury history, playing style, and target areas.",
    icon: Brain,
  },
  {
    name: "Injury Risk Assessment",
    description:
      "Take our comprehensive quiz to understand your injury risk and get tailored prevention strategies.",
    icon: Shield,
  },
  {
    name: "50+ Expert Exercises",
    description:
      "Access our library of physiotherapist-approved exercises for prevention and recovery.",
    icon: Activity,
  },
  {
    name: "Progress Tracking",
    description:
      "Monitor your conditioning progress and see how your injury risk decreases over time.",
    icon: TrendingUp,
  },
  {
    name: "AI Coach Chat",
    description:
      "Get instant answers to your injury prevention questions from our AI coaching assistant.",
    icon: Zap,
  },
  {
    name: "Community Support",
    description:
      "Join thousands of padel players committed to staying injury-free and playing longer.",
    icon: Users,
  },
];

const stats = [
  { value: "30%", label: "of padel players get injured each year" },
  { value: "80%", label: "of injuries are preventable with proper warm-up" },
  { value: "92%", label: "player return rate - highest of any racket sport" },
  { value: "30M+", label: "padel players worldwide" },
];

const testimonials = [
  {
    content:
      "After years of recurring elbow pain, PadelFit AI's personalized warm-up routine has kept me injury-free for 6 months straight.",
    author: "Carlos M.",
    role: "Club player, Madrid",
  },
  {
    content:
      "The injury risk quiz identified weaknesses I didn't even know I had. The recommended exercises made a huge difference.",
    author: "Sarah K.",
    role: "Tournament player, London",
  },
  {
    content:
      "I used to skip warm-ups entirely. Now I spend 10 minutes with PadelFit AI before every match and haven't had an injury since.",
    author: "Marco T.",
    role: "Recreational player, Rome",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container py-20 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Prevent Injuries.{" "}
              <span className="text-primary-600">Play Longer.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 sm:text-xl">
              AI-powered injury prevention for padel players. Personalized
              warm-up routines, conditioning plans, and expert guidance to keep
              you on the court.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/tools/injury-risk-quiz">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Take Injury Risk Quiz
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Free forever for basic features. No credit card required.
            </p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl" />
      </section>

      {/* Stats Section */}
      <section className="bg-primary-600 py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading text-3xl font-bold text-white sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-primary-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="section-heading">
              Everything You Need to Stay Injury-Free
            </h2>
            <p className="section-subheading">
              Our AI-powered platform combines sports science with personalized
              recommendations to keep you playing at your best.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {feature.name}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-20 lg:py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="section-heading">How It Works</h2>
            <p className="section-subheading">
              Get started in minutes and start preventing injuries today.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Take the Quiz",
                description:
                  "Complete our injury risk assessment to identify your weak points and injury-prone areas.",
              },
              {
                step: "02",
                title: "Get Your Plan",
                description:
                  "Receive a personalized warm-up routine and conditioning plan based on your results.",
              },
              {
                step: "03",
                title: "Stay Injury-Free",
                description:
                  "Follow your plan, track your progress, and enjoy playing padel without pain.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-4 text-gray-600 pl-16">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="section-heading">Trusted by Players Worldwide</h2>
            <p className="section-subheading">
              Join thousands of padel players who are staying injury-free with
              PadelFit AI.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.author} className="card">
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
                <div className="mt-6">
                  <p className="font-semibold text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
              Ready to Play Without Pain?
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Join thousands of padel players who trust PadelFit AI to keep them
              on the court.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-100"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white text-white hover:bg-primary-700"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="mx-auto max-w-3xl prose prose-gray">
            <h2>Why Injury Prevention Matters for Padel Players</h2>
            <p>
              Padel is one of the fastest-growing sports in the world, with over
              30 million players globally. However, the sport's unique
              combination of quick lateral movements, overhead smashes, and
              repetitive motions puts players at risk for various injuries.
            </p>
            <p>
              The most common padel injuries include shoulder impingement, tennis
              elbow (lateral epicondylitis), knee injuries, and lower back pain.
              Research shows that up to 30% of padel players experience an injury
              each year, but the good news is that 80% of these injuries are
              preventable with proper warm-up routines and conditioning.
            </p>
            <h3>How PadelFit AI Helps You Stay Injury-Free</h3>
            <p>
              PadelFit AI uses artificial intelligence to create personalized
              injury prevention plans based on your specific risk factors,
              playing style, and injury history. Our platform combines the latest
              sports science research with practical exercises that you can do in
              just 10 minutes before each match.
            </p>
            <ul>
              <li>
                <strong>Personalized warm-up routines</strong> targeting your
                specific weak points
              </li>
              <li>
                <strong>50+ expert-approved exercises</strong> for prevention and
                recovery
              </li>
              <li>
                <strong>AI coaching</strong> that adapts to your progress and
                feedback
              </li>
              <li>
                <strong>Progress tracking</strong> to see your improvement over
                time
              </li>
            </ul>
            <p>
              Whether you're a recreational player or competing in tournaments,
              PadelFit AI helps you stay on the court and enjoy the sport you
              love without pain or injury.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
