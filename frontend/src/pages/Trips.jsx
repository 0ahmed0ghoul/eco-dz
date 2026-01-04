import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import backgroundImage from "/assets/background/2.jpg";

import {
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaMoneyBillWave,
  FaArrowRight,
  FaCompass,
  FaFilter,
} from "react-icons/fa";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  /* ================= Fetch Trips ================= */
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/trips");
        if (!res.ok) throw new Error("Failed to fetch trips");
        const data = await res.json();
        setTrips(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  /* ================= Categories ================= */
  const categories = useMemo(() => {
    const unique = new Set(trips.map((t) => t.category).filter(Boolean));
    return ["all", ...unique];
  }, [trips]);

  const filteredTrips = useMemo(() => {
    if (selectedCategory === "all") return trips;
    return trips.filter((t) => t.category === selectedCategory);
  }, [trips, selectedCategory]);

  /* ================= Error ================= */
  if (error) {
    return (
      <div className="p-8 text-red-600 text-center font-medium">{error}</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-center bg-no-repeat bg-cover bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* ================= Header / Breadcrumb ================= */}
      <div className="border-b bg-linear-to-b from-white/10 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4">
            <ol className="flex items-center gap-2">
              <li>
                <Link to="/" className="hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="font-medium text-gray-700 capitalize">Trips</li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-800">
            Available Trips
          </h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            Discover unforgettable trips organized by trusted agencies and local
            experts
          </p>

          <div className="mt-4 text-lg font-semibold text-emerald-700">
            {filteredTrips.length} Trips Available
          </div>
        </div>
      </div>

      {/* ================= Floating Category Bar ================= */}
      <div className="sticky top-2 z-20 px-4 mt-4">
        <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg px-3 py-2 flex gap-2 overflow-x-auto no-scrollbar max-w-7xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-sm rounded-full capitalize whitespace-nowrap transition
                ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
            >
              {cat === "all" ? "All Trips" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* ================= Trips Grid ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonTrip key={i} />)
            : filteredTrips.length > 0 && (
                <AnimatePresence mode="wait">
                  {filteredTrips.map((trip) => (
                    <motion.article
                      key={trip.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden
                      border border-gray-100 hover:shadow-2xl hover:border-emerald-100
                      transition-all duration-300 cursor-pointer
                      focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2
                      focus:outline-none"
                    >
                      {/* Trip Image/Logo */}
                      <div className="relative h-48 bg-linear-to-br from-emerald-50 to-cyan-50 overflow-hidden flex items-center justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 bg-linear-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-xl" />
                          <img
                            src={`http://localhost:5000/assets/reviews/${trip.organizer_logo}`}
                            alt={`${trip.organizer_name} logo`}
                            className="relative w-32 h-32 object-contain rounded-full shadow-2xl border-4 border-white z-10 "
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/128?text=🌿";
                              e.currentTarget.alt = "Default organizer logo";
                            }}
                          />
                        </div>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-sm text-emerald-700 border border-emerald-100 shadow-sm capitalize">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2" />
                          {trip.category}
                        </span>
                      </div>

                      {/* Price Tag */}
                      <div className="absolute top-4 right-4 z-20">
                        <div className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm">
                          <span className="text-lg font-bold text-emerald-700">
                            {trip.price.toLocaleString()} DZD
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            per person
                          </span>
                        </div>
                      </div>

                      {/* Trip Content */}
                      <div className="p-6 space-y-5">
                        <header>
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                            {trip.title}
                          </h3>
                          <p className="mt-2 text-gray-600 text-sm line-clamp-3 leading-relaxed">
                            {trip.description}
                          </p>
                        </header>

                        <div className="space-y-4">
                          {/* Dates */}
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded-lg flex-1">
                              <FaCalendarAlt className="w-4 h-4 text-emerald-600" />
                              <span className="font-medium">
                                {new Date(trip.start_date).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" }
                                )}
                              </span>
                              <span className="text-gray-400">→</span>
                              <span className="font-medium">
                                {new Date(trip.end_date).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" }
                                )}
                              </span>
                            </div>

                            {/* Duration */}
                            <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                              <FaClock className="w-4 h-4 text-emerald-600" />
                              <span className="font-medium">{trip.duration}</span>
                              <span className="text-gray-500 text-xs">days</span>
                            </div>
                          </div>

                          {/* Capacity */}
                          {trip.max_people && (
                            <div className="flex items-center gap-2 text-sm">
                              <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                                <FaUsers className="w-4 h-4 text-emerald-600" />
                                <span className="font-medium">{trip.max_people}</span>
                                <span className="text-gray-500">max</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Organizer Info */}
                        <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {trip.organizer_name}
                            </p>
                            <p className="text-gray-500 text-sm truncate">
                              {trip.organizer_email}
                            </p>
                          </div>
                          <FaArrowRight className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Clickable Overlay */}
                        <button
                          onClick={() => navigate(`/trips/${trip.id}`)}
                          className="absolute inset-0 w-full h-full focus:outline-none"
                          aria-label={`View details for ${trip.title}`}
                        />
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              )}

          {/* Empty State */}
          {!loading && filteredTrips.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 flex items-center justify-center">
                  <FaCompass className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No adventures found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters to discover amazing eco-friendly trips
                  in Algeria.
                </p>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <FaFilter />
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ================= Skeleton Loader ================= */
function SkeletonTrip() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-4 animate-pulse">
      <div className="h-5 w-24 bg-gray-200 rounded-full" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-5/6" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mt-4" />
    </div>
  );
}
