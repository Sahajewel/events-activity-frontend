"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                EventHub
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connect with people through shared interests and activities. Never
              miss an event because you don&apos;t have someone to go with.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/events"
                  className="text-muted-foreground hover:text-primary"
                >
                  Explore Events
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/events?type=Music"
                  className="text-muted-foreground hover:text-primary"
                >
                  Music & Concerts
                </Link>
              </li>
              <li>
                <Link
                  href="/events?type=Sports"
                  className="text-muted-foreground hover:text-primary"
                >
                  Sports & Fitness
                </Link>
              </li>
              <li>
                <Link
                  href="/events?type=Technology"
                  className="text-muted-foreground hover:text-primary"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  href="/events?type=Food"
                  className="text-muted-foreground hover:text-primary"
                >
                  Food & Drinks
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                hello@eventhub.com
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                +880 1234-567890
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Dhaka, Bangladesh
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} EventHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
