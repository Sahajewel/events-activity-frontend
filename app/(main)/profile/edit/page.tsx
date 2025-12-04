/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth, api } from "@/hooks/useAuth";
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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, X, User } from "lucide-react";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  bio: z.string().optional(),
  location: z.string().optional(),
  interests: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth(); // loading add korsi!
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      bio: "",
      location: "",
      interests: "",
    },
  });

  // Loading + Auth Check
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please login to edit profile");
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  // User load hole form fill kor
  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || "",
        bio: user.bio || "",
        location: user.location || "",
        // interests: user.interests?.join(", ") || "",
      });
      setImagePreview(user.profileImage || null);
    }
  }, [user, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(user?.profileImage || null);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    setIsSubmitting(true);
    const formData = new FormData();

    formData.append("fullName", data.fullName);
    if (data.bio?.trim()) formData.append("bio", data.bio.trim());
    if (data.location?.trim())
      formData.append("location", data.location.trim());

    if (data.interests?.trim()) {
      const interests = data.interests
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);
      formData.append("interests", JSON.stringify(interests));
    }

    if (imageFile) {
      formData.append("profileImage", imageFile);
    }

    try {
      const res = await api.patch("/users/profile", formData); // header delete korsi!

      localStorage.setItem("user", JSON.stringify(res.data.data));
      toast.success("Profile updated successfully!");
      router.push(`/profile/${user.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="bg-gradient-to-r from-primary to-purple-600 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">Edit Profile</h1>
            <p>Update your personal information</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-card border rounded-xl p-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Avatar */}
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={imagePreview || ""} />
                      <AvatarFallback className="text-4xl">
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex gap-3">
                      <label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Change Photo
                          </span>
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                      {imageFile && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-24" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Dhaka, Bangladesh" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interests</FormLabel>
                        <FormControl>
                          <Input placeholder="Music, Sports, Tech" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Role:</span>
                    <Badge variant="secondary">{user.role}</Badge>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? <>Saving...</> : <>Save Changes</>}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
