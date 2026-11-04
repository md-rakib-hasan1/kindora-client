
"use client";

import { useEffect, useState } from "react";
import { usePathname, useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    MapPin,
    CalendarDays,
    UserRound,
    Users,
    ArrowLeft,
    Share2,
    CalendarPlus,
    Navigation,
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
    participantCount: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const EventDetailsPage = () => {
    const pathname = usePathname();
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;

    const { data: session, isPending: isSessionLoading } =
        authClient.useSession();

    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isJoining, setIsJoining] = useState(false);
    const [isJoinStatusLoading, setIsJoinStatusLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isJoined, setIsJoined] = useState(false);
    const [shareMessage, setShareMessage] = useState("");

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // Fetch event details and participant count
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/events/${eventId}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to load event.");
                }

                setEvent(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load event details."
                );
            } finally {
                setIsLoading(false);
            }
        };

        if (eventId) {
            fetchEvent();
        }
    }, [eventId]);

    // Check whether the current user has already joined
    useEffect(() => {
        const checkJoinStatus = async () => {
            if (isSessionLoading) return;

            if (!session?.user) {
                setIsJoined(false);
                setIsJoinStatusLoading(false);
                return;
            }

            setIsJoinStatusLoading(true);

            try {
                const result = await apiFetch(
                    `/api/events/${eventId}/join-status`
                );

                setIsJoined(result.isJoined);
            } catch (err) {
                console.error("Failed to check join status:", err);
                setIsJoined(false);
            } finally {
                setIsJoinStatusLoading(false);
            }
        };

        if (eventId) {
            checkJoinStatus();
        }
    }, [eventId, session, isSessionLoading]);

    //count down 
    useEffect(() => {
        if (!event?.date) return;

        const calculateCountdown = () => {
            const difference = new Date(event.date).getTime() - Date.now();

            if (difference <= 0) {
                setTimeLeft({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                });
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor(
                    (difference / (1000 * 60 * 60)) % 24
                ),
                minutes: Math.floor(
                    (difference / (1000 * 60)) % 60
                ),
                seconds: Math.floor((difference / 1000) % 60),
            });
        };

        calculateCountdown();

        const interval = setInterval(calculateCountdown, 1000);

        return () => clearInterval(interval);
    }, [event?.date]);

    // Join event
    const handleJoinEvent = async () => {
        if (!session?.user) {
            router.push(
                `/login?callbackURL=${encodeURIComponent(pathname)}`
            );
            return;
        }

        setIsJoining(true);
        setMessage("");

        try {
            const result = await apiFetch(
                `/api/events/${eventId}/join`,
                {
                    method: "POST",
                }
            );

            setIsJoined(true);

            // Update participant count immediately
            setEvent((previousEvent) => {
                if (!previousEvent) return previousEvent;

                return {
                    ...previousEvent,
                    participantCount:
                        (previousEvent.participantCount || 0) + 1,
                };
            });

            setMessage(
                result.message || "You joined this event successfully."
            );
        } catch (err) {
            setMessage(
                err instanceof Error
                    ? err.message
                    : "Unable to join this event."
            );
        } finally {
            setIsJoining(false);
        }
    };

    // Share event
    const handleShareEvent = async () => {
        const shareUrl = window.location.href;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: event?.title || "Kindora Event",
                    text: `Join this community event: ${event?.title}`,
                    url: shareUrl,
                });
            } else {
                await navigator.clipboard.writeText(shareUrl);

                setShareMessage("Event link copied successfully!");

                setTimeout(() => {
                    setShareMessage("");
                }, 3000);
            }
        } catch (error) {
            if (
                error instanceof Error &&
                error.name !== "AbortError"
            ) {
                setShareMessage("Unable to share this event.");
            }
        }
    };

    //calender function 
    const handleAddToCalendar = () => {
        if (!event) return;

        const startDate = new Date(event.date);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

        const formatDate = (date: Date) =>
            date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

        const escapeText = (text: string) =>
            text.replace(/\\/g, "\\\\")
                .replace(/,/g, "\\,")
                .replace(/;/g, "\\;")
                .replace(/\n/g, "\\n");

        const calendarContent = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Kindora//Community Events//EN",
            "BEGIN:VEVENT",
            `UID:${event._id}@kindora`,
            `DTSTAMP:${formatDate(new Date())}`,
            `DTSTART:${formatDate(startDate)}`,
            `DTEND:${formatDate(endDate)}`,
            `SUMMARY:${escapeText(event.title)}`,
            `DESCRIPTION:${escapeText(event.description)}`,
            `LOCATION:${escapeText(event.location)}`,
            "END:VEVENT",
            "END:VCALENDAR",
        ].join("\r\n");

        const blob = new Blob([calendarContent], {
            type: "text/calendar;charset=utf-8",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `${event.title.replace(/[^a-z0-9]/gi, "-")}.ics`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    if (isLoading || isSessionLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background">
                <p className="text-muted-foreground">
                    Loading event details...
                </p>
            </main>
        );
    }

    if (error || !event) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5">
                <h1 className="font-heading text-3xl font-bold text-primary">
                    Event Not Found
                </h1>

                <p className="mt-3 text-muted-foreground">
                    {error || "This event may have been removed."}
                </p>

                <Link
                    href="/events"
                    className="mt-6 rounded-lg bg-primary px-6 py-3 text-white"
                >
                    Back to Events
                </Link>
            </main>
        );
    }

    const isCreator = session?.user?.email === event.creatorEmail;


    return (
        <main className="min-h-screen bg-background px-5 py-12 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <Link
                    href="/events"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
                >
                    <ArrowLeft size={18} />
                    Back to Events
                </Link>

                <article className="overflow-hidden rounded-3xl border border-border bg-card">
                    <div className="relative h-64 w-full sm:h-96">
                        <Image
                            src={event.thumbnail}
                            alt={event.title}
                            fill
                            unoptimized
                            className="object-cover"
                        />
                    </div>

                    <div className="p-6 sm:p-10">
                        <span className="inline-block rounded-full bg-[#8AAE55]/15 px-4 py-2 text-sm font-semibold text-[#6D913F]">
                            {event.type}
                        </span>

                        <h1 className="mt-5 font-heading text-3xl font-bold text-primary sm:text-4xl">
                            {event.title}
                        </h1>

                        {/* Share, Calendar and Directions */}
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <button
                                onClick={handleShareEvent}
                                className="inline-flex h-11 items-center gap-2 rounded-lg border border-primary px-5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                            >
                                <Share2 size={17} />
                                Share Event
                            </button>

                            <button
                                onClick={handleAddToCalendar}
                                className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:opacity-90"
                            >
                                <CalendarPlus size={17} />
                                Add to Calendar
                            </button>

                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-11 items-center gap-2 rounded-lg border border-primary px-5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                            >
                                <Navigation size={17} />
                                Get Directions
                            </a>

                            {shareMessage && (
                                <p className="w-full text-sm text-muted-foreground">
                                    {shareMessage}
                                </p>
                            )}
                        </div>

                        {/* Event Countdown */}
                        {new Date(event.date).getTime() > Date.now() ? (
                            <div className="mt-8 rounded-2xl bg-primary p-6 text-white">
                                <h2 className="mb-5 text-center font-heading text-xl font-bold">
                                    Event Starts In
                                </h2>

                                <div className="grid grid-cols-4 gap-3 text-center">
                                    {[
                                        { label: "Days", value: timeLeft.days },
                                        { label: "Hours", value: timeLeft.hours },
                                        { label: "Minutes", value: timeLeft.minutes },
                                        { label: "Seconds", value: timeLeft.seconds },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className="rounded-xl bg-white/15 p-3"
                                        >
                                            <p className="text-2xl font-bold sm:text-3xl">
                                                {String(item.value).padStart(2, "0")}
                                            </p>

                                            <p className="mt-1 text-xs text-white/80">
                                                {item.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-8 rounded-xl bg-muted p-4 text-center font-semibold text-muted-foreground">
                                This event has already started.
                            </div>
                        )}

                        {/* Event Information */}
                        <div className="mt-6 grid gap-4 border-y border-border py-6 sm:grid-cols-2">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <CalendarDays
                                    className="text-[#8AAE55]"
                                    size={21}
                                />
                                <div>
                                    <p className="text-xs">Event Date</p>
                                    <p className="font-medium text-foreground">
                                        {new Date(event.date).toLocaleDateString(
                                            "en-BD",
                                            {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-muted-foreground">
                                <MapPin
                                    className="text-[#8AAE55]"
                                    size={21}
                                />
                                <div>
                                    <p className="text-xs">Location</p>
                                    <p className="font-medium text-foreground">
                                        {event.location}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Users
                                    className="text-[#8AAE55]"
                                    size={21}
                                />
                                <div>
                                    <p className="text-xs">Participants</p>
                                    <p className="font-medium text-foreground">
                                        {event.participantCount ?? 0}{" "}
                                        {event.participantCount === 1
                                            ? "Person Joined"
                                            : "People Joined"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-muted-foreground sm:col-span-2">
                                <UserRound
                                    className="text-[#8AAE55]"
                                    size={21}
                                />
                                <div>
                                    <p className="text-xs">Organized By</p>
                                    <p className="font-medium text-foreground">
                                        {event.creatorEmail}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* About Event */}
                        <section className="mt-8">
                            <h2 className="font-heading text-2xl font-bold text-primary">
                                About This Event
                            </h2>

                            <p className="mt-4 whitespace-pre-line leading-8 text-muted-foreground">
                                {event.description}
                            </p>
                        </section>

                        {/* Join Event */}
                        <div className="mt-10 border-t border-border pt-8">
                            {isCreator ? (
                                <p className="rounded-xl bg-muted p-4 text-center text-sm text-muted-foreground">
                                    You are the organizer of this event.
                                </p>
                            ) : isJoinStatusLoading ? (
                                <p className="rounded-xl bg-muted p-4 text-center text-sm text-muted-foreground">
                                    Checking your join status...
                                </p>
                            ) : isJoined ? (
                                <p className="rounded-xl bg-[#8AAE55]/15 p-4 text-center font-medium text-[#6D913F]">
                                    You have successfully joined this event!
                                </p>
                            ) : (
                                <button
                                    onClick={handleJoinEvent}
                                    disabled={isJoining}
                                    className="w-full rounded-xl bg-primary px-6 py-4 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isJoining
                                        ? "Joining Event..."
                                        : !session
                                            ? "Login to Join Event"
                                            : "Join This Event"}
                                </button>
                            )}

                            {message && !isJoined && (
                                <p className="mt-4 text-center text-sm text-destructive">
                                    {message}
                                </p>
                            )}
                        </div>
                    </div>
                </article>
            </div>
        </main>
    );

};

export default EventDetailsPage;
