import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const galleryImages = [
  "/assets/destinations/Alhaggar.jpg",
  "/assets/destinations/Atlas_Cedar_Forest.jpg",
  "/assets/destinations/Beni_Salah_Mountain.jpg",
  "/assets/destinations/bni_haroun.jpg",
  "/assets/destinations/chrea.jpg",
];

const stats = [
  { label: "Experiences", value: 500 },
  { label: "Provinces", value: 58 },
  { label: "Years of Impact", value: 12 },
  { label: "Travelers", value: 12500 },
];

const slideContent = [
  {
    title: "Al Haggar Mountains",
    subtitle: "Saharan Peaks",
    description: "Explore the majestic Al Haggar mountains with breathtaking desert landscapes.",
    highlight: "Adventure and culture in southern Algeria",
  },
  {
    title: "Atlas Cedar Forest",
    subtitle: "Nature Escape",
    description: "Walk among ancient Atlas cedars in a serene forest environment.",
    highlight: "Perfect for hiking and nature lovers",
  },
  {
    title: "Beni Salah Mountain",
    subtitle: "Mountain Adventure",
    description: "Discover the rugged beauty of Beni Salah and panoramic mountain views.",
    highlight: "A hidden gem for explorers",
  },
  {
    title: "Bni Haroun",
    subtitle: "Historical Village",
    description: "Experience the local culture and history in the village of Bni Haroun.",
    highlight: "Authentic Algerian traditions and landscapes",
  },
  {
    title: "Chréa National Park",
    subtitle: "Wildlife & Nature",
    description: "Visit Chréa, a lush park home to wildlife and stunning alpine scenery.",
    highlight: "Ideal for family trips and nature photography",
  },
];

export default function GalleryWithStats() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [counts, setCounts] = useState(stats.map(() => 0));
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

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
      }, 20)
    );
    return () => timers.forEach(clearInterval);
  }, []);

  /* Auto-play slides */
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Smooth fade animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const slideVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const statItemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <section id="gallery" className="relative h-[90vh] overflow-hidden bg-black">
      {/* Background Slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${galleryImages[currentSlide]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Main Content Container */}
      <div className="relative z-10  mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
        {/* Stats Section - Appears first */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.2 }
            }
          }}
          className="mb-12 lg:mb-16"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={statItemVariants}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-white/10"
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div 
                    className="text-2xl lg:text-3xl font-bold text-white mb-1"
                    key={counts[index]}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    {counts[index].toLocaleString()}+
                  </motion.div>
                  <div className="text-sm lg:text-base text-white/70">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Gallery Section */}
        <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden w-full">
          {/* Navigation Buttons */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-start justify-between px-4 z-20  ">
            <button
              onClick={handlePrev}
              className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-200"
              aria-label="Previous slide"
            >
              <FaChevronLeft className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </button>

            <button
              onClick={handleNext}
              className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-200"
              aria-label="Next slide"
            >
              <FaChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </button>
          </div>

          {/* Slide Content */}
          <div className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center pb-6 lg:p-12">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={{
                  enter: (direction) => ({
                    opacity: 0,
                    x: direction > 0 ? 30 : -30,
                  }),
                  center: {
                    opacity: 1,
                    x: 0,
                  },
                  exit: (direction) => ({
                    opacity: 0,
                    x: direction < 0 ? 30 : -30,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="max-w-2xl"
              >
                {/* Badge */}
                <motion.span 
                  variants={fadeInUp}
                  className="inline-block mb-3 px-3 py-1 text-xs lg:text-sm rounded-full bg-emerald-500/20 text-emerald-300"
                >
                  {slideContent[currentSlide].subtitle}
                </motion.span>

                {/* Title */}
                <motion.h2 
                  variants={fadeInUp}
                  className="text-2xl lg:text-4xl font-bold text-white mb-3 lg:mb-4 leading-tight"
                >
                  {slideContent[currentSlide].title}
                </motion.h2>

                {/* Description */}
                <motion.p 
                  variants={fadeInUp}
                  className="text-white/80 text-sm lg:text-base mb-4 lg:mb-6 leading-relaxed"
                >
                  {slideContent[currentSlide].description}
                </motion.p>

                {/* Highlight */}
                <motion.div 
                  variants={fadeInUp}
                  className="flex items-center gap-2 text-emerald-300"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-sm lg:text-base font-medium">
                    {slideContent[currentSlide].highlight}
                  </span>
                </motion.div>

                {/* Explore Button */}
                <motion.button
                  variants={fadeInUp}
                  className="mt-6 lg:mt-8 bg-white text-gray-900 hover:bg-gray-100 font-medium px-6 lg:px-8 py-3 rounded-lg lg:rounded-xl transition-all duration-200 hover:scale-105"
                >
                  Explore Destination
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {galleryImages.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className="relative group"
                aria-label={`Go to slide ${i + 1}`}
              >
                <div className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${
                  i === currentSlide 
                    ? "bg-white scale-125" 
                    : "bg-white/40 hover:bg-white/60"
                }`} />
              </button>
            ))}
          </div>

          {/* Slide Counter */}
          <div className="absolute top-4 lg:top-6 right-4 lg:right-6 text-white/60 text-sm lg:text-base">
            <span className="text-white font-medium">{currentSlide + 1}</span>
            <span className="mx-1">/</span>
            <span>{galleryImages.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
}