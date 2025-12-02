/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      await login(data.email, data.password);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <Calendar className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                EventHub
              </span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="pt-6 border-t">
            <p className="text-center text-sm text-muted-foreground mb-4">
              Demo Credentials:
            </p>
            <div className="space-y-2 text-xs">
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-medium mb-1">Admin:</p>
                <p>Email: admin@events.com</p>
                <p>Password: Admin@123</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-medium mb-1">Host:</p>
                <p>Email: host@events.com</p>
                <p>Password: Host@123</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-medium mb-1">User:</p>
                <p>Email: user1@events.com</p>
                <p>Password: User@123</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Hero */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-primary to-purple-600 p-12 items-center justify-center text-white">
        <div className="max-w-lg space-y-6">
          <h2 className="text-4xl font-bold">
            Connect Through Shared Experiences
          </h2>
          <p className="text-xl text-primary-foreground/90">
            Join thousands of people discovering new activities and making
            meaningful connections.
          </p>
          <div className="space-y-4 pt-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </div>
              <div>
                <p className="font-semibold">Find Your Community</p>
                <p className="text-sm text-primary-foreground/80">
                  Connect with like-minded people
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </div>
              <div>
                <p className="font-semibold">Discover Events</p>
                <p className="text-sm text-primary-foreground/80">
                  Browse hundreds of activities
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </div>
              <div>
                <p className="font-semibold">Make Memories</p>
                <p className="text-sm text-primary-foreground/80">
                  Create lasting friendships
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
