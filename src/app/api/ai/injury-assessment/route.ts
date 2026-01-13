import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { assessInjuryRisk } from "@/lib/ai/openai";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await req.json();
    const { answers } = body;

    if (!answers || Object.keys(answers).length === 0) {
      return NextResponse.json(
        { error: "Quiz answers are required" },
        { status: 400 }
      );
    }

    const assessment = await assessInjuryRisk(answers);

    // Save assessment if user is logged in
    if (user) {
      await supabase.from("injury_assessments").insert({
        user_id: user.id,
        answers,
        risk_score: assessment.riskScore,
        risk_level: assessment.overallRisk,
        risk_areas: assessment.riskAreas,
        recommendations: assessment.recommendations,
      });

      // Update user's injury profile
      await supabase
        .from("profiles")
        .update({
          injury_profile: {
            lastAssessment: new Date().toISOString(),
            riskScore: assessment.riskScore,
            riskLevel: assessment.overallRisk,
            riskAreas: assessment.riskAreas.map((a: any) => a.area),
          },
        })
        .eq("id", user.id);
    }

    return NextResponse.json(assessment);
  } catch (error: any) {
    console.error("Injury assessment error:", error);
    return NextResponse.json(
      { error: "Failed to assess injury risk" },
      { status: 500 }
    );
  }
}
