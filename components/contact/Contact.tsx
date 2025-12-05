"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    // Replace with your real API later
    // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
    await new Promise((resolve) => setTimeout(resolve, 1500)); // fake delay

    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("Message sent! We'll reply soon");
    reset();

    setTimeout(() => setIsSuccess(false), 6000);
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-95">
            Question? Feedback? Collaboration? We&apos;re all ears 24/7!
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
              {isSuccess && (
                <div className="mb-8 flex items-center gap-3 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                  <span className="font-medium">
                    Message sent successfully! We&apos;ll reply soon
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-lg font-semibold mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    {...register("name")}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-lg font-semibold mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-lg font-semibold mb-2"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    {...register("subject")}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition"
                    placeholder="e.g. Partnership, Bug Report, Feature Request"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-lg font-semibold mb-2"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    {...register("message")}
                    rows={7}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition resize-none"
                    placeholder="Write your message here..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg py-5 rounded-2xl transition flex items-center justify-center gap-3 shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin w-6 h-6" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-10">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-10 rounded-3xl shadow-xl">
                <h3 className="text-3xl font-bold mb-8 text-center">
                  Contact Information
                </h3>
                <div className="space-y-8">
                  <div className="flex gap-5">
                    <div className="bg-white/20 p-4 rounded-2xl">
                      <Mail className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-bold text-xl">Email Us</p>
                      <p className="text-white/90 mt-1">
                        support@eventmate.com
                      </p>
                      <p className="text-white/80 text-sm">
                        We reply within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="bg-white/20 p-4 rounded-2xl">
                      <Phone className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-bold text-xl">Call Us</p>
                      <p className="text-white/90 mt-1">+880 1777-123456</p>
                      <p className="text-white/80 text-sm">
                        10 AM – 7 PM (GMT+6)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="bg-white/20 p-4 rounded-2xl">
                      <MapPin className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-bold text-xl">Visit Us</p>
                      <p className="text-white/90 mt-1">
                        House 42, Road 12
                        <br />
                        Block E, Banani
                        <br />
                        Dhaka 1213, Bangladesh
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional Map Placeholder */}
              <div className="bg-gray-200 border-2 border-dashed rounded-2xl h-64 flex items-center justify-center text-gray-500 font-medium">
                Google Maps Embed (Optional)
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
