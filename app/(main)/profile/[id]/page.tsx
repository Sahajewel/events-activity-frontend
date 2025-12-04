/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Star, Edit } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { api, useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { EventCard } from "@/components/events/EventsCards";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const { user: currentUser } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      const response = await api.get<{ data: User }>(`/users/${userId}`);
      return response.data.data;
    },
    enabled: !!userId,
  });

  const isOwnProfile = currentUser?.id === userId;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoadingSpinner className="flex-1" />
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">User not found</h2>
            <p className="text-muted-foreground">
              The profile you&apos;re looking for doesn&apos;t exist
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        {/* Profile Header - FIXED gradient */}
        <div className="bg-gradient-to-r from-primary to-purple-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                <AvatarImage
                  src={profile.profileImage}
                  alt={profile.fullName}
                />
                <AvatarFallback className="text-4xl">
                  {getInitials(profile.fullName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                  <h1 className="text-4xl font-bold">{profile.fullName}</h1>
                  <Badge variant="secondary">{profile.role}</Badge>
                </div>

                {profile.bio && (
                  <p className="text-lg text-primary-foreground/90 mb-4">
                    {profile.bio}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined {new Date(profile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {profile.averageRating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                      <span>{profile.averageRating} rating</span>
                    </div>
                  )}
                </div>

                {profile.interests && profile.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                    {profile.interests.map((interest: any, index: any) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-white/10 text-white"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {isOwnProfile && (
                <Link href="/profile/edit">
                  <Button variant="secondary" size="lg" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Stats Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Events Hosted</span>
                    <span className="font-semibold">
                      {profile._count?.hostedEvents || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Events Attended
                    </span>
                    <span className="font-semibold">
                      {profile._count?.bookings || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Reviews Received
                    </span>
                    <span className="font-semibold">
                      {profile._count?.receivedReviews || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {profile.receivedReviews &&
                profile.receivedReviews.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Reviews</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {profile.receivedReviews
                        .slice(0, 3)
                        .map((review: any) => (
                          <div key={review.id} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={review.user.profileImage}
                                  alt={review.user.fullName}
                                />
                                <AvatarFallback>
                                  {getInitials(review.user.fullName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {review.user.fullName}
                                </p>
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < review.rating
                                          ? "fill-yellow-500 text-yellow-500"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            {review.comment && (
                              <p className="text-sm text-muted-foreground">
                                {review.comment}
                              </p>
                            )}
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="hosted" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="hosted">Hosted Events</TabsTrigger>
                  <TabsTrigger value="attended">Attended Events</TabsTrigger>
                </TabsList>

                <TabsContent value="hosted" className="space-y-6">
                  {profile.hostedEvents && profile.hostedEvents.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {profile.hostedEvents.map((event: any) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">
                          No hosted events yet
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="attended" className="space-y-6">
                  {profile.bookings && profile.bookings.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {profile.bookings.map((booking: any) => (
                        <EventCard key={booking.id} event={booking.event} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">
                          No attended events yet
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
