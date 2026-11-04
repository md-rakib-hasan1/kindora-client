
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  Users,
  ArrowRight,
  LogIn,
  Loader2,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

interface JoinedEvent {
  _id: string;
  title: string;
  description: string;
  type: string;
  thumbnail: string;
  location: string;
  date: string;
  creatorEmail: string;
  joinedAt: string;
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const JoinedEventsPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [events, setEvents] = useState<JoinedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [leavingId, setLeavingId] = useState<string | null>(null);
  const [confirmLeaveId, setConfirmLeaveId] = useState<string | null>(null);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace(
        `/login?callbackURL=${encodeURIComponent("/joined-events")}`
      );
      return;
    }

    const fetchJoinedEvents = async () => {
      try {
        setLoading(true);

        const result = await apiFetch("/api/joined-events");

        setEvents(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("Failed to fetch joined events:", error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load joined events"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedEvents();
  }, [session, isPending, router]);

  const handleLeaveEvent = async (eventId: string) => {
    try {
      setLeavingId(eventId);

      await apiFetch(`/api/events/${eventId}/leave`, {
        method: "DELETE",
      });

      setEvents((previousEvents) =>
        previousEvents.filter((event) => event._id !== eventId)
      );

      setConfirmLeaveId(null);
      toast.success("You have left the event successfully!");
    } catch (error) {
      console.error("Failed to leave event:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to leave the event"
      );
    } finally {
      setLeavingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-green-700 dark:text-green-400" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Loading your joined events...
          </p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">
          Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-12 dark:bg-[#101810]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-700 dark:text-green-400">
            Your Activities
          </p>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            My Joined Events
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
            Keep track of the community events you have joined and the
            positive changes you are helping create.
          </p>
        </div>

        {/* Event Count */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
            <Users className="h-5 w-5" />
          </div>

          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {events.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Events joined
            </p>
          </div>
        </div>

        {/* Empty State */}
        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-[#192319]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
              <Users className="h-8 w-8" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              No joined events yet!
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600 dark:text-gray-400">
              You haven&apos;t joined any community events yet. Explore upcoming
              events and become part of something meaningful.
            </p>

            <Link
              href="/events"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-green-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-900 dark:bg-green-600 dark:hover:bg-green-700"
            >
              Explore Events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          /* Events Grid */
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-[#192319]"
              >
                {/* Thumbnail */}
                <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={event.thumbnail}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-green-800 px-3 py-1.5 text-xs font-semibold text-white dark:bg-green-600">
                    {event.type}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="line-clamp-1 text-xl font-bold text-gray-900 dark:text-white">
                    {event.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    {event.description}
                  </p>

                  <div className="mt-5 space-y-3 border-t border-gray-100 pt-4 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CalendarDays className="h-4 w-4 shrink-0 text-green-700 dark:text-green-400" />
                      <span>{formatDate(event.date)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 shrink-0 text-green-700 dark:text-green-400" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      Joined on: {formatDate(event.joinedAt)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      href={`/events/${event._id}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-800 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900 dark:bg-green-600 dark:hover:bg-green-700"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => setConfirmLeaveId(event._id)}
                      disabled={leavingId === event._id}
                      className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      Leave
                    </button>
                  </div>

                  {/* Leave Confirmation */}
                  {confirmLeaveId === event._id && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                            Leave this event?
                          </p>

                          <p className="mt-1 text-xs leading-5 text-red-700 dark:text-red-400">
                            You will be removed from this event's participant
                            list.
                          </p>
                        </div>

                        <button
                          onClick={() => setConfirmLeaveId(null)}
                          disabled={leavingId === event._id}
                          className="text-red-600 hover:text-red-800 dark:text-red-400"
                          aria-label="Cancel leave"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleLeaveEvent(event._id)}
                          disabled={leavingId === event._id}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                        >
                          {leavingId === event._id && (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          )}
                          {leavingId === event._id ? "Leaving..." : "Yes, Leave"}
                        </button>

                        <button
                          onClick={() => setConfirmLeaveId(null)}
                          disabled={leavingId === event._id}
                          className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-white dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Explore More */}
        {events.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-green-800 transition hover:text-green-950 dark:text-green-400 dark:hover:text-green-300"
            >
              Explore more community events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default JoinedEventsPage;
