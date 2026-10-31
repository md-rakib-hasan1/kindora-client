
import { Search, Users, Sprout } from "lucide-react";

const features = [
  {
    number: "01",
    icon: Search,
    title: "Discover Events",
    description:
      "Find meaningful community events and discover opportunities to make a difference around you.",
  },
  {
    number: "02",
    icon: Users,
    title: "Join & Connect",
    description:
      "Meet passionate people, build meaningful connections, and work together toward a better community.",
  },
  {
    number: "03",
    icon: Sprout,
    title: "Make an Impact",
    description:
      "Turn your small actions into positive changes that create a lasting impact on the world.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-[#F6F5EB] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-semibold tracking-[0.2em] text-[#8AAE55] uppercase">
            Why Kindora?
          </span>

          <h2 className="mt-4 font-heading text-4xl leading-tight font-bold text-[#174C37] sm:text-5xl">
            Good Things Happen When We Come Together.
          </h2>

          <p className="mt-5 text-base leading-8 text-[#68776D]">
            Making a difference doesn't have to be complicated. Start small,
            connect with others, and create meaningful change.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.number}
                className="group rounded-3xl border border-[#DCE2D7] bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#A5C96B] hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E9EDE2] text-[#174C37] transition-colors group-hover:bg-[#174C37] group-hover:text-white">
                    <Icon size={26} strokeWidth={1.8} />
                  </div>

                  <span className="font-heading text-3xl font-bold text-[#DCE2D7]">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-8 font-heading text-2xl font-bold text-[#174C37]">
                  {feature.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#68776D]">
                  {feature.description}
                </p>

                <div className="mt-8 h-1 w-12 rounded-full bg-[#A5C96B] transition-all duration-300 group-hover:w-20" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
