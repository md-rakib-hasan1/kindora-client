
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Loader2 } from "lucide-react";

interface Event {
  _id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  thumbnail: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const UpcomingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/events`);

        if (!response.ok) {
          throw new Error("Failed to load upcoming events.");
        }

        const data = await response.json();

        setEvents(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (error) {
        console.error("Failed to fetch upcoming events:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  return (
    <section className="bg-card px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold tracking-[0.2em] text-[#8AAE55] uppercase">
              Make a Difference
            </span>

            <h2 className="mt-4 font-heading text-4xl font-bold text-primary sm:text-5xl">
              Upcoming Events
            </h2>

            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Discover opportunities to connect, contribute, and create
              meaningful change in your community.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-[#8AAE55]"
          >
            Explore All Events <span>→</span>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3">
            <Loader2 className="h-9 w-9 animate-spin text-[#8AAE55]" />
            <p className="text-sm text-muted-foreground">
              Loading upcoming events...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-900 dark:bg-red-950/20">
            <p className="font-semibold text-red-700 dark:text-red-400">
              {error}
            </p>
            <Link
              href="/events"
              className="mt-4 inline-block text-sm font-semibold text-primary underline"
            >
              Visit All Events
            </Link>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && events.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <h3 className="text-xl font-bold text-primary">
              No Upcoming Events
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              There are no upcoming community events right now. Check back
              later for new opportunities.
            </p>
            <Link
              href="/events"
              className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Explore Events
            </Link>
          </div>
        )}

        {/* Event Cards */}
        {!loading && !error && events.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="group overflow-hidden rounded-3xl border border-border bg-background transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={event.thumbnail}
                    alt={event.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <span className="absolute top-4 left-4 rounded-full bg-background px-4 py-2 text-xs font-semibold text-primary">
                    {event.type}
                  </span>
                </div>

                {/* Event Details */}
                <div className="p-6">
                  <h3 className="line-clamp-1 font-heading text-xl font-bold text-primary">
                    {event.title}
                  </h3>

                  <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                    <p className="flex items-center gap-3">
                      <CalendarDays className="h-4 w-4 shrink-0 text-[#8AAE55]" />
                      {formatDate(event.date)}
                    </p>

                    <p className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 shrink-0 text-[#8AAE55]" />
                      <span className="line-clamp-1">{event.location}</span>
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
        )}
      </div>
    </section>
  );
};

export default UpcomingEvents;
