
import Image from "next/image";
import Link from "next/link";

const events = [
  {
    id: "1",
    title: "Green City Cleanup",
    type: "Environment",
    date: "2026-12-05",
    location: "Dhaka, Bangladesh",
    thumbnail:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=85",
  },
  {
    id: "2",
    title: "Plant a Tree, Grow a Future",
    type: "Plantation",
    date: "2026-12-12",
    location: "Mirpur, Dhaka",
    thumbnail:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=85",
  },
  {
    id: "3",
    title: "Winter Clothes Donation",
    type: "Donation",
    date: "2026-12-18",
    location: "Uttara, Dhaka",
    thumbnail:
      "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=800&q=85",
  },
  {
    id: "4",
    title: "Community Food Drive",
    type: "Community",
    date: "2026-12-22",
    location: "Dhanmondi, Dhaka",
    thumbnail:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=85",
  },
  {
    id: "5",
    title: "Neighborhood Garden Project",
    type: "Plantation",
    date: "2027-01-08",
    location: "Gulshan, Dhaka",
    thumbnail:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=85",
  },
  {
    id: "6",
    title: "Clean Water Awareness",
    type: "Awareness",
    date: "2027-01-15",
    location: "Mohammadpur, Dhaka",
    thumbnail:
      "https://images.unsplash.com/photo-1541919329513-35f7af297129?w=800&q=85",
  },
];

const UpcomingEvents = () => {
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

        {/* Event Cards */}
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.id}
              className="group overflow-hidden rounded-3xl border border-border bg-background transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden">
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
                <h3 className="font-heading text-xl font-bold text-primary">
                  {event.title}
                </h3>

                <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                  <p className="flex items-center gap-3">
                    <span aria-hidden="true">📅</span>
                    {new Date(`${event.date}T00:00:00`).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>

                  <p className="flex items-center gap-3">
                    <span aria-hidden="true">📍</span>
                    {event.location}
                  </p>
                </div>

                <Link
                  href={`/events/${event.id}`}
                  className="mt-7 flex w-full items-center justify-center rounded-full border border-primary py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  View Details →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
