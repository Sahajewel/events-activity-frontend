/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";
import { useCreateHostRequest } from "@/hooks/useAdmin";

export default function BecomeHostPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // React Query Hook ব্যবহার করছি
  const { mutate, isPending } = useCreateHostRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please provide a reason why you want to be a host.");
      return;
    }

    // Mutate ব্যবহার করে রিকোয়েস্ট পাঠানো
    mutate(message, {
      onSuccess: () => {
        setIsSubmitted(true);
        toast.success("Request sent successfully!");
      },
      onError: (err: any) => {
        // যদি টোকেন এরর আসে, ইউজারকে লগইন পেজে পাঠান
        if (err.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          router.push("/login");
        } else {
          toast.error(err.response?.data?.message || "Failed to send request");
        }
      },
    });
  };

  if (isSubmitted) {
    // ... আপনার বিদ্যমান Success UI ...
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center p-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Request Under Review</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for applying to be a host! Admin will review your
              profile soon.
            </p>
            <Button onClick={() => router.push("/")} className="w-full">
              Back to Home
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 flex justify-center">
        <Card className="max-w-2xl w-full">
          {/* ... CardHeader ... */}
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Tell us about your experience
                </label>
                <Textarea
                  placeholder="Why do you want to become a host?"
                  className="min-h-[150px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isPending}
                />
              </div>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gap-2"
                  disabled={isPending}
                >
                  {isPending ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
