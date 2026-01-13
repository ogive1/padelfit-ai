import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Dumbbell, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Exercise Library",
  description:
    "50+ physiotherapist-approved exercises for padel injury prevention. Warm-ups, stretches, strength training, and recovery routines.",
};

const categories = [
  { value: "all", label: "All Exercises" },
  { value: "warmup", label: "Warm-up" },
  { value: "stretching", label: "Stretching" },
  { value: "strength", label: "Strength" },
  { value: "recovery", label: "Recovery" },
  { value: "mobility", label: "Mobility" },
];

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const supabase = await createServiceClient();
  const category = searchParams.category || "all";

  let query = supabase
    .from("exercises")
    .select("*")
    .order("sort_order", { ascending: true });

  if (category !== "all") {
    query = query.eq("category", category);
  }

  const { data: exercises } = await query.limit(50);

  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h1 className="section-heading">Exercise Library</h1>
          <p className="section-subheading">
            50+ physiotherapist-approved exercises to prevent injuries and
            improve your padel game.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              href={cat.value === "all" ? "/exercises" : `/exercises?category=${cat.value}`}
            >
              <Button
                variant={category === cat.value ? "primary" : "secondary"}
                size="sm"
              >
                {cat.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Exercise Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {exercises?.map((exercise) => (
            <Card
              key={exercise.id}
              className={cn(
                "hover:shadow-md transition-all",
                exercise.is_premium && "relative overflow-hidden"
              )}
            >
              {exercise.is_premium && (
                <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Pro
                </div>
              )}
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-lg flex-shrink-0",
                      exercise.category === "warmup" && "bg-orange-100",
                      exercise.category === "stretching" && "bg-blue-100",
                      exercise.category === "strength" && "bg-red-100",
                      exercise.category === "recovery" && "bg-green-100",
                      exercise.category === "mobility" && "bg-purple-100"
                    )}
                  >
                    <Dumbbell
                      className={cn(
                        "h-6 w-6",
                        exercise.category === "warmup" && "text-orange-600",
                        exercise.category === "stretching" && "text-blue-600",
                        exercise.category === "strength" && "text-red-600",
                        exercise.category === "recovery" && "text-green-600",
                        exercise.category === "mobility" && "text-purple-600"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {exercise.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {exercise.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {exercise.reps || `${exercise.duration_seconds}s`}
                      </span>
                      <span className="capitalize px-2 py-0.5 bg-gray-100 rounded">
                        {exercise.difficulty}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {exercise.target_areas?.slice(0, 2).map((area: string) => (
                        <span
                          key={area}
                          className="text-xs px-2 py-0.5 bg-primary-50 text-primary-700 rounded"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!exercises || exercises.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-600">No exercises found in this category.</p>
            <Link href="/exercises" className="mt-4 inline-block">
              <Button variant="secondary">View All Exercises</Button>
            </Link>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900">
              Get Personalized Exercise Plans
            </h2>
            <p className="mt-2 text-gray-600">
              Take our injury risk quiz and get a customized exercise plan
              based on your specific needs.
            </p>
            <Link href="/signup" className="mt-6 inline-block">
              <Button size="lg">
                Start Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
