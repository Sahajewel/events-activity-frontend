// src/app/reset-password/page.tsx (বা আপনার পেজের অবস্থান অনুযায়ী)

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ResetPasswordForm from "@/components/auth/ResetPassword";

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-2xl border">
        <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
        <p className="text-muted-foreground">Enter your new password below.</p>

        <ResetPasswordForm />
      </div>
    </div>
  );
}
