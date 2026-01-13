import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { chatWithCoach } from "@/lib/ai/openai";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Chat requires authentication
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { messages, conversationId } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    // Get user context
    const { data: profile } = await supabase
      .from("profiles")
      .select("injury_profile, subscription_tier")
      .eq("id", user.id)
      .single();

    // Check if user has access to chat (Pro or Elite)
    if (profile?.subscription_tier === "free") {
      return NextResponse.json(
        { error: "Upgrade to Pro or Elite for AI coaching chat" },
        { status: 403 }
      );
    }

    const userContext = {
      injuryHistory: profile?.injury_profile?.riskAreas || [],
      subscriptionTier: profile?.subscription_tier,
    };

    const response = await chatWithCoach(messages, userContext);

    // Save conversation
    if (conversationId) {
      await supabase
        .from("ai_conversations")
        .update({
          messages: [...messages, { role: "assistant", content: response }],
        })
        .eq("id", conversationId)
        .eq("user_id", user.id);
    } else {
      const { data: newConversation } = await supabase
        .from("ai_conversations")
        .insert({
          user_id: user.id,
          messages: [...messages, { role: "assistant", content: response }],
          context: "general",
        })
        .select()
        .single();

      return NextResponse.json({
        response,
        conversationId: newConversation?.id,
      });
    }

    return NextResponse.json({ response, conversationId });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
