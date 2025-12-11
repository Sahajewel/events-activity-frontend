// src/app/dashboard/settings/page.tsx
"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// AlertDialog Imports
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Key, Bell, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ useRouter Import
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";

export default function SettingsPage() {
  const router = useRouter(); // ✅ useRouter Initialization
  const [isDeleting, setIsDeleting] = React.useState(false);
  const isLoading = false;

  const user = {
    id: "user123",
    email: "user@example.com",
    fullName: "Jewel Rana",
    isHost: true,
    notificationEmails: true,
  };

  // ✅ New Handler Function: Deactivates account, then logs out and redirects
  const handleDeleteAccount = () => {
    setIsDeleting(true);

    // 1. Send API request to deactivate the account on the server
    console.log("Attempting to DEACTIVATE account and LOGOUT...");

    setTimeout(() => {
      // 2. Simulate successful API response (Account is deactivated on the server)
      setIsDeleting(false);

      // 3. Alert/Toast the user

      toast(
        "Your account has been successfully deactivated. You are now being logged out."
      );

      // 4. Redirect the user out of the site (to login or home page)
      router.push("/login"); // Redirecting to /login page
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary-foreground">
            Settings ⚙️
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your account details, security, and preferences.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* 1. General Settings Card */}
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <User className="h-6 w-6 text-primary" />
                General Settings
              </CardTitle>
              <CardDescription>
                Update your public profile information like name and bio.
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                For changing profile image, name, location, or bio, please use
                the
                <Link
                  href={`/profile/edit`}
                  className="text-primary font-medium hover:underline ml-1"
                >
                  Edit Profile
                </Link>{" "}
                page.
              </p>

              <div>
                <Label htmlFor="email" className="text-sm">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="mt-1 bg-muted/50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed here.
                </p>
              </div>

              {user.isHost && (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <span className="text-sm text-yellow-800">
                    You are currently registered as an Event Host.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. Security & Danger Zone Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Key className="h-6 w-6 text-primary" />
                Security & Account
              </CardTitle>
              <CardDescription>
                Manage your password and account status.
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label className="text-sm">Change Password</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Change your password immediately if you suspect any security
                  breach.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/change-password">Update Password</Link>
                </Button>
              </div>

              <Separator />

              {/* Danger Zone - Deactivate & Logout */}
              <div className="pt-4 space-y-3">
                <h3 className="text-lg font-semibold text-red-600">
                  Danger Zone
                </h3>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Deactivating...
                        </>
                      ) : (
                        "Deactivate Account"
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      {/* ✅ Description updated for Deactivate & Logout */}
                      <AlertDialogDescription>
                        This action will **temporarily disable your account**
                        and immediately **log you out** of all devices. Your
                        profile will be hidden from public view. You can
                        reactivate your account by logging back in later.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Processing..." : "Yes, Deactivate"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <p className="text-xs text-muted-foreground text-center">
                  This will temporarily disable your profile.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 3. Notification Preferences Card */}
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Bell className="h-6 w-6 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Decide what you want to be notified about.
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about new events and activity on your
                    bookings.
                  </p>
                </div>
                {/* Switch-এর state আপনাকে একটি useState থেকে হ্যান্ডেল করতে হবে */}
                <Switch
                  id="email-notifications"
                  defaultChecked={user.notificationEmails}
                  // onCheckedChange={handleEmailToggle}
                />
              </div>

              {/* Host Notifications (Optional, based on user role) */}
              {user.isHost && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="host-updates">
                        Host Activity Updates
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when users book or review your hosted
                        events.
                      </p>
                    </div>
                    <Switch
                      id="host-updates"
                      defaultChecked={true}
                      // onCheckedChange={handleHostToggle}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
