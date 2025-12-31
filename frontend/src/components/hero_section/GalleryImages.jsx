import { useEffect, useState } from "react";

const galleryImages = [
  "/assets/destinations/alhaggar.jpg",
  "/assets/destinations/Atlas_Cedar_Forest_in_Mount_Chelia.jpg",
  "/assets/destinations/Beni Salah Mountain.jpg",
  "/assets/destinations/bni_haroun.jpg",
  "/assets/destinations/chrea.jpg",
];

const stats = [
  { label: "Experiences", value: 1000 },
  { label: "Countries", value: 100 },
  { label: "Years of Impact", value: 36 },
  { label: "Travelers", value: 500000 },
];

const slideContent = [
  {
    title: "Only Intrepid",
    subtitle: "Intrepid",
    description: "Discover experiences",
    highlight: "Real and remarkable small group trips worldwide",
  },
  {
    title: "1000s of experiences",
    subtitle: "Shared adventures",
    description: "Over 100 countries",
    highlight: "With like-minded people",
  },
  {
    title: "Creating positive change",
    subtitle: "Since 1989",
    description: "Sustainable travel",
    highlight: "Making a difference through responsible tourism",
  },
  {
    title: "Expert-led tours",
    subtitle: "Local leaders",
    description: "Authentic experiences",
    highlight: "Unique insights from local experts",
  },
  {
    title: "Community impact",
    subtitle: "Positive footprints",
    description: "Supporting locals",
    highlight: "Travel that gives back",
  },
];

export default function GalleryWithStats() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [counts, setCounts] = useState(stats.map(() => 0));

  /* Counter animation */
  useEffect(() => {
    const timers = stats.map((stat, i) =>
      setInterval(() => {
        setCounts((prev) => {
          const updated = [...prev];
          if (updated[i] < stat.value) {
            updated[i] += Math.ceil(stat.value / 80);
          }
          return updated;
        });
      }, 30)
    );
    return () => timers.forEach(clearInterval);
  }, []);

  const next = () =>
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);

  const prev = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );

  return (
    <section className="pb-16 px-4 md:px-8 z-10">
      <div className="max-w-7xl mx-auto border-b pb-12 border-gray-200">
        <div className="relative overflow-hidden rounded-2xl">
          
          {/* Slides */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {galleryImages.map((src, i) => (
              <div
                key={i}
                className="w-full flex-shrink-0 relative h-[320px] sm:h-[400px] md:h-[500px]"
              >
                <img
                  src={src}
                  alt={`Slide ${i + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Text */}
                <div className="absolute bottom-0 p-6 md:p-10 text-white max-w-xl">
                  <span className="inline-block mb-3 px-4 py-1 text-sm rounded-full bg-yellow-400/20 text-yellow-300">
                    {slideContent[i].subtitle}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    {slideContent[i].title}
                  </h3>
                  <p className="text-white/90 mt-1">
                    {slideContent[i].description}
                  </p>
                  <p className="text-yellow-300 font-semibold mt-1">
                    {slideContent[i].highlight}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/50 rounded-full flex items-center justify-center text-white text-2xl"
          >
            ‹
          </button>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/50 rounded-full flex items-center justify-center text-white text-2xl"
          >
            ›
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-3 mt-6">
          {galleryImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-3 rounded-full transition-all duration-300 ${
                i === currentSlide ? "w-8 bg-yellow-400" : "w-3 bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center border border-white/20"
            >
              <div className="text-4xl font-bold text-yellow-300">
                {counts[i].toLocaleString()}
                {stat.label === "Years of Impact" && "+"}
              </div>
              <div className="text-white/90 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
