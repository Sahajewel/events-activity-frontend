/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useCreateEvent } from "@/hooks/useEvents";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Loader2,
  Upload,
  X,
  MapPin,
  Users,
  DollarSign,
  FileText,
  Star,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function CreateEventPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const createEvent = useCreateEvent();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm({
    defaultValues: {
      name: "",
      type: "",
      description: "",
      date: "",
      location: "",
      minParticipants: 1,
      maxParticipants: 10,
      joiningFee: 0,
    },
  });

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        toast.error("Please login to create events");
        router.push("/login");
      } else if (user && user.role !== "HOST" && user.role !== "ADMIN") {
        toast.error("You must be a HOST or ADMIN to create events");
        router.push("/");
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        date: new Date(data.date).toISOString(),
        minParticipants: Number(data.minParticipants),
        maxParticipants: Number(data.maxParticipants),
        joiningFee: Number(data.joiningFee),
      };

      await createEvent.mutateAsync(payload);
      toast.success("Event created successfully! 🎉");
      router.push("/my-events");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create event");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoadingSpinner className="flex-1" />
        <Footer />
      </div>
    );
  }

  if (
    !isAuthenticated ||
    !user ||
    (user.role !== "HOST" && user.role !== "ADMIN")
  ) {
    return null;
  }

  const eventTypes = [
    { value: "Music", label: "Music & Concerts", icon: "🎵" },
    { value: "Sports", label: "Sports & Fitness", icon: "⚽" },
    { value: "Technology", label: "Technology", icon: "💻" },
    { value: "Food", label: "Food & Dining", icon: "🍔" },
    { value: "Arts", label: "Arts & Culture", icon: "🎨" },
    { value: "Outdoor", label: "Outdoor & Adventure", icon: "🏔️" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary via-purple-600 to-primary bg-[length:200%_100%] animate-gradient text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium mb-4">
              <Star className="h-4 w-4" />
              Host Dashboard
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Create Amazing Event
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl">
              Share your passion and bring people together for unforgettable
              experiences
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[
                  { num: 1, label: "Basic Info" },
                  { num: 2, label: "Details" },
                  { num: 3, label: "Settings" },
                ].map((step, idx) => (
                  <div key={step.num} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                          currentStep >= step.num
                            ? "bg-primary text-white shadow-lg"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {currentStep > step.num ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          step.num
                        )}
                      </div>
                      <span className="text-xs mt-2 hidden sm:block">
                        {step.label}
                      </span>
                    </div>
                    {idx < 2 && (
                      <div
                        className={`h-1 flex-1 transition-all ${
                          currentStep > step.num ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Event Information</CardTitle>
                <CardDescription>
                  Fill in the details to create your event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    {/* Event Image */}
                    {/* <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Event Cover Image
                      </label>
                      {imagePreview ? (
                        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden border-2 border-border">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-3 right-3 p-2 bg-destructive/90 text-white rounded-full hover:bg-destructive transition-all shadow-lg"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-64 md:h-80 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 hover:border-primary transition-all group">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Upload className="h-8 w-8 text-primary" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium">
                                <span className="text-primary">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPG or WEBP (MAX. 5MB)
                              </p>
                            </div>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                    </div> */}

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Event Name */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Event Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Tech Meetup Dhaka 2024"
                                className="h-12"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Event Type */}
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Category *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {eventTypes.map((type) => (
                                  <SelectItem
                                    key={type.value}
                                    value={type.value}
                                  >
                                    <span className="flex items-center gap-2">
                                      <span>{type.icon}</span>
                                      <span>{type.label}</span>
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Date & Time */}
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Date & Time *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="datetime-local"
                                className="h-12"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Location */}
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Location *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Banani, Dhaka, Bangladesh"
                                className="h-12"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell people what makes your event special..."
                              className="min-h-[150px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide detailed information to attract participants
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Max Participants */}
                      <FormField
                        control={form.control}
                        name="minParticipants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Min Participants *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                placeholder="10"
                                className="h-12"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum number of attendees
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Max Participants */}
                      <FormField
                        control={form.control}
                        name="maxParticipants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Max Participants *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                placeholder="10"
                                className="h-12"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum number of attendees
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Joining Fee */}
                      <FormField
                        control={form.control}
                        name="joiningFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Joining Fee (BDT) *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                className="h-12"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Set to 0 for free events
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="flex-1 h-12"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createEvent.isPending}
                        className="flex-1 h-12 gap-2 shadow-lg hover:shadow-xl transition-all"
                      >
                        {createEvent.isPending ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Creating Event...
                          </>
                        ) : (
                          <>
                            Create Event
                            <ArrowRight className="h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Helper Tips */}
            <Card className="mt-6 border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Tips for a Successful Event
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      Use a high-quality cover image that represents your event
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      Write a detailed description to attract the right audience
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      Set a realistic participant limit based on your venue
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      Choose an appropriate fee that reflects the event value
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
