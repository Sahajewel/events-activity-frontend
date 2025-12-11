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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Calendar,
  Loader2,
  Upload,
  X,
  Trash2,
  Save,
  AlertTriangle,
  ArrowLeft,
  MapPin,
  Users,
  DollarSign,
  FileText,
  Eye,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEvent, useUpdateEvent, useDeleteEvent } from "@/hooks/useEvents";
import Link from "next/link";

const eventSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(3, "Location is required"),
  minParticipants: z.number().optional(),
  maxParticipants: z.number().min(1, "Max participants is required"),
  joiningFee: z.number().min(0, "Fee must be 0 or greater"),
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
  const [hasChanges, setHasChanges] = useState(false);

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

  // Load event data
  useEffect(() => {
    if (event) {
      if (event.imageUrl) setImagePreview(event.imageUrl);

      const formattedDate = new Date(event.date).toISOString().slice(0, 16);

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

  // Check permissions
  useEffect(() => {
    if (authLoading || eventLoading) return;

    if (!isAuthenticated) {
      toast.error("Please login to edit events");
      router.push("/login");
      return;
    }

    if (!user || !event) return;

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

  // Track changes
  useEffect(() => {
    const subscription = form.watch(() => setHasChanges(true));
    return () => subscription.unsubscribe();
  }, [form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      setHasChanges(true);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setHasChanges(true);
  };

  const onSubmit = async (data: EventFormValues) => {
    const formData = new FormData();

    if (data.name !== event?.name) formData.append("name", data.name);
    if (data.type !== event?.type) formData.append("type", data.type);
    if (data.description !== event?.description)
      formData.append("description", data.description);
    if (data.location !== event?.location)
      formData.append("location", data.location);
    if (data.date !== new Date(event!.date).toISOString().slice(0, 16)) {
      formData.append("date", data.date);
    }
    if (data.status !== event?.status)
      formData.append("status", data.status || "OPEN");
    if (data.joiningFee !== event?.joiningFee)
      formData.append("joiningFee", data.joiningFee.toString());
    if (data.maxParticipants !== event?.maxParticipants) {
      formData.append("maxParticipants", data.maxParticipants.toString());
    }
    if (
      data.minParticipants !== undefined &&
      data.minParticipants !== event?.minParticipants
    ) {
      if (data.minParticipants !== null && data.minParticipants > 0) {
        formData.append("minParticipants", data.minParticipants.toString());
      } else {
        formData.append("minParticipants", "");
      }
    }
    if (imageFile) formData.append("image", imageFile);

    if ([...formData.entries()].length === 0) {
      toast.info("No changes detected");
      return;
    }

    try {
      await updateEvent.mutateAsync(formData);
      toast.success("Event updated successfully! 🎉");
      setHasChanges(false);
      router.push(`/events/${eventId}`);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteEvent.mutateAsync(eventId);
      toast.success("Event deleted successfully");
      router.push("/my-events");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete event");
      setIsDeleting(false);
    }
  };

  if (authLoading || eventLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoadingSpinner className="flex-1" />
        <Footer />
      </div>
    );
  }

  if (!event || !user) return null;

  const isHost = user.id === event.hostId;
  const isAdmin = user.role === "ADMIN";
  const canEdit = isHost || isAdmin;

  if (!canEdit) return null;

  const eventTypes = [
    { value: "Music", label: "Music & Concerts", icon: "🎵" },
    { value: "Sports", label: "Sports & Fitness", icon: "⚽" },
    { value: "Technology", label: "Technology", icon: "💻" },
    { value: "Food", label: "Food & Dining", icon: "🍔" },
    { value: "Arts", label: "Arts & Culture", icon: "🎨" },
    { value: "Outdoor", label: "Outdoor & Adventure", icon: "🏔️" },
  ];

  const statusOptions = [
    { value: "OPEN", label: "Open", color: "bg-green-500" },
    { value: "FULL", label: "Full", color: "bg-orange-500" },
    { value: "CANCELLED", label: "Cancelled", color: "bg-red-500" },
    { value: "COMPLETED", label: "Completed", color: "bg-gray-500" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-purple-600 to-primary text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.back()}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl md:text-5xl font-bold mb-2">
                Edit Event
              </h1>
              <p className="text-lg text-white/90">Update your event details</p>
            </div>
            <Link href={`/events/${eventId}`}>
              <Button variant="secondary" className="gap-2">
                <Eye className="h-4 w-4" />
                Preview Event
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Warning if there are unsaved changes */}
            {hasChanges && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <p className="text-sm text-orange-800 font-medium">
                    You have unsaved changes. Don&apos;t forget to save!
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Main Form Card */}
            <Card className="shadow-xl">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      Event Information
                    </CardTitle>
                    <CardDescription>
                      Update the details of your event
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    ID: {eventId.slice(0, 8)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    {/* Image Upload */}
                    <div className="space-y-3">
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
                        <label className="flex flex-col items-center justify-center w-full h-64 md:h-80 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 hover:border-primary transition-all">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                              <Upload className="h-8 w-8 text-primary" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium">
                                <span className="text-primary">
                                  Click to upload
                                </span>{" "}
                                new image
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
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Event Name */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Event Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Tech Meetup Dhaka"
                                className="h-12"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Category */}
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
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
                                      {type.label}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Status */}
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
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {statusOptions.map((status) => (
                                  <SelectItem
                                    key={status.value}
                                    value={status.value}
                                  >
                                    <span className="flex items-center gap-2">
                                      <span
                                        className={`w-2 h-2 rounded-full ${status.color}`}
                                      />
                                      {status.label}
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
                              Date & Time
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
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Location
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Banani, Dhaka"
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
                          <FormLabel>Event Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell people about your event..."
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
                      {/* Min Participants */}
                      <FormField
                        control={form.control}
                        name="minParticipants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Max Participants
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
                              Max Participants
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
                              Joining Fee (BDT)
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
                    <div className="flex flex-col gap-4 pt-6 border-t">
                      {/* Save & Cancel */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => router.push(`/events/${eventId}`)}
                          className="flex-1 h-12"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={updateEvent.isPending}
                          className="flex-1 h-12 gap-2 shadow-lg hover:shadow-xl transition-all"
                        >
                          {updateEvent.isPending ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Saving Changes...
                            </>
                          ) : (
                            <>
                              <Save className="h-5 w-5" />
                              Save Changes
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
                            className="w-full h-12 gap-2"
                          >
                            <Trash2 className="h-5 w-5" />
                            Delete Event
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-destructive" />
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="space-y-2">
                              <p>
                                This action cannot be undone. This will
                                permanently:
                              </p>
                              <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Delete the event and all its data</li>
                                <li>Cancel all bookings</li>
                                <li>Remove from search results</li>
                              </ul>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
