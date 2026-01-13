"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Shield,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const questions = [
  {
    id: "playing_frequency",
    question: "How often do you play padel?",
    options: [
      { value: "1-2", label: "1-2 times per week" },
      { value: "3-4", label: "3-4 times per week" },
      { value: "5+", label: "5+ times per week" },
      { value: "daily", label: "Daily" },
    ],
  },
  {
    id: "warmup_habit",
    question: "Do you warm up before playing?",
    options: [
      { value: "never", label: "Never" },
      { value: "sometimes", label: "Sometimes (when I remember)" },
      { value: "usually", label: "Usually (most of the time)" },
      { value: "always", label: "Always (every session)" },
    ],
  },
  {
    id: "previous_injuries",
    question: "Have you had any padel-related injuries in the past year?",
    options: [
      { value: "none", label: "No injuries" },
      { value: "minor", label: "Minor (pain that resolved quickly)" },
      { value: "moderate", label: "Moderate (needed rest/treatment)" },
      { value: "serious", label: "Serious (needed medical attention)" },
    ],
  },
  {
    id: "pain_areas",
    question: "Do you currently experience any recurring pain or discomfort?",
    options: [
      { value: "none", label: "No pain" },
      { value: "shoulder", label: "Shoulder pain" },
      { value: "elbow", label: "Elbow pain (tennis/padel elbow)" },
      { value: "knee", label: "Knee pain" },
      { value: "back", label: "Lower back pain" },
      { value: "multiple", label: "Multiple areas" },
    ],
  },
  {
    id: "age_group",
    question: "What is your age group?",
    options: [
      { value: "under25", label: "Under 25" },
      { value: "25-35", label: "25-35" },
      { value: "36-45", label: "36-45" },
      { value: "46-55", label: "46-55" },
      { value: "55+", label: "55+" },
    ],
  },
  {
    id: "fitness_level",
    question: "How would you describe your overall fitness level?",
    options: [
      { value: "beginner", label: "Beginner (just starting out)" },
      { value: "moderate", label: "Moderate (some regular exercise)" },
      { value: "good", label: "Good (regular exercise routine)" },
      { value: "excellent", label: "Excellent (very active lifestyle)" },
    ],
  },
  {
    id: "strength_training",
    question: "Do you do any strength or conditioning training?",
    options: [
      { value: "never", label: "Never" },
      { value: "rarely", label: "Rarely (once a month or less)" },
      { value: "sometimes", label: "Sometimes (1-2 times per week)" },
      { value: "regularly", label: "Regularly (3+ times per week)" },
    ],
  },
  {
    id: "recovery_practice",
    question: "What recovery practices do you follow after playing?",
    options: [
      { value: "none", label: "None" },
      { value: "stretching", label: "Light stretching" },
      { value: "full", label: "Stretching + foam rolling" },
      { value: "comprehensive", label: "Full recovery routine (stretching, foam rolling, ice/heat)" },
    ],
  },
];

interface Assessment {
  overallRisk: "low" | "moderate" | "high";
  riskScore: number;
  riskAreas: { area: string; risk: string; explanation: string }[];
  recommendations: {
    priority: number;
    title: string;
    description: string;
    exercises: string[];
  }[];
  summary: string;
}

export default function InjuryRiskQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const router = useRouter();

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/ai/injury-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) throw new Error("Failed to submit assessment");

      const data = await response.json();
      setAssessment(data);
    } catch (error) {
      console.error("Error submitting assessment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = questions[currentQuestion];
  const isCurrentAnswered = answers[currentQ?.id];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const allAnswered = questions.every((q) => answers[q.id]);

  if (assessment) {
    return (
      <section className="py-20">
        <div className="container max-w-3xl">
          <div className="text-center mb-8">
            <div
              className={cn(
                "mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4",
                assessment.overallRisk === "low"
                  ? "bg-green-100"
                  : assessment.overallRisk === "moderate"
                  ? "bg-yellow-100"
                  : "bg-red-100"
              )}
            >
              {assessment.overallRisk === "low" ? (
                <Shield className="h-10 w-10 text-green-600" />
              ) : assessment.overallRisk === "moderate" ? (
                <AlertTriangle className="h-10 w-10 text-yellow-600" />
              ) : (
                <AlertTriangle className="h-10 w-10 text-red-600" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Injury Risk Assessment
            </h1>
            <p className="mt-2 text-lg text-gray-600">{assessment.summary}</p>
          </div>

          <div className="grid gap-6">
            {/* Risk Score */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium">Overall Risk Level</span>
                  <span
                    className={cn(
                      "px-4 py-2 rounded-full font-bold capitalize",
                      assessment.overallRisk === "low"
                        ? "bg-green-100 text-green-700"
                        : assessment.overallRisk === "moderate"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    )}
                  >
                    {assessment.overallRisk}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={cn(
                      "h-4 rounded-full transition-all",
                      assessment.overallRisk === "low"
                        ? "bg-green-500"
                        : assessment.overallRisk === "moderate"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    )}
                    style={{ width: `${assessment.riskScore}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Risk Score: {assessment.riskScore}/100
                </p>
              </CardContent>
            </Card>

            {/* Risk Areas */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Risk Areas</h3>
                <div className="space-y-3">
                  {assessment.riskAreas.map((area, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full mt-1.5 flex-shrink-0",
                          area.risk === "low"
                            ? "bg-green-500"
                            : area.risk === "moderate"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        )}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{area.area}</p>
                        <p className="text-sm text-gray-600">
                          {area.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Personalized Recommendations
                </h3>
                <div className="space-y-4">
                  {assessment.recommendations.map((rec, index) => (
                    <div key={index} className="border-l-4 border-primary-500 pl-4">
                      <h4 className="font-medium text-gray-900">{rec.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {rec.description}
                      </p>
                      {rec.exercises.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-500 uppercase">
                            Recommended Exercises:
                          </p>
                          <ul className="mt-1 space-y-1">
                            {rec.exercises.map((exercise, exIndex) => (
                              <li
                                key={exIndex}
                                className="text-sm text-primary-600 flex items-center gap-1"
                              >
                                <CheckCircle className="h-3 w-3" />
                                {exercise}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center space-y-4">
              <Button onClick={() => router.push("/signup")} size="lg">
                Create Free Account to Save Results
              </Button>
              <p className="text-sm text-gray-500">
                Get personalized warm-up routines based on your assessment
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Injury Risk Assessment
          </h1>
          <p className="mt-2 text-gray-600">
            Answer a few questions to understand your injury risk and get
            personalized recommendations.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span>
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQ.question}
            </h2>
            <div className="space-y-3">
              {currentQ.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQ.id, option.value)}
                  className={cn(
                    "w-full p-4 text-left rounded-lg border-2 transition-all",
                    answers[currentQ.id] === option.value
                      ? "border-primary-600 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Get Results"
              )}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!isCurrentAnswered}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
