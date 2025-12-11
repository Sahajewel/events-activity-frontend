/* eslint-disable @typescript-eslint/ban-ts-comment */
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Loader2,
  Users,
  Star,
  Sparkles,
  ArrowRight,
  Heart, // icon imports
} from "lucide-react";
import { toast } from "sonner";

// ⭐ 1. registerSchema আপডেট (কোনো পরিবর্তন নেই, শুধু রেফারেন্সের জন্য)
const registerSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    location: z.string().optional(),
    bio: z.string().optional(),
    interests: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();
  const { register, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
      bio: "",
      interests: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      const { confirmPassword, interests, ...registerData } = data;

      const interestsArray = interests
        ? interests
            .split(",")
            .map((i) => i.trim())
            .filter((i) => i.length > 0)
        : [];

      await register({ ...registerData, interests: interestsArray });
      toast.success("Account created successfully! 🎉");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }; // ... loading state ...

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Hero (Unchanged) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary via-purple-600 to-pink-600 p-12 items-center justify-center text-white relative overflow-hidden">
        {/* ... hero content ... */}
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-lg space-y-8 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Join Our Community
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold mb-4 leading-tight">
              Start Your Journey Today
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Join our growing community and discover amazing events happening
              around you.
            </p>
          </div>
          <div className="space-y-5 pt-8">
            {[
              {
                emoji: "🎉",
                description: "Always something new and exciting to explore",
                color: "from-yellow-400 to-orange-500",
              },
              {
                emoji: "👥",
                description: "Growing community of passionate event lovers",
                color: "from-blue-400 to-purple-500",
              },
              {
                emoji: "⭐",
                description: "Trusted and loved by thousands of users",
                color: "from-pink-400 to-red-500",
              },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4 group">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 text-2xl shadow-lg group-hover:scale-110 transition-transform`}
                >
                  {feature.emoji}
                </div>
                <div>
                  {/* @ts-ignore */}
                  <p className="font-bold text-lg mb-1">{feature?.title}</p>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {feature?.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-4 pt-8 border-t border-white/20">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Fast Growing</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              <Star className="h-4 w-4 fill-white" />
              <span className="text-sm font-medium">Top Rated</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Active Community</span>
            </div>
          </div>
        </div>
      </div>
      {/* Right Section - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo & Title (Unchanged) */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-6 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                EventHub
              </span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Create Account
            </h1>
            <p className="text-muted-foreground">
              Join our community and start exploring
            </p>
          </div>
          {/* Form Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Fill in your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* 1. Full Name (Full Width) */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* 2. Email (Full Width) */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="you@example.com"
                            type="email"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* 3 & 4. Password & Confirm (Side by Side) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Password */}
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
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Confirm Password */}
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="••••••••"
                              type="password"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Optional Section Title (Optional but recommended) */}
                  <div className="pt-2">
                    <h3 className="text-md font-semibold text-muted-foreground">
                      Tell us more (Optional)
                    </h3>
                  </div>
                  {/* 5 & 6. Location & Interests (Side by Side) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Location */}
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Dhaka, Bangladesh"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Interests */}
                    <FormField
                      control={form.control}
                      name="interests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            Interests
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Music, Sports, Tech"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Note: Interests এর FormDescription সরিয়ে দেওয়া হয়েছে যাতে কমপ্যাক্ট থাকে */}
                  {/* 7. Bio (Full Width - Textarea) */}
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about yourself..."
                            className="resize-none min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Submit Button (Unchanged) */}
                  <Button
                    type="submit"
                    className="w-full h-11 gap-2 shadow-lg hover:shadow-xl transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          {/* Sign In Link (Unchanged) */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
