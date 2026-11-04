
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

type Event = {
  _id: string;
  title: string;
  description: string;
  type: string;
  thumbnail: string;
  location: string;
  date: string;
  creatorEmail: string;
};

const MyEventsPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace(
        `/login?callbackURL=${encodeURIComponent("/my-events")}`
      );
      return;
    }

    const fetchMyEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const result = (await apiFetch("/api/my-events")) as Event[];

        setEvents(result);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load your events.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [session, isPending, router]);

  const handleDelete = async (eventId: string) => {
    try {
      setDeletingId(eventId);

      await apiFetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      setEvents((previous) =>
        previous.filter((event) => event._id !== eventId)
      );

      setConfirmDeleteId(null);
      toast.success("Event deleted successfully!");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to delete event.";

      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (isPending || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF9F4] dark:bg-[#101A14]">
        <p className="text-gray-600 dark:text-gray-300">
          Loading your events...
        </p>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#FAF9F4] dark:bg-[#101A14]">
        <p className="text-gray-600 dark:text-gray-300">
          Redirecting to login...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F4] px-4 py-16 transition-colors duration-300 dark:bg-[#101A14]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-green-700 dark:text-green-400">
              Your Contributions
            </p>

            <h1 className="text-3xl font-bold text-[#183D2B] dark:text-[#E8F5E9] md:text-4xl">
              My Events
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Manage the community events you have created.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex items-center justify-center rounded-lg bg-[#245C3D] px-5 py-3 font-semibold text-white transition hover:bg-[#183D2B] dark:bg-[#3D8055] dark:hover:bg-[#4A9664]"
          >
            + Create New Event
          </Link>
        </div>

        {/* Event Count */}
        <div className="mb-7 rounded-xl border border-[#E5E8DF] bg-white p-5 dark:border-[#34483A] dark:bg-[#19271F]">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Total Events Created
          </p>

          <p className="mt-1 text-3xl font-bold text-[#245C3D] dark:text-green-400">
            {events.length}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
            <p className="font-medium text-red-700 dark:text-red-300">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm font-semibold text-red-700 underline dark:text-red-300"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!error && events.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#C8D5C8] bg-white px-6 py-16 text-center dark:border-[#405746] dark:bg-[#19271F]">
            <div className="mb-5 text-5xl">🌱</div>

            <h2 className="text-2xl font-bold text-[#183D2B] dark:text-[#E8F5E9]">
              No Events Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-600 dark:text-gray-300">
              You haven't created any community events yet. Start something
              meaningful and bring people together!
            </p>

            <Link
              href="/create-event"
              className="mt-7 inline-flex rounded-lg bg-[#245C3D] px-6 py-3 font-semibold text-white transition hover:bg-[#183D2B] dark:bg-[#3D8055] dark:hover:bg-[#4A9664]"
            >
              Create Your First Event
            </Link>
          </div>
        )}

        {/* Events Grid */}
        {!error && events.length > 0 && (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="overflow-hidden rounded-2xl border border-[#E5E8DF] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-[#34483A] dark:bg-[#19271F]"
              >
                {/* Thumbnail */}
                <div
                  className="h-52 bg-gray-200 bg-cover bg-center dark:bg-gray-700"
                  style={{
                    backgroundImage: `url("${event.thumbnail}")`,
                  }}
                  role="img"
                  aria-label={event.title}
                />

                <div className="p-5">
                  <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/50 dark:text-green-300">
                    {event.type}
                  </span>

                  <h2 className="mt-4 line-clamp-2 text-xl font-bold text-[#183D2B] dark:text-[#E8F5E9]">
                    {event.title}
                  </h2>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {event.description}
                  </p>

                  <div className="mt-5 space-y-3 border-t border-gray-100 pt-4 dark:border-gray-700">
                    <p className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span>📍</span>
                      <span>{event.location}</span>
                    </p>

                    <p className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span>📅</span>
                      <span>{formatDate(event.date)}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/events/${event._id}`}
                      className="flex-1 rounded-lg border border-[#245C3D] px-3 py-2.5 text-center text-sm font-semibold text-[#245C3D] transition hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-900/30"
                    >
                      View Details
                    </Link>

                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(event._id)}
                      disabled={deletingId === event._id}
                      className="rounded-lg bg-red-100 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-200 disabled:opacity-50 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-900"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Delete Confirmation */}
                  {confirmDeleteId === event._id && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        Are you sure you want to delete this event?
                      </p>

                      <div className="mt-3 flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleDelete(event._id)}
                          disabled={deletingId === event._id}
                          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {deletingId === event._id
                            ? "Deleting..."
                            : "Yes, Delete"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          disabled={deletingId === event._id}
                          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyEventsPage;
