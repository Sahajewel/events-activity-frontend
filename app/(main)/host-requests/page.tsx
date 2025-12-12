/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Loader2, User, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// ✅ আপনার TanStack Query Hooks ইম্পোর্ট করুন
// (আপনার প্রকৃত পাথ অনুযায়ী ইম্পোর্ট পাথ পরিবর্তন করুন)
import { useHostRequests, useApproveHostRequest } from "@/hooks/useAdmin";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";

// Host Request ডেটার প্রকারভেদ (Type Definition)
interface HostRequest {
  id: string;
  userId: string;
  // prisma/hostRequest মডেলে user include করা আছে
  user: {
    fullName: string;
    email: string;
  };
  message: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export default function HostRequestsPage() {
  // ❌ useToast hook টি বাদ দেওয়া হলো

  // ✅ Data Fetching Hook
  const { data: requests, isLoading, error, refetch } = useHostRequests(); // refetch যোগ করা হলো
  const pendingRequests = requests
    ? requests.filter((r: HostRequest) => r.status === "PENDING")
    : [];

  // ✅ Mutation Hooks
  const { mutate: approveRequest, isPending: isApproving } =
    useApproveHostRequest();

  // তারিখ ফরম্যাট করার ফাংশন
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ✅ হোস্ট হিসেবে ইউজারকে অনুমোদন দেওয়ার হ্যান্ডলার
  const handleApprove = (requestId: string) => {
    approveRequest(requestId, {
      onSuccess: (response) => {
        // 💡 useToast এর পরিবর্তে alert() ব্যবহার করা হলো
        toast.success(
          response.message || "User promoted to HOST successfully!"
        );
        // ডেটা রিফ্রেশ করা
        refetch();
      },
      onError: (err: any) => {
        // 💡 useToast এর পরিবর্তে alert() ব্যবহার করা হলো
        console.error("Approval failed:", err);
        toast.error(
          `Approval Failed: ${err.response?.data?.message || "Server error"}`
        );
      },
    });
  };

  // ❌ রিজেক্ট হ্যান্ডলার (API বাস্তবায়ন না হওয়া পর্যন্ত)
  const handleReject = async (requestId: string) => {
    // 💡 useToast এর পরিবর্তে alert() ব্যবহার করা হলো
    toast.error(
      "Rejection Logic Needed: Please implement the actual API endpoint for rejecting/deleting host requests on the backend."
    );

    console.log(`Rejecting/Deleting request ID: ${requestId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center text-red-500">
        Error loading requests: {error.message}
      </div>
    );
  }

  return (
    <div>
      <Navbar></Navbar>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary-foreground flex items-center gap-3">
            <User className="h-8 w-8 text-primary" /> Host Requests
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Review and manage user requests to become event hosts.
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">
              Pending Requests ({pendingRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                🎉 No pending host requests right now!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Requested On</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.map((request: HostRequest) => {
                      const isProcessing = isApproving; // Simplified: checking if any approval is running
                      return (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            <Link
                              href={`/profile/${request.userId}`}
                              className="text-primary hover:underline"
                            >
                              {request.user.fullName}
                            </Link>
                            {request.message && (
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                Message: {request.message}
                              </p>
                            )}
                          </TableCell>
                          <TableCell>{request.user.email}</TableCell>
                          <TableCell>{formatDate(request.createdAt)}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={"secondary"}>
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApprove(request.id)}
                              disabled={isProcessing}
                            >
                              {isProcessing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4 mr-1" />
                              )}
                              Approve
                            </Button>
                            {/* <Button
                              size="sm"
                              variant="destructive" // Changed to destructive for emphasis
                              onClick={() => handleReject(request.id)}
                              disabled={isProcessing}
                            >
                              <X className="h-4 w-4" />
                            </Button> */}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Approved Requests (যদি অন্য status এ data থাকে) */}
        <Card className="shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="text-2xl text-muted-foreground">
              Recently Processed
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* 💡 এখানে আপনি APPROVED/REJECTED রিকোয়েস্টগুলো filter করে দেখাতে পারেন */}
            <p className="text-sm text-muted-foreground">
              (Implement logic to display approved/rejected requests from API
              data)
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer></Footer>
    </div>
  );
}
// Note: Ensure your button component has the 'success' variant defined.
