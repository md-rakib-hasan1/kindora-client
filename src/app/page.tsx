
import CommunityGallery from "@/components/home/CommunityGallery";
import FeaturesSection from "@/components/home/FeaturesSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <main className="flex-1 bg-background">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24 lg:px-8">
        {/* Hero Content */}
        <div className="flex flex-col items-start">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-[#A5C96B]" />
            <span className="text-sm font-medium text-primary">
              Building Stronger Communities
            </span>
          </div>

          <h1 className="max-w-xl text-5xl leading-[1.15] font-bold tracking-tight text-primary sm:text-6xl lg:text-7xl">
            Small Acts.
            <br />
            Stronger
            <br />
            <span className="text-[#8AAE55]">Communities.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-muted-foreground sm:text-lg">
            Every small action creates a meaningful change. Discover local
            events, connect with passionate people, and make a positive impact
            in your community.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <Link
              href="/events"
              className="rounded-full bg-primary px-8 py-4 text-center text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Explore Events →
            </Link>

            <Link
              href="/create-event"
              className="rounded-full border border-primary px-8 py-4 text-center text-sm font-semibold text-primary transition-all hover:bg-secondary"
            >
              Create an Event
            </Link>
          </div>

          {/* Trust Indicator */}
          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-[#D6A85F] text-sm">
                🌱
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-[#A5C96B] text-sm">
                🤝
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-[#B8C9B0] text-sm">
                💚
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">
                Be part of the change
              </span>
              <br />
              Start with one small action.
            </p>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative">
          <div className="relative aspect-[4/4.2] overflow-hidden rounded-[2rem] bg-secondary">
            <Image
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1000&q=85"
              alt="Volunteers working together for their community"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Floating Card */}
          <div className="absolute -bottom-5 -left-3 rounded-2xl border border-border bg-card p-5 shadow-lg sm:-left-8">
            <p className="text-xs font-medium text-muted-foreground">
              Together we can
            </p>
            <p className="mt-1 font-heading text-2xl font-bold text-primary">
              Make an Impact.
            </p>
          </div>
        </div>
      </section>

      <FeaturesSection />
      <UpcomingEvents />
      <CommunityGallery />
      <NewsletterSection />  

      {/* Impact Statistics */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-10 text-center md:grid-cols-4 lg:px-8">
          {[
            { value: "01", label: "Start with one action" },
            { value: "02", label: "Connect with people" },
            { value: "03", label: "Join local events" },
            { value: "∞", label: "Create positive impact" },
          ].map((item) => (
            <div key={item.value} className="space-y-2">
              <h2 className="font-heading text-3xl font-bold text-primary">
                {item.value}
              </h2>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

         
    </main>
  );
};

export default Home;
