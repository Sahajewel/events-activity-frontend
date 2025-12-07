/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { toast } from "sonner";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
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
import { Calendar, Loader2, Upload, X, Trash2 } from "lucide-react";
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

import { useAuth } from "@/hooks/useAuth";
import { useEvent, useUpdateEvent, useDeleteEvent } from "@/hooks/useEvents";

const eventSchema = z.object({
  name: z.string().min(3),
  type: z.string().min(1),
  description: z.string().min(10),
  date: z.string().min(1),
  location: z.string().min(3),
  minParticipants: z.number().optional(),
  maxParticipants: z.number(),
  joiningFee: z.number(),
  status: z.enum(["OPEN", "FULL", "CANCELLED", "COMPLETED"]).optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { data: event, isLoading: eventLoading } = useEvent(eventId);
  const updateEvent = useUpdateEvent(eventId);
  const deleteEvent = useDeleteEvent();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
      date: "",
      location: "",
      minParticipants: 1,
      maxParticipants: 10,
      joiningFee: 0,
      status: "OPEN",
    },
  });

  // Load event data into form
  useEffect(() => {
    if (event) {
      // Set image preview if exists
      if (event.imageUrl) {
        setImagePreview(event.imageUrl);
      }

      // Format date for datetime-local input
      const formattedDate = new Date(event.date).toISOString().slice(0, 16);

      // Reset form with event data
      form.reset({
        name: event.name,
        type: event.type,
        description: event.description,
        date: formattedDate,
        location: event.location,
        minParticipants: event.minParticipants || 1,
        maxParticipants: event.maxParticipants,
        joiningFee: event.joiningFee,
        status: event.status,
      });
    }
  }, [event, form]);

  // Auth & Permission check
  useEffect(() => {
    if (authLoading || eventLoading) return;

    if (!isAuthenticated) {
      toast.error("Please login to edit events");
      router.push("/login");
      return;
    }

    if (!user || !event) return;

    // Check if user is host or admin
    const isHost = user.id === event.hostId;
    const isAdmin = user.role === "ADMIN";

    if (!isHost && !isAdmin) {
      toast.error("You don't have permission to edit this event");
      router.push(`/events/${eventId}`);
    }
  }, [
    authLoading,
    eventLoading,
    isAuthenticated,
    user,
    event,
    router,
    eventId,
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data: EventFormValues) => {
    const formData = new FormData();

    // Normal fields
    if (data.name !== event?.name) formData.append("name", data.name);
    if (data.type !== event?.type) formData.append("type", data.type);
    if (data.description !== event?.description)
      formData.append("description", data.description);
    if (data.location !== event?.location)
      formData.append("location", data.location);
    if (data.date !== new Date(event!.date).toISOString().slice(0, 16)) {
      formData.append("date", data.date);
    }
    if (data.status !== event?.status) {
      formData.append("status", data.status || "OPEN");
    }

    // Number fields — shudhu value thakle pathabi, empty string pathabo na!
    if (data.joiningFee !== event?.joiningFee) {
      formData.append("joiningFee", data.joiningFee.toString());
    }

    if (data.maxParticipants !== event?.maxParticipants) {
      formData.append("maxParticipants", data.maxParticipants.toString());
    }

    // minParticipants optional — value thakle pathabi, na thakle pathabo na
    if (
      data.minParticipants !== undefined &&
      data.minParticipants !== event?.minParticipants
    ) {
      if (data.minParticipants !== null && data.minParticipants > 0) {
        formData.append("minParticipants", data.minParticipants.toString());
      }
      // jodi user empty kore dey → null pathabo (DB te null hobe)
      else if (data.minParticipants === null || data.minParticipants === 0) {
        formData.append("minParticipants", ""); // backend e z.coerce korbe undefined
      }
    }

    // Image
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Jodi kono change na thake
    if ([...formData.entries()].length === 0) {
      toast.info("No changes detected");
      return;
    }

    try {
      await updateEvent.mutateAsync(formData);
      toast.success("Event updated successfully!");
      router.push(`/events/${eventId}`);
    } catch (err) {
      // error already handled
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteEvent.mutateAsync(eventId);
      toast.success("Event deleted successfully!");
      router.push("/my-events");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  // Show loading
  if (authLoading || eventLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoadingSpinner className="flex-1" />
        <Footer />
      </div>
    );
  }

  // Don't render if not authorized
  if (!event || !user) {
    return null;
  }

  const isHost = user.id === event.hostId;
  const isAdmin = user.role === "ADMIN";
  const canEdit = isHost || isAdmin;

  if (!canEdit) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="bg-gradient-to-r from-primary to-purple-600 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">Edit Event</h1>
            <p className="text-primary-foreground/90">
              Update your event details
            </p>
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
                  {/* Event Image */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Event Image</label>
                    {imagePreview ? (
                      <div className="relative w-full h-64 rounded-lg overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG or WEBP (MAX. 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>

                  {/* Event Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Tech Meetup Dhaka" {...field} />
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
                        <FormLabel>Event Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Music">
                              Music & Concerts
                            </SelectItem>
                            <SelectItem value="Sports">
                              Sports & Fitness
                            </SelectItem>
                            <SelectItem value="Technology">
                              Technology
                            </SelectItem>
                            <SelectItem value="Food">Food & Dining</SelectItem>
                            <SelectItem value="Arts">Arts & Culture</SelectItem>
                            <SelectItem value="Outdoor">
                              Outdoor & Adventure
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Event Status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="OPEN">Open</SelectItem>
                            <SelectItem value="FULL">Full</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell people what your event is about..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide detailed information about your event
                        </FormDescription>
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
                        <FormLabel>Date & Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
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
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Banani, Dhaka" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Participants */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="minParticipants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min Participants (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxParticipants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Participants</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="10"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Joining Fee */}
                  <FormField
                    control={form.control}
                    name="joiningFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Joining Fee (BDT)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
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

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-4">
                    {/* Save & Cancel */}
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(`/events/${eventId}`)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={updateEvent.isPending}
                        className="flex-1"
                      >
                        {updateEvent.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Calendar className="mr-2 h-4 w-4" />
                            Update Event
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Delete Button */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="destructive"
                          className="w-full"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Event
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the event and remove all booking data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeleting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              "Delete Event"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
