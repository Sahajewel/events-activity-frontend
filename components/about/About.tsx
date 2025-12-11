"use client";

import Link from "next/link";
import {
  Users,
  Calendar,
  HeartHandshake,
  Sparkles,
  MapPin,
  Star,
} from "lucide-react";

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Never Go Alone Again
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-95">
            We believe no one should miss out on amazing experiences just
            because they don’t have someone to go with.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Our Mission</h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            To connect people who share the same passions and turn “I wish I had
            someone to go with” into “Let’s go together!” — whether it’s a
            concert, a sunrise hike, a board game night, or a cooking workshop.
          </p>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                The Problem We Saw
              </h3>
              <ul className="space-y-4 text-lg text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-2xl">•</span>
                  Thousands of events happen every week, but many people skip
                  them because they have no one to join.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-2xl">•</span>
                  Making new friends as an adult is hard.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-2xl">•</span>
                  Existing platforms focus on dating or professional networking
                  — not real-life shared activities.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                Our Solution
              </h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Find Your Tribe</h4>
                    <p className="text-gray-600">
                      Connect with people who love the same activities you do.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Join Real Events</h4>
                    <p className="text-gray-600">
                      From hiking to concerts — never experience it alone again.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <HeartHandshake className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Build Real Friendships</h4>
                    <p className="text-gray-600">
                      Shared experiences create the strongest bonds.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">What We Stand For</h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Inclusivity</h3>
              <p className="text-gray-600">
                Everyone is welcome — introverts, solo travelers, new in town,
                or just looking for activity buddies.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <MapPin className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">
                Real-World Connections
              </h3>
              <p className="text-gray-600">
                We’re not another social app. We get you offline and into real
                experiences.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <HeartHandshake className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Safety & Trust</h3>
              <p className="text-gray-600">
                Verified profiles, ratings, secure payments, and community
                guidelines keep everyone safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white border-t">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Find Your People?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands who have already turned solo plans into shared
            memories.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href="/events"
              className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition shadow-lg"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
