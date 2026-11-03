
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

  return (
    <main className="min-h-screen bg-background px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
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

        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground">
            Loading events...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/30 bg-card p-8 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        ) : events.length === 0 ? (
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
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              Showing {events.length} upcoming events
            </p>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <article
                  key={event._id}
                  className="group overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
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

                  <div className="p-6">
                    <h2 className="font-heading text-xl font-bold text-primary">
                      {event.title}
                    </h2>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {event.description}
                    </p>

                    <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                      <p>📅 {new Date(event.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}</p>

                      <p>📍 {event.location}</p>
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
