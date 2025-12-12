/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/hooks/useAuth";

const formSchema = z.object({
  newPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type ResetPasswordFormValues = z.infer<typeof formSchema>;

export default function ResetPasswordForm() {
  // 1. সমস্ত Hooks কম্পোনেন্টের শুরুতে কল করা হয়েছে (কোনো শর্তের আগে)
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<ResetPasswordFormValues>({
    // ✅ এই Hook টিকে উপরে সরানো হয়েছে
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  // 2. ডেটা সংগ্রহ (Hooks কল করার পর)
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // 3. টোকেন বা ইমেল না থাকলে এরর হ্যান্ডলিং (Hooks কল করার পর Early Return বৈধ)
  if (!token || !email) {
    return (
      <div className="text-center text-red-600">
        Invalid or missing reset token/email. Please request a new link.
      </div>
    );
  }

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsPending(true);

    try {
      // API কল: টোকেন, ইমেল এবং নতুন পাসওয়ার্ড বডিতে পাঠানো
      await api.post("/auth/reset-password", {
        token: token,
        email: email,
        newPassword: values.newPassword,
      });

      toast.success("Password reset successful. Please log in.");
      router.push("/login");
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to reset password. Link might be expired.";
      toast.error(errorMsg);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your new password"
                  type="password"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting...
            </>
          ) : (
            "Set New Password"
          )}
        </Button>
      </form>
    </Form>
  );
}
