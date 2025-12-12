// src/app/reset-password/page.tsx

import { Suspense } from "react"; // ✅ Suspense ইম্পোর্ট করুন
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ResetPasswordForm from "@/components/auth/ResetPassword";
// আমি ধরে নিচ্ছি আপনার কম্পোনেন্টের নাম ResetPasswordForm

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-2xl border">
        <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
        <p className="text-muted-foreground">Enter your new password below.</p>

        {/* ✅ সমস্যা সমাধান: useSearchParams ব্যবহারকারী কম্পোনেন্টকে 
          Suspense দিয়ে ঘিরে দিন।
        */}
        <Suspense fallback={<div>Loading form...</div>}>
          <ResetPasswordForm />
        </Suspense>

        {/* ঐচ্ছিক: পেজের নিচে যদি কোনো বাটন থাকে */}
        <Link
          href="/login"
          className="text-sm flex items-center gap-1 text-primary hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>
    </div>
  );
}
