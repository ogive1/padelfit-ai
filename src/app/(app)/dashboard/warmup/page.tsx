"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Flame,
  Target,
  Play,
  CheckCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const intensityOptions = [
  { value: "light", label: "Light", description: "Gentle movements" },
  { value: "moderate", label: "Moderate", description: "Standard warm-up" },
  { value: "intense", label: "Intense", description: "Competition prep" },
];

const durationOptions = [5, 10, 15, 20];

const targetAreas = [
  { value: "shoulder", label: "Shoulders" },
  { value: "elbow", label: "Elbows" },
  { value: "wrist", label: "Wrists" },
  { value: "knee", label: "Knees" },
  { value: "back", label: "Lower Back" },
  { value: "ankle", label: "Ankles" },
];

interface WarmupRoutine {
  title: string;
  totalDuration: number;
  intensity: string;
  phases: {
    name: string;
    duration: number;
    exercises: {
      name: string;
      duration: string;
      instructions: string;
      targetArea: string;
      benefit: string;
    }[];
  }[];
  tips: string[];
}

export default function WarmupPage() {
  const [duration, setDuration] = useState(10);
  const [intensity, setIntensity] = useState("moderate");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [routine, setRoutine] = useState<WarmupRoutine | null>(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const generateRoutine = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/warmup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration,
          intensity,
          targetAreas: selectedAreas,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate routine");

      const data = await response.json();
      setRoutine(data);
      setCurrentPhase(0);
      setCurrentExercise(0);
    } catch (error) {
      console.error("Error generating routine:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const nextExercise = () => {
    if (!routine) return;

    const currentPhaseData = routine.phases[currentPhase];
    if (currentExercise < currentPhaseData.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    } else if (currentPhase < routine.phases.length - 1) {
      setCurrentPhase(currentPhase + 1);
      setCurrentExercise(0);
    } else {
      setIsActive(false);
    }
  };

  const resetRoutine = () => {
    setRoutine(null);
    setCurrentPhase(0);
    setCurrentExercise(0);
    setIsActive(false);
  };

  return (
    <div className="lg:pl-64 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Warm-up Generator</h1>
        <p className="mt-1 text-gray-600">
          Get a personalized warm-up routine based on your needs.
        </p>
      </div>

      {!routine ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary-600" />
                Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {durationOptions.map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setDuration(mins)}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors",
                      duration === mins
                        ? "border-primary-600 bg-primary-50 text-primary-700"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Intensity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {intensityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setIntensity(option.value)}
                    className={cn(
                      "py-3 px-4 rounded-lg border-2 text-center transition-colors",
                      intensity === option.value
                        ? "border-primary-600 bg-primary-50 text-primary-700"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <p className="font-medium">{option.label}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Focus Areas (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {targetAreas.map((area) => (
                  <button
                    key={area.value}
                    onClick={() => toggleArea(area.value)}
                    className={cn(
                      "py-2 px-4 rounded-full border-2 font-medium transition-colors",
                      selectedAreas.includes(area.value)
                        ? "border-primary-600 bg-primary-50 text-primary-700"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {area.label}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Select areas you want to focus on or leave empty for a balanced
                routine.
              </p>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Button
              onClick={generateRoutine}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Your Routine...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Generate Warm-up Routine
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Routine Header */}
          <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{routine.title}</h2>
                  <div className="flex gap-4 mt-2 text-primary-100">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {routine.totalDuration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="h-4 w-4" />
                      {routine.intensity}
                    </span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={resetRoutine}
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Routine
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Phases */}
          <div className="space-y-4">
            {routine.phases.map((phase, phaseIndex) => (
              <Card
                key={phaseIndex}
                className={cn(
                  "transition-all",
                  phaseIndex === currentPhase && isActive
                    ? "ring-2 ring-primary-500"
                    : ""
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {phaseIndex < currentPhase ||
                      (phaseIndex === currentPhase && !isActive && routine) ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <span className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                          {phaseIndex + 1}
                        </span>
                      )}
                      {phase.name}
                    </CardTitle>
                    <span className="text-sm text-gray-500">
                      {phase.duration} min
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {phase.exercises.map((exercise, exIndex) => (
                      <div
                        key={exIndex}
                        className={cn(
                          "p-4 rounded-lg border transition-all",
                          phaseIndex === currentPhase &&
                            exIndex === currentExercise &&
                            isActive
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {exercise.name}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {exercise.instructions}
                            </p>
                            <div className="flex gap-4 mt-2">
                              <span className="text-xs text-gray-500">
                                {exercise.duration}
                              </span>
                              <span className="text-xs text-primary-600">
                                {exercise.targetArea}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tips */}
          {routine.tips && routine.tips.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pro Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {routine.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Start Button */}
          {!isActive && (
            <Button
              onClick={() => setIsActive(true)}
              className="w-full"
              size="lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Warm-up
            </Button>
          )}

          {isActive && (
            <div className="flex gap-4">
              <Button
                onClick={() => setIsActive(false)}
                variant="secondary"
                className="flex-1"
              >
                Pause
              </Button>
              <Button onClick={nextExercise} className="flex-1">
                Next Exercise
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
