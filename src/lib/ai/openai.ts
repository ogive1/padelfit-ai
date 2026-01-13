import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateWarmupRoutine({
  injuryHistory,
  targetAreas,
  duration,
  intensity,
}: {
  injuryHistory?: string[];
  targetAreas?: string[];
  duration: number; // minutes
  intensity: "light" | "moderate" | "intense";
}) {
  const prompt = `You are an expert sports physiotherapist specializing in padel injury prevention.

Generate a personalized warm-up routine for a padel player with the following parameters:
- Duration: ${duration} minutes
- Intensity: ${intensity}
${injuryHistory?.length ? `- Previous injuries to be mindful of: ${injuryHistory.join(", ")}` : ""}
${targetAreas?.length ? `- Target areas to focus on: ${targetAreas.join(", ")}` : ""}

Create a structured warm-up routine with:
1. Dynamic stretches (40% of time)
2. Mobility exercises (30% of time)
3. Sport-specific activation (30% of time)

For each exercise, include:
- Exercise name
- Duration or reps
- Brief instructions
- Target muscle group
- Injury prevention benefit

Return as JSON with this structure:
{
  "title": "string",
  "totalDuration": number,
  "intensity": "string",
  "phases": [
    {
      "name": "string",
      "duration": number,
      "exercises": [
        {
          "name": "string",
          "duration": "string",
          "instructions": "string",
          "targetArea": "string",
          "benefit": "string"
        }
      ]
    }
  ],
  "tips": ["string"]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  return JSON.parse(response.choices[0].message.content!);
}

export async function generateInjuryTip() {
  const prompt = `You are an expert sports physiotherapist specializing in padel injury prevention.

Generate a helpful, actionable injury prevention tip for padel players.

The tip should be:
- Specific and actionable
- Based on common padel injuries (shoulder, elbow, knee, back, wrist)
- Easy to implement
- Backed by sports science

Return as JSON:
{
  "tip": "string (2-3 sentences)",
  "category": "string (warm-up, technique, recovery, equipment, nutrition)",
  "targetArea": "string (shoulder, elbow, knee, back, wrist, general)",
  "quickAction": "string (one simple thing to do right now)"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.9,
  });

  return JSON.parse(response.choices[0].message.content!);
}

export async function assessInjuryRisk(answers: Record<string, string>) {
  const prompt = `You are an expert sports physiotherapist analyzing injury risk for a padel player.

Based on these quiz answers, assess their injury risk and provide recommendations:

${JSON.stringify(answers, null, 2)}

Provide:
1. Overall risk level (low, moderate, high)
2. Specific risk areas ranked by concern
3. Top 3 personalized recommendations
4. Suggested exercises to address weaknesses

Return as JSON:
{
  "overallRisk": "low" | "moderate" | "high",
  "riskScore": number (1-100),
  "riskAreas": [
    {
      "area": "string",
      "risk": "low" | "moderate" | "high",
      "explanation": "string"
    }
  ],
  "recommendations": [
    {
      "priority": number,
      "title": "string",
      "description": "string",
      "exercises": ["string"]
    }
  ],
  "summary": "string (2-3 sentences)"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.5,
  });

  return JSON.parse(response.choices[0].message.content!);
}

export async function chatWithCoach(
  messages: { role: "user" | "assistant"; content: string }[],
  userContext?: {
    injuryHistory?: string[];
    subscriptionTier?: string;
  }
) {
  const systemPrompt = `You are PadelFit AI Coach, an expert sports physiotherapist and padel coach specializing in injury prevention.

Your role is to:
- Help players prevent injuries through proper warm-up, technique, and recovery
- Provide personalized advice based on their injury history
- Explain exercises and stretches clearly
- Answer questions about padel-specific injuries
- Recommend when to see a professional for serious concerns

Guidelines:
- Be friendly but professional
- Keep responses concise (2-4 paragraphs max)
- Include specific, actionable advice
- Recommend exercises when appropriate
- Always prioritize safety over performance
${userContext?.injuryHistory?.length ? `\nUser's injury history: ${userContext.injuryHistory.join(", ")}` : ""}
${userContext?.subscriptionTier ? `\nUser's subscription: ${userContext.subscriptionTier}` : ""}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return response.choices[0].message.content;
}
