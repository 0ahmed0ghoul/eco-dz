import { useEffect, useState, useRef } from "react";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Places() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const hoverTimeouts = useRef({});
  const [currentImages, setCurrentImages] = useState({});
  const [imageIndexes, setImageIndexes] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);

  // =======================
  // FETCH CATEGORIES
  // =======================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/places/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // =======================
  // CATEGORY COLORS
  // =======================
  const categoryColors = {
    desert: "from-amber-500 to-orange-600",
    forest: "from-emerald-500 to-green-600",
    mountain: "from-slate-600 to-gray-800",
    cave: "from-stone-600 to-neutral-800",
    lake: "from-blue-500 to-cyan-600",
    beach: "from-sky-500 to-blue-700",
    park: "from-green-400 to-green-700",
    waterfall: "from-cyan-400 to-blue-600",
  };
  const getColor = (category) =>
    categoryColors[category] || "from-gray-600 to-gray-800";

  // =======================
  // IMAGE CYCLING
  // =======================
  const handleMouseEnter = (category, images) => {
    if (!images || images.length <= 1) return;

    setHoveredCard(category);

    // Clear any existing timeout
    if (hoverTimeouts.current[category]) {
      clearTimeout(hoverTimeouts.current[category]);
      delete hoverTimeouts.current[category];
    }

    // Initialize index if undefined
    if (imageIndexes[category] === undefined) {
      setImageIndexes((prev) => ({ ...prev, [category]: 0 }));
      setCurrentImages((prev) => ({ ...prev, [category]: images[0] }));
    }

    const cycleImages = () => {
      if (!hoverTimeouts.current[category]) return;

      setImageIndexes((prev) => {
        const currentIndex = prev[category] || 0;
        const nextIndex = (currentIndex + 1) % images.length;

        setCurrentImages((prevImages) => ({
          ...prevImages,
          [category]: images[nextIndex],
        }));

        hoverTimeouts.current[category] = setTimeout(cycleImages, 1000);
        return { ...prev, [category]: nextIndex };
      });
    };

    hoverTimeouts.current[category] = setTimeout(cycleImages, 1000);
  };

  const handleMouseLeave = (category, images) => {
    setHoveredCard(null);

    if (hoverTimeouts.current[category]) {
      clearTimeout(hoverTimeouts.current[category]);
      delete hoverTimeouts.current[category];
    }

    if (images && images.length > 0) {
      setCurrentImages((prev) => ({ ...prev, [category]: images[0] }));
      setImageIndexes((prev) => ({ ...prev, [category]: 0 }));
    }
  };

  // =======================
  // INITIALIZE DEFAULT IMAGES
  // =======================
  useEffect(() => {
    if (categories.length > 0) {
      const defaultImages = {};
      const defaultIndexes = {};
      categories.forEach((cat) => {
        if (cat.images && cat.images.length > 0) {
          defaultImages[cat.category] = cat.images[0];
          defaultIndexes[cat.category] = 0;
        }
      });
      setCurrentImages(defaultImages);
      setImageIndexes(defaultIndexes);
    }
  }, [categories]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(hoverTimeouts.current).forEach(clearTimeout);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading categories...</p>
      </div>
    );
  }
  const goToGategoryPlaces = (category) => () => {
    window.location.href = `/places/${category}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-16">
                    {/* Breadcrumb */}
                    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-500">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="hover:text-gray-700">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/places" className="hover:text-gray-700">
              Places
            </Link>
          </li>
        </ol>
      </nav>
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Explore Natural Categories
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover Algeria's ecological places by category. Hover over cards
            to see images cycling.
          </p>
        </div>

        {/* CATEGORIES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const currentImage = currentImages[cat.category];
            const currentIndex = imageIndexes[cat.category] || 0;
            const hasImages = cat.images && cat.images.length > 0;
            const hasMultipleImages = cat.images && cat.images.length > 1;

            return (
              <div
                key={cat.category}
                className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-64"
                onMouseEnter={() => handleMouseEnter(cat.category, cat.images)}
                onMouseLeave={() => handleMouseLeave(cat.category, cat.images)}
              >
                {/* BACKGROUND GRADIENT */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getColor(
                    cat.category
                  )} transition-all duration-700 ease-in-out ${
                    currentImage ? "opacity-40" : "opacity-100"
                  }`}
                />

                {/* IMAGE */}
                {currentImage && (
                  <img
                    src={currentImage}
                    alt={cat.category}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
                    loading="lazy"
                  />
                )}

                {/* DARK OVERLAY */}
                <div
                  className={`absolute inset-0 ${
                    currentImage
                      ? "bg-black/50 group-hover:bg-black/60"
                      : "bg-black/20 group-hover:bg-black/30"
                  } transition-all duration-500`}
                />

                {/* CONTENT */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
                  <div>
                    <MapPin size={28} className="mb-4 opacity-90 drop-shadow-lg" />
                    <h2 className="text-2xl font-bold capitalize drop-shadow-lg">
                      {cat.category}
                    </h2>
                    {hasMultipleImages && (
                      <div className="mt-3 flex items-center space-x-1">
                        {cat.images.map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                              currentIndex === i
                                ? "bg-white scale-125"
                                : "bg-white/40"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm opacity-90 block">{cat.total} places</span>
                      {hasImages && (
                        <span className="text-xs opacity-70 block mt-1">
                          {cat.images.length} image{cat.images.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <button 
                    className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg text-sm font-medium hover:bg-white/30 transition hover:scale-105 transform"
                    onClick={goToGategoryPlaces(cat.category)}
                    >
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
