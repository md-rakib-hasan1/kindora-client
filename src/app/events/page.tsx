
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, CalendarDays, SlidersHorizontal, X } from "lucide-react";

interface Event {
    _id: string;
    title: string;
    description: string;
    type: string;
    thumbnail: string;
    location: string;
    date: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const EventsPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Search and Filter States
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("date-asc");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${API_URL}/api/events`);

                if (!response.ok) {
                    throw new Error("Failed to load events.");
                }

                const data: Event[] = await response.json();
                setEvents(data);
            } catch {
                setError("Unable to load events. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Get unique event categories
    const categories = useMemo(() => {
        return [
            "All",
            ...Array.from(new Set(events.map((event) => event.type))),
        ];
    }, [events]);

    // Search and Filter Events
    const filteredEvents = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return events.filter((event) => {
            const matchesSearch =
                event.title.toLowerCase().includes(query) ||
                event.description.toLowerCase().includes(query) ||
                event.location.toLowerCase().includes(query);

            const matchesCategory =
                selectedCategory === "All" || event.type === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [events, searchTerm, selectedCategory]);

    // Sort filtered events
    const sortedEvents = useMemo(() => {
        const sorted = [...filteredEvents];

        switch (sortOrder) {
            case "date-asc":
                return sorted.sort(
                    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                );

            case "date-desc":
                return sorted.sort(
                    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );

            case "title-asc":
                return sorted.sort((a, b) => a.title.localeCompare(b.title));

            case "title-desc":
                return sorted.sort((a, b) => b.title.localeCompare(a.title));

            default:
                return sorted;
        }
    }, [filteredEvents, sortOrder]);

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("All");
        setSortOrder("date-asc");
    };

    const hasActiveFilters =
        searchTerm.trim() !== "" ||
        selectedCategory !== "All" ||
        sortOrder !== "date-asc";

    return (
        <main className="min-h-screen bg-background px-5 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Page Heading */}
                <div className="mb-12 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8AAE55]">
                        Make a Difference
                    </p>

                    <h1 className="mt-4 font-heading text-4xl font-bold text-primary sm:text-5xl">
                        Explore Community Events
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
                        Discover meaningful opportunities, connect with your community,
                        and become part of something positive.
                    </p>
                </div>

                {/* Search and Filter */}
                {!isLoading && !error && events.length > 0 && (
                    <div className="mb-10 rounded-2xl border border-border bg-card p-5 sm:p-6">
                        <div className="grid gap-5 md:grid-cols-[1fr_220px_220px]">
                            {/* Search Input */}
                            <div>
                                <label
                                    htmlFor="event-search"
                                    className="mb-2 block text-sm font-semibold text-primary"
                                >
                                    Search Events
                                </label>

                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                                    <input
                                        id="event-search"
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by title, description or location..."
                                        className="w-full rounded-xl border border-border bg-background py-3 pl-12 pr-4 text-sm text-foreground outline-none transition focus:border-[#8AAE55] focus:ring-2 focus:ring-[#8AAE55]/20"
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label
                                    htmlFor="event-category"
                                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary"
                                >
                                    <SlidersHorizontal className="h-4 w-4" />
                                    Filter by Category
                                </label>

                                <select
                                    id="event-category"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#8AAE55] focus:ring-2 focus:ring-[#8AAE55]/20"
                                >
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category === "All" ? "All Categories" : category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sorting */}
                            <div>
                                <label
                                    htmlFor="event-sort"
                                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary"
                                >
                                    <SlidersHorizontal className="h-4 w-4" />
                                    Sort Events
                                </label>

                                <select
                                    id="event-sort"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#8AAE55] focus:ring-2 focus:ring-[#8AAE55]/20"
                                >
                                    <option value="date-asc">Date: Earliest First</option>
                                    <option value="date-desc">Date: Latest First</option>
                                    <option value="title-asc">Name: A–Z</option>
                                    <option value="title-desc">Name: Z–A</option>
                                </select>
                            </div>

                        </div>

                        {/* Filter Summary */}
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                            <p className="text-sm text-muted-foreground">
                                <span className="font-semibold text-primary">
                                    {filteredEvents.length}
                                </span>{" "}
                                {filteredEvents.length === 1 ? "event" : "events"} found
                            </p>

                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#8AAE55] transition hover:text-primary"
                                >
                                    <X className="h-4 w-4" />
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading ? (
                    <div className="py-20 text-center text-muted-foreground">
                        Loading events...
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-destructive/30 bg-card p-8 text-center">
                        <p className="text-destructive">{error}</p>
                    </div>
                ) : events.length === 0 ? (
                    /* No Events */
                    <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
                        <h2 className="font-heading text-2xl font-bold text-primary">
                            No Upcoming Events
                        </h2>

                        <p className="mt-3 text-muted-foreground">
                            There are no upcoming community events right now. Check back
                            later or create an event to inspire others.
                        </p>

                        <Link
                            href="/create-event"
                            className="mt-6 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
                        >
                            Create an Event
                        </Link>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    /* No Search Results */
                    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                            <Search className="h-6 w-6 text-muted-foreground" />
                        </div>

                        <h2 className="mt-5 font-heading text-2xl font-bold text-primary">
                            No Matching Events Found
                        </h2>

                        <p className="mt-3 text-muted-foreground">
                            Try another search term or choose a different category.
                        </p>

                        <button
                            onClick={clearFilters}
                            className="mt-6 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Results Count */}
                        <p className="mb-6 text-sm text-muted-foreground">
                            Showing {filteredEvents.length} of {events.length} upcoming events
                        </p>

                        {/* Event Cards */}
                        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                            {sortedEvents.map((event) => (
                                <article
                                    key={event._id}
                                    className="group overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                        <Image
                                            src={event.thumbnail}
                                            alt={event.title}
                                            fill
                                            unoptimized
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />

                                        <span className="absolute left-4 top-4 rounded-full bg-background px-4 py-2 text-xs font-semibold text-primary">
                                            {event.type}
                                        </span>
                                    </div>

                                    {/* Event Details */}
                                    <div className="p-6">
                                        <h2 className="font-heading text-xl font-bold text-primary">
                                            {event.title}
                                        </h2>

                                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                                            {event.description}
                                        </p>

                                        <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                                            <p className="flex items-center gap-3">
                                                <CalendarDays className="h-4 w-4 shrink-0 text-[#8AAE55]" />
                                                {new Date(event.date).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </p>

                                            <p className="flex items-center gap-3">
                                                <MapPin className="h-4 w-4 shrink-0 text-[#8AAE55]" />
                                                {event.location}
                                            </p>
                                        </div>

                                        <Link
                                            href={`/events/${event._id}`}
                                            className="mt-7 flex w-full items-center justify-center rounded-full border border-primary py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                                        >
                                            View Details →
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default EventsPage;
