import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dumbbell,
  Brain,
  MessageCircle,
  TrendingUp,
  Calendar,
  Target,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const { data: recentSessions } = await supabase
    .from("workout_sessions")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: latestAssessment } = await supabase
    .from("injury_assessments")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const totalSessions = recentSessions?.length || 0;
  const riskLevel = latestAssessment?.risk_level || "unknown";
  const riskScore = latestAssessment?.risk_score || null;

  return (
    <div className="lg:pl-64">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {profile?.full_name?.split(" ")[0] || "Player"}!
          </h1>
          <p className="mt-1 text-gray-600">
            Here's your injury prevention overview.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalSessions}
                  </p>
                  <p className="text-sm text-gray-600">Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    riskLevel === "low"
                      ? "bg-green-100"
                      : riskLevel === "moderate"
                      ? "bg-yellow-100"
                      : riskLevel === "high"
                      ? "bg-red-100"
                      : "bg-gray-100"
                  }`}
                >
                  <Target
                    className={`h-6 w-6 ${
                      riskLevel === "low"
                        ? "text-green-600"
                        : riskLevel === "moderate"
                        ? "text-yellow-600"
                        : riskLevel === "high"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 capitalize">
                    {riskLevel}
                  </p>
                  <p className="text-sm text-gray-600">Injury Risk</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {riskScore !== null ? `${100 - riskScore}%` : "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">Health Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 capitalize">
                    {profile?.subscription_tier || "Free"}
                  </p>
                  <p className="text-sm text-gray-600">Plan</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Dumbbell className="h-5 w-5 text-primary-600" />
                </div>
                <CardTitle className="text-lg">Generate Warm-up</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Get a personalized warm-up routine based on your injury profile.
              </p>
              <Link href="/dashboard/warmup">
                <Button className="w-full">
                  Start Warm-up
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Target className="h-5 w-5 text-yellow-600" />
                </div>
                <CardTitle className="text-lg">Injury Assessment</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Take our quiz to identify your injury risks and get
                recommendations.
              </p>
              <Link href="/tools/injury-risk-quiz">
                <Button variant="secondary" className="w-full">
                  Take Quiz
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">AI Coach</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Chat with our AI coach for personalized injury prevention
                advice.
              </p>
              <Link href="/dashboard/coach">
                <Button
                  variant={
                    profile?.subscription_tier === "free"
                      ? "secondary"
                      : "primary"
                  }
                  className="w-full"
                >
                  {profile?.subscription_tier === "free"
                    ? "Upgrade to Chat"
                    : "Start Chat"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {recentSessions && recentSessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session: any) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Dumbbell className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {session.session_type} Session
                        </p>
                        <p className="text-sm text-gray-500">
                          {session.duration_minutes} minutes
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(session.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty state for new users */}
        {(!recentSessions || recentSessions.length === 0) && !latestAssessment && (
          <Card className="bg-gradient-to-br from-primary-50 to-white border-primary-100">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Get Started with Your Assessment
              </h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                Take our injury risk quiz to get personalized recommendations
                and start your injury prevention journey.
              </p>
              <Link href="/tools/injury-risk-quiz">
                <Button>
                  Take Injury Risk Quiz
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
