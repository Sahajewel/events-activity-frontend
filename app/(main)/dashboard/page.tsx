"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { HostDashboard } from "@/components/dashboard/HostDashboard";
import { UserDashboard } from "@/components/dashboard/Dashboard";

export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please login to access dashboard");
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoadingSpinner className="flex-1" />
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        {user.role === "ADMIN" && <AdminDashboard />}
        {user.role === "HOST" && <HostDashboard />}
        {user.role === "USER" && <UserDashboard />}
      </main>
      <Footer />
    </div>
  );
}
