"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Home,
  Dumbbell,
  Brain,
  MessageCircle,
  User,
  LogOut,
  Menu,
  X,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Warm-up", href: "/dashboard/warmup", icon: Dumbbell },
  { name: "Exercises", href: "/dashboard/exercises", icon: Brain },
  { name: "AI Coach", href: "/dashboard/coach", icon: MessageCircle },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

interface DashboardNavProps {
  user: User;
  profile: any;
}

export function DashboardNav({ user, profile }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const isPremium = profile?.subscription_tier !== "free";

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/" className="font-heading text-xl font-bold text-primary-600">
              PadelFit<span className="text-gray-900">AI</span>
            </Link>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive ? "text-primary-600" : "text-gray-400"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Upgrade banner for free users */}
          {!isPremium && (
            <div className="px-4 py-4">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5" />
                  <span className="font-semibold">Upgrade to Pro</span>
                </div>
                <p className="text-sm text-primary-100 mb-3">
                  Get full access to all exercises and AI coaching.
                </p>
                <Link href="/pricing">
                  <Button
                    size="sm"
                    className="w-full bg-white text-primary-600 hover:bg-gray-100"
                  >
                    View Plans
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* User info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-medium">
                    {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.full_name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate capitalize">
                  {profile?.subscription_tier || "Free"} Plan
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="ml-2 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm border-b border-gray-200">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex-1 font-heading text-xl font-bold text-primary-600">
          PadelFit<span className="text-gray-900">AI</span>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 bg-gray-900/50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
              <span className="font-heading text-xl font-bold text-primary-600">
                PadelFit<span className="text-gray-900">AI</span>
              </span>
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col p-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-3 text-base font-medium rounded-lg",
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-6 w-6",
                        isActive ? "text-primary-600" : "text-gray-400"
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg mt-4"
              >
                <LogOut className="mr-3 h-6 w-6" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main content offset for desktop */}
      <div className="lg:pl-64" />
    </>
  );
}
