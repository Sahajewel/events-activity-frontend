import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Forgot from "@/components/auth/Forgot"; // ← এটা perfect

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-2xl border">
        <Link
          href="/login"
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Login
        </Link>

        <h1 className="text-3xl font-bold tracking-tight">Forgot Password</h1>
        <p className="text-muted-foreground">
          Enter your email address below and we&apos;ll send you a link to reset
          your password.
        </p>

        <Forgot />
      </div>
    </div>
  );
}
