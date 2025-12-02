"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Event Enthusiast",
      image: "https://i.pravatar.cc/150?img=1",
      quote:
        "EventHub helped me find amazing people to explore the city with. I've attended over 20 events and made lifelong friends!",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Tech Meetup Host",
      image: "https://i.pravatar.cc/150?img=13",
      quote:
        "As a host, the platform makes it incredibly easy to organize events and connect with attendees. The community is fantastic!",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "Fitness Lover",
      image: "https://i.pravatar.cc/150?img=5",
      quote:
        "I was new to the city and didn't know anyone. EventHub helped me find workout buddies and now I have a whole fitness crew!",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            What People Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of happy members who found their community
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border rounded-2xl p-8 hover:shadow-lg transition-shadow"
            >
              <Quote className="h-8 w-8 text-primary mb-4" />
              <p className="text-muted-foreground mb-6 italic">
                {testimonial.quote}
              </p>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 mt-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-500">
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
