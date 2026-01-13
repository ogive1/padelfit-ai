import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWarmupRoutine } from "@/lib/ai/openai";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await req.json();
    const { duration = 10, intensity = "moderate", targetAreas = [] } = body;

    // Get user's injury history if logged in
    let injuryHistory: string[] = [];
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("injury_profile")
        .eq("id", user.id)
        .single();

      if (profile?.injury_profile?.history) {
        injuryHistory = profile.injury_profile.history;
      }
    }

    const routine = await generateWarmupRoutine({
      injuryHistory,
      targetAreas,
      duration,
      intensity,
    });

    // Track usage if user is logged in
    if (user) {
      await supabase.from("workout_sessions").insert({
        user_id: user.id,
        session_type: "warmup",
        duration_minutes: duration,
        exercises_completed: routine.phases,
      });
    }

    return NextResponse.json(routine);
  } catch (error: any) {
    console.error("Warmup generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate warmup routine" },
      { status: 500 }
    );
  }
}
