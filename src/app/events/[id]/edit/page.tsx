
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

type EventFormData = {
  title: string;
  description: string;
  type: string;
  thumbnail: string;
  location: string;
  date: string;
};

type EventData = {
  _id: string;
  title: string;
  description: string;
  type: string;
  thumbnail: string;
  location: string;
  date: string;
  creatorEmail: string;
};

const eventCategories = [
  "Clothes Distribution",
  "Food Distribution",
  "Education Support",
  "Medical Camp",
  "Tree Plantation",
  "Blood Donation",
  "Community Cleaning",
  "Other",
];

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 dark:border-gray-600 dark:bg-[#1B2A22] dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:border-green-500 dark:focus:ring-green-900/50";

const labelClass =
  "mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200";

const getLocalDateTime = (date: string) => {
  const localDate = new Date(date);
  const timezoneOffset = localDate.getTimezoneOffset() * 60000;

  return new Date(localDate.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 16);
};

const EditEventPage = () => {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const { data: session, isPending } = authClient.useSession();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    type: "",
    thumbnail: "",
    location: "",
    date: "",
  });

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace(
        `/login?callbackURL=${encodeURIComponent(
          `/events/${eventId}/edit`
        )}`
      );
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const event = (await apiFetch(
          `/api/events/${eventId}`
        )) as EventData;

        if (!event || !event._id) {
          throw new Error("Event not found.");
        }

        setFormData({
          title: event.title || "",
          description: event.description || "",
          type: event.type || "",
          thumbnail: event.thumbnail || "",
          location: event.location || "",
          date: event.date ? getLocalDateTime(event.date) : "",
        });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load event information.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, session?.user, isPending, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please login to update this event.");
      router.push(
        `/login?callbackURL=${encodeURIComponent(
          `/events/${eventId}/edit`
        )}`
      );
      return;
    }

    if (new Date(formData.date).getTime() <= new Date().getTime()) {
      toast.error("Please select a future date and time.");
      return;
    }

    try {
      setUpdating(true);

      const updatedEvent = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };

      await apiFetch(`/api/events/${eventId}`, {
        method: "PATCH",
        body: JSON.stringify(updatedEvent),
      });

      toast.success("Event updated successfully!");

      router.push(`/events/${eventId}`);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update event. Please try again.";

      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  if (isPending || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF9F4] dark:bg-[#101A14]">
        <p className="text-gray-600 dark:text-gray-300">
          Loading event information...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF9F4] px-4 dark:bg-[#101A14]">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center dark:border-red-900 dark:bg-[#19271F]">
          <h2 className="text-xl font-bold text-red-700 dark:text-red-300">
            Unable to Load Event
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-300">
            {error}
          </p>

          <Link
            href="/my-events"
            className="mt-6 inline-block rounded-lg bg-[#245C3D] px-5 py-3 font-semibold text-white hover:bg-[#183D2B] dark:bg-[#3D8055] dark:hover:bg-[#4A9664]"
          >
            Back to My Events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F4] px-4 py-16 transition-colors duration-300 dark:bg-[#101A14]">
      <div className="mx-auto max-w-3xl">
        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-green-700 dark:text-green-400">
            Update Your Contribution
          </p>

          <h1 className="text-3xl font-bold text-[#183D2B] dark:text-[#E8F5E9] md:text-4xl">
            Edit Community Event
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-gray-600 dark:text-gray-300">
            Update your event information to keep your community informed.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-[#E5E8DF] bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#34483A] dark:bg-[#19271F] md:p-9"
        >
          {/* Title */}
          <div>
            <label htmlFor="title" className={labelClass}>
              Event Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              minLength={5}
              maxLength={100}
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Winter Clothes Distribution"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClass}>
              Event Description
            </label>

            <textarea
              id="description"
              name="description"
              required
              minLength={20}
              maxLength={1000}
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event, its purpose and how people can contribute..."
              className={`${inputClass} resize-y`}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="type" className={labelClass}>
              Event Category
            </label>

            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="">Select a category</option>

              {eventCategories.map((category) => (
                <option
                  key={category}
                  value={category}
                  className="bg-white text-gray-900 dark:bg-[#1B2A22] dark:text-gray-100"
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Thumbnail */}
          <div>
            <label htmlFor="thumbnail" className={labelClass}>
              Event Thumbnail URL
            </label>

            <input
              id="thumbnail"
              name="thumbnail"
              type="url"
              required
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/event-image.jpg"
              className={inputClass}
            />

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Add a publicly accessible image URL.
            </p>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className={labelClass}>
              Event Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Mirpur 10, Dhaka"
              className={inputClass}
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className={labelClass}>
              Event Date & Time
            </label>

            <input
              id="date"
              name="date"
              type="datetime-local"
              required
              min={new Date(new Date().getTime() + 60000)
                .toISOString()
                .slice(0, 16)}
              value={formData.date}
              onChange={handleChange}
              className={`${inputClass} dark:[color-scheme:dark]`}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={updating}
              className="flex-1 rounded-lg bg-[#245C3D] px-6 py-3.5 font-semibold text-white transition duration-200 hover:bg-[#183D2B] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#3D8055] dark:hover:bg-[#4A9664] dark:focus:ring-offset-[#19271F]"
            >
              {updating ? "Updating Event..." : "Save Changes"}
            </button>

            <Link
              href="/my-events"
              className="rounded-lg border border-gray-300 px-6 py-3.5 text-center font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditEventPage;
