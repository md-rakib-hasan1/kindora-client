
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

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

const CreateEventPage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "",
        thumbnail: "",
        location: "",
        date: "",
    });

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
            toast.error("Please login to create an event.");
            router.push(
                `/login?callbackURL=${encodeURIComponent("/create-event")}`
            );
            return;
        }

        if (new Date(formData.date).getTime() <= new Date().getTime()) {
            toast.error("Please select a future date and time.");
            return;
        }

        try {
            setLoading(true);

            const eventData = {
                ...formData,
                date: new Date(formData.date).toISOString(),
            };

            const result = await apiFetch("/api/events", {
                method: "POST",
                body: JSON.stringify(eventData),
            });

            toast.success("Your event has been created successfully!");

            const eventId = result.insertedId || result.eventId || result._id;

            if (eventId) {
                router.push(`/events/${eventId}`);
            } else {
                router.push("/events");
            }

            router.refresh();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again.";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 dark:border-gray-600 dark:bg-[#1B2A22] dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:border-green-500 dark:focus:ring-green-900/50";

    const labelClass =
        "mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200";

    if (isPending) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-[#FAF9F4] dark:bg-[#101A14]">
                <p className="text-gray-600 dark:text-gray-300">
                    Checking authentication...
                </p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FAF9F4] px-4 py-16 transition-colors duration-300 dark:bg-[#101A14]">
            <div className="mx-auto max-w-3xl">
                {/* Page Heading */}
                <div className="mb-10 text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-green-700 dark:text-green-400">
                        Make a Difference
                    </p>

                    <h1 className="text-3xl font-bold text-[#183D2B] dark:text-[#E8F5E9] md:text-4xl">
                        Create a Community Event
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-gray-600 dark:text-gray-300">
                        Bring people together for a meaningful cause. Create an event and
                        inspire your community to make a difference.
                    </p>
                </div>

                {/* Create Event Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl border border-[#E5E8DF] bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#34483A] dark:bg-[#19271F] md:p-9"
                >
                    {/* Event Title */}
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

                    {/* Event Description */}
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

                    {/* Event Category */}
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

                    {/* Thumbnail URL */}
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

                    {/* Event Location */}
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

                    {/* Event Date */}
                    <div>
                        <label htmlFor="date" className={labelClass}>
                            Event Date & Time
                        </label>

                        <input
                            id="date"
                            name="date"
                            type="datetime-local"
                            required
                            min={new Date(new Date().getTime() + 60000).toISOString().slice(0, 16)}
                            value={formData.date}
                            onChange={handleChange}
                            className={`${inputClass} dark:[color-scheme:dark]`}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-[#245C3D] px-6 py-3.5 font-semibold text-white transition duration-200 hover:bg-[#183D2B] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#3D8055] dark:hover:bg-[#4A9664] dark:focus:ring-offset-[#19271F]"
                    >
                        {loading ? "Creating Event..." : "Create Event"}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default CreateEventPage;
