/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useEvents } from "@/hooks/useEvents";
import { EventCard } from "@/components/events/EventsCards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Filter,
  MapPin,
  SlidersHorizontal,
  X,
  TrendingUp,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Zap,
} from "lucide-react";

export default function EventsShow() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read current values from URL
  const urlType = searchParams.get("type") || "";
  const urlSearch = searchParams.get("search") || "";
  const urlLocation = searchParams.get("location") || "";
  const urlPage = Number(searchParams.get("page")) || 1;

  // Local controlled state
  const [search, setSearch] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);
  const [type, setType] = useState(urlType);
  const [location, setLocation] = useState(urlLocation);
  const [page, setPage] = useState(urlPage);
  const [showFilters, setShowFilters] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Sync local state when URL changes (back/forward, direct link, etc.)
  useEffect(() => {
    setType(urlType);
    setSearch(urlSearch);
    setDebouncedSearch(urlSearch);
    setLocation(urlLocation);
    setPage(urlPage);
  }, [urlType, urlSearch, urlLocation, urlPage]);
  // eslint-disable-next-line react-hooks/set-state-in-effect

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Update URL whenever filters or page change
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set("search", debouncedSearch);
    if (type) params.set("type", type);
    if (location) params.set("location", location);
    if (page > 1) params.set("page", page.toString());

    const query = params.toString();
    router.push(`/events${query ? `?${query}` : ""}`, { scroll: false });
  }, [debouncedSearch, type, location, page, router]);

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  // Query filters for API
  const filters = {
    search: debouncedSearch || undefined,
    type: type || undefined,
    location: location || undefined,
    page,
    limit: 12,
  };

  const { data, isLoading } = useEvents(filters);

  const categories = [
    { value: "", label: "All Events", icon: "🎉" },
    { value: "Music", label: "Music", icon: "🎵" },
    { value: "Sports", label: "Sports", icon: "⚽" },
    { value: "Technology", label: "Technology", icon: "💻" },
    { value: "Food", label: "Food", icon: "🍔" },
    { value: "Arts", label: "Arts", icon: "🎨" },
    { value: "Outdoor", label: "Outdoor", icon: "🏔️" },
  ];

  const popularSearches = [
    "Music Concert",
    "Tech Meetup",
    "Food Festival",
    "Yoga Session",
    "Hiking Trip",
    "Art Exhibition",
    "Sports Tournament",
    "Workshop",
    "Networking Event",
    "Gaming Night",
  ];

  const generateSuggestions = useCallback((input: string) => {
    if (!input || input.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    const lowercaseInput = input.toLowerCase();
    const filtered = popularSearches.filter((suggestion) =>
      suggestion.toLowerCase().includes(lowercaseInput)
    );

    const smartSuggestions = [
      ...filtered,
      `${input} near me`,
      `${input} this weekend`,
      `${input} events`,
    ].slice(0, 5);

    setSearchSuggestions(smartSuggestions);
    setShowSuggestions(true);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setIsSearching(true);
    generateSuggestions(value);
    setPage(1);
  };

  const applySuggestion = (suggestion: string) => {
    setSearch(suggestion);
    setDebouncedSearch(suggestion);
    setShowSuggestions(false);
    setPage(1);
  };

  const activeFiltersCount = [debouncedSearch, type, location].filter(
    Boolean
  ).length;

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setType("");
    setLocation("");
    setPage(1);
    setSearchSuggestions([]);
    router.push("/events", { scroll: false });
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              {data?.pagination.total || 0}+ Events Available
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Amazing Events
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6">
              Find your next adventure with AI-powered search
            </p>

            {/* Hero Search Bar */}
            <div className="relative max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Try 'Music Concert', 'Tech Meetup', or 'Food Festival'..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (search.length >= 2) setShowSuggestions(true);
                  }}
                  className="pl-12 pr-12 h-14 text-base bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-2 border-white/20 focus:border-white shadow-2xl"
                />
                {isSearching && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-spin" />
                )}
                {search && !isSearching && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setDebouncedSearch("");
                      setSearchSuggestions([]);
                      setPage(1);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* AI Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  <div className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-b">
                    <div className="flex items-center gap-2 px-3">
                      <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        AI-Powered Suggestions
                      </span>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {searchSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          applySuggestion(suggestion);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-3 group"
                      >
                        <Search className="h-4 w-4 text-gray-400 group-hover:text-primary" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary">
                          {suggestion}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Quick Category Buttons */}
          <div className="mb-6 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-2">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={type === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setType(cat.value);
                    setPage(1);
                  }}
                  className="whitespace-nowrap"
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Advanced Filters Card */}
          <Card className="mb-6 shadow-lg">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:hidden">
                <h3 className="font-semibold flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Advanced Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="default" className="ml-2">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  {showFilters ? "Hide" : "Show"}
                </Button>
              </div>

              <div className={`${showFilters ? "block" : "hidden"} md:block`}>
                <div className="grid md:grid-cols-12 gap-3">
                  <div className="md:col-span-5">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search events..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10 h-11"
                      />
                      {isSearching && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-3">
                    <Select
                      value={type}
                      onValueChange={(value) => {
                        setType(value);
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {categories.slice(1).map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <span className="flex items-center gap-2">
                              <span>{cat.icon}</span>
                              {cat.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-3">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Location"
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                          setPage(1);
                        }}
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>

                  {activeFiltersCount > 0 && (
                    <div className="md:col-span-1">
                      <Button
                        variant="ghost"
                        onClick={clearFilters}
                        className="w-full h-11"
                        title="Clear all filters"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Loading amazing events...
                </p>
              </div>
            </div>
          ) : data?.data.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn&apos;t find any events matching your criteria. Try
                  different filters!
                </p>
                {activeFiltersCount > 0 && (
                  <Button onClick={clearFilters} variant="outline">
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <p className="text-muted-foreground">
                    {type && (
                      <span className="font-semibold text-foreground mr-1">
                        {categories.find((c) => c.value === type)?.label} Events
                        ·
                      </span>
                    )}
                    <span className="font-semibold text-foreground">
                      {data?.data.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-foreground">
                      {data?.pagination.total}
                    </span>{" "}
                    events
                  </p>
                </div>

                {activeFiltersCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {activeFiltersCount} filter
                      {activeFiltersCount > 1 ? "s" : ""} active
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-8"
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </div>

              {/* Events Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {data?.data.map((event: any, idx: number) => (
                  <div
                    key={event.id}
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${
                        idx * 0.1
                      }s forwards`,
                      opacity: 0,
                    }}
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data && data.pagination.totalPages > 1 && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="w-full sm:w-auto"
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>

                      <div className="flex items-center gap-1 overflow-x-auto">
                        {Array.from(
                          { length: Math.min(data.pagination.totalPages, 7) },
                          (_, i) => {
                            let pageNum;
                            if (data.pagination.totalPages <= 7) {
                              pageNum = i + 1;
                            } else if (page <= 4) {
                              pageNum = i + 1;
                            } else if (page >= data.pagination.totalPages - 3) {
                              pageNum = data.pagination.totalPages - 6 + i;
                            } else {
                              pageNum = page - 3 + i;
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  pageNum === page ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setPage(pageNum)}
                                className="w-10 h-10"
                              >
                                {pageNum}
                              </Button>
                            );
                          }
                        )}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => setPage(page + 1)}
                        disabled={page === data.pagination.totalPages}
                        className="w-full sm:w-auto"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>

                    <div className="text-center mt-4 text-sm text-muted-foreground">
                      Page {page} of {data.pagination.totalPages}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
