
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CalendarCheck,
  Clock,
  HeartHandshake,
  Plus,
  Compass,
  ArrowRight,
  MapPin,
  Loader2,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

interface Event {
  _id: string;
  title: string;
  description: string;
  type: string;
  thumbnail: string;
  location: string;
  date: string;
  creatorEmail: string;
  joinedAt?: string;
}

const DashboardPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace(
        `/login?callbackURL=${encodeURIComponent("/dashboard")}`
      );
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [createdResult, joinedResult] = await Promise.all([
          apiFetch("/api/my-events"),
          apiFetch("/api/joined-events"),
        ]);

        setMyEvents(Array.isArray(createdResult) ? createdResult : []);
        setJoinedEvents(Array.isArray(joinedResult) ? joinedResult : []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session, isPending, router]);

  const allEvents = useMemo(() => {
    const eventMap = new Map<string, Event>();

    [...myEvents, ...joinedEvents].forEach((event) => {
      eventMap.set(event._id, {
        ...eventMap.get(event._id),
        ...event,
      });
    });

    return Array.from(eventMap.values());
  }, [myEvents, joinedEvents]);

  const upcomingEvents = allEvents.filter(
    (event) => new Date(event.date).getTime() >= Date.now()
  );

  const pastEvents = allEvents.filter(
    (event) => new Date(event.date).getTime() < Date.now()
  );

  const recentEvents = [...allEvents]
    .sort(
      (a, b) =>
        new Date(b.joinedAt || b.date).getTime() -
        new Date(a.joinedAt || a.date).getTime()
    )
    .slice(0, 4);

  const stats = [
    {
      title: "Created Events",
      value: myEvents.length,
      description: "Events you organized",
      icon: CalendarDays,
    },
    {
      title: "Joined Events",
      value: joinedEvents.length,
      description: "Events you participate in",
      icon: HeartHandshake,
    },
    {
      title: "Upcoming Events",
      value: upcomingEvents.length,
      description: "Events yet to happen",
      icon: CalendarCheck,
    },
    {
      title: "Past Events",
      value: pastEvents.length,
      description: "Events completed or passed",
      icon: Clock,
    },
  ];

  if (isPending || loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF9F4] dark:bg-[#101A14]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-green-700 dark:text-green-400" />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Loading your dashboard...
          </p>
        </div>
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
    <main className="min-h-screen bg-[#FAF9F4] px-4 py-10 transition-colors duration-300 dark:bg-[#101A14] md:py-14">
      <div className="mx-auto max-w-7xl">

        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-green-700 dark:text-green-400">
              <LayoutDashboard className="h-4 w-4" />
              User Dashboard
            </div>

            <h1 className="text-3xl font-bold text-[#183D2B] dark:text-[#E8F5E9] md:text-4xl">
              Welcome back, {session.user.name?.split(" ")[0] || "Friend"}!
            </h1>

            <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
              Manage your community activities and keep making a positive
              difference with Kindora.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#245C3D] px-5 py-3 font-semibold text-white transition hover:bg-[#183D2B] dark:bg-[#3D8055] dark:hover:bg-[#4A9664]"
          >
            <Plus className="h-5 w-5" />
            Create Event
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="text-sm font-semibold text-red-700 underline dark:text-red-300"
            >
              Try Again
            </button>
          </div>
        )}

        {!error && (
          <>
            {/* Statistics */}
            <section className="mb-10">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-[#183D2B] dark:text-[#E8F5E9]">
                  Your Overview
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  A quick look at your community involvement.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.title}
                      className="rounded-2xl border border-[#E5E8DF] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-[#34483A] dark:bg-[#19271F]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-[#245C3D] dark:bg-green-900/40 dark:text-green-400">
                          <Icon className="h-6 w-6" />
                        </div>

                        <span className="text-3xl font-bold text-[#183D2B] dark:text-[#E8F5E9]">
                          {stat.value}
                        </span>
                      </div>

                      <h3 className="mt-5 font-semibold text-[#183D2B] dark:text-[#E8F5E9]">
                        {stat.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {stat.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="mb-10">
              <h2 className="mb-5 text-xl font-bold text-[#183D2B] dark:text-[#E8F5E9]">
                Quick Actions
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  href="/create-event"
                  className="group flex items-center justify-between rounded-2xl bg-[#245C3D] p-5 text-white transition hover:bg-[#183D2B] dark:bg-[#245C3D] dark:hover:bg-[#306B48]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                      <Plus className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Create Event</h3>
                      <p className="mt-1 text-sm text-green-100">
                        Start a new initiative
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/my-events"
                  className="group flex items-center justify-between rounded-2xl border border-[#E5E8DF] bg-white p-5 transition hover:border-green-600 hover:shadow-md dark:border-[#34483A] dark:bg-[#19271F]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-[#245C3D] dark:bg-green-900/40 dark:text-green-400">
                      <CalendarDays className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#183D2B] dark:text-[#E8F5E9]">
                        Manage Events
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage your creations
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-700" />
                </Link>

                <Link
                  href="/joined-events"
                  className="group flex items-center justify-between rounded-2xl border border-[#E5E8DF] bg-white p-5 transition hover:border-green-600 hover:shadow-md dark:border-[#34483A] dark:bg-[#19271F]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-[#245C3D] dark:bg-green-900/40 dark:text-green-400">
                      <HeartHandshake className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#183D2B] dark:text-[#E8F5E9]">
                        Joined Events
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        View your participation
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-700" />
                </Link>
              </div>
            </section>

            {/* Recent Events */}
            <section>
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-bold text-[#183D2B] dark:text-[#E8F5E9]">
                    Your Recent Activities
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Events you created or joined.
                  </p>
                </div>

                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-green-800 transition hover:text-green-950 dark:text-green-400 dark:hover:text-green-300"
                >
                  Explore Events
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {recentEvents.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#C8D5C8] bg-white px-6 py-14 text-center dark:border-[#405746] dark:bg-[#19271F]">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-[#245C3D] dark:bg-green-900/40 dark:text-green-400">
                    <HeartHandshake className="h-7 w-7" />
                  </div>

                  <h3 className="text-lg font-bold text-[#183D2B] dark:text-[#E8F5E9]">
                    Your journey starts here!
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
                    You haven't created or joined any events yet. Explore
                    opportunities and become part of something meaningful.
                  </p>

                  <Link
                    href="/events"
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#245C3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#183D2B] dark:bg-[#3D8055] dark:hover:bg-[#4A9664]"
                  >
                    <Compass className="h-4 w-4" />
                    Explore Events
                  </Link>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  {recentEvents.map((event) => {
                    const isJoined = joinedEvents.some(
                      (joined) => joined._id === event._id
                    );

                    return (
                      <article
                        key={event._id}
                        className="flex flex-col overflow-hidden rounded-2xl border border-[#E5E8DF] bg-white shadow-sm transition hover:shadow-md dark:border-[#34483A] dark:bg-[#19271F] sm:flex-row"
                      >
                        <div
                          className="h-44 shrink-0 bg-gray-200 bg-cover bg-center dark:bg-gray-700 sm:h-auto sm:w-36"
                          style={{
                            backgroundImage: `url("${event.thumbnail}")`,
                          }}
                          role="img"
                          aria-label={event.title}
                        />

                        <div className="flex flex-1 flex-col justify-between p-5">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/50 dark:text-green-300">
                                {event.type}
                              </span>

                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {isJoined ? "Joined" : "Created"}
                              </span>
                            </div>

                            <h3 className="mt-3 line-clamp-1 text-lg font-bold text-[#183D2B] dark:text-[#E8F5E9]">
                              {event.title}
                            </h3>

                            <div className="mt-3 space-y-2">
                              <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <CalendarDays className="h-4 w-4 shrink-0 text-green-700 dark:text-green-400" />
                                {new Date(event.date).toLocaleDateString(
                                  "en-BD",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </p>

                              <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <MapPin className="h-4 w-4 shrink-0 text-green-700 dark:text-green-400" />
                                <span className="line-clamp-1">
                                  {event.location}
                                </span>
                              </p>
                            </div>
                          </div>

                          <Link
                            href={`/events/${event._id}`}
                            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-800 transition hover:text-green-950 dark:text-green-400 dark:hover:text-green-300"
                          >
                            View Details
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default DashboardPage;
