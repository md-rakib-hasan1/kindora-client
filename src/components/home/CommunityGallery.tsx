
import Image from "next/image";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=85",
    alt: "Volunteers working together",
    title: "Working Together",
  },
  {
    src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=85",
    alt: "Community tree plantation",
    title: "Growing Greener",
  },
  {
    src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=85",
    alt: "Volunteers helping the community",
    title: "Sharing Kindness",
  },
  {
    src: "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=800&q=85",
    alt: "Donation and community support",
    title: "Giving Hope",
  },
];

const CommunityGallery = () => {
  return (
    <section className="bg-[#F6F5EB] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#174C37]">
              Moments That Matter
            </p>

            <h2 className="max-w-xl text-3xl font-bold text-[#253B32] md:text-4xl lg:text-5xl">
              Together, We Make a Difference
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-[#68776D]">
            Every small act of kindness creates a meaningful story.
            Explore moments from communities coming together.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {galleryImages.map((image, index) => (
            <div
              key={image.title}
              className={`group relative overflow-hidden rounded-2xl ${
                index % 2 === 1 ? "lg:mt-10" : ""
              }`}
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <h3 className="absolute bottom-6 left-5 text-xl font-semibold text-white">
                  {image.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityGallery;
