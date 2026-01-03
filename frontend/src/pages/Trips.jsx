import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import backgroundImage from "/assets/background/2.jpg";

import {
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

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
      <div className="p-8 text-red-600 text-center font-medium">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen  bg-center bg-no-repeat bg-cover bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      >
      {/* ================= Header / Breadcrumb ================= */}
      <div className=" border-b bg-linear-to-b from-white/10 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4">
            <ol className="flex items-center gap-2">
              <li>
                <Link to="/" className="hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="font-medium text-gray-700 capitalize">
                Trips
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-800">
            Available Trips
          </h1>

          <p className="mt-2 max-w-2xl text-gray-600">
            Discover unforgettable trips organized by trusted agencies and local experts
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
      <div className="max-w-7xl mx-auto px-4 pb-20 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonTrip key={i} />
            ))}

          <AnimatePresence>
            {!loading &&
              filteredTrips.map((trip) => (
                <motion.div
                  key={trip.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") navigate(`/trips/${trip.id}`);
                  }}
                  role="button"
                  tabIndex={0}
                  className="
                    bg-white rounded-2xl shadow-md overflow-hidden
                    hover:shadow-xl hover:-translate-y-1
                    transition cursor-pointer focus:outline-none
                    focus:ring-2 focus:ring-emerald-500
                  "
                >
                  <div className="p-6 space-y-4">
                    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 capitalize">
                      {trip.category}
                    </span>

                    <h2 className="text-xl font-bold text-emerald-800 line-clamp-1">
                      {trip.title}
                    </h2>

                    <p className="text-gray-600 text-sm line-clamp-3">
                      {trip.description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <FaCalendarAlt />
                        {trip.start_date} → {trip.end_date}
                      </p>

                      <p className="flex items-center gap-2">
                        <FaClock />
                        {trip.duration} days
                      </p>

                      <p className="flex items-center gap-2">
                        <FaMoneyBillWave />
                        {trip.price} DZD
                      </p>

                      {trip.max_people && (
                        <p className="flex items-center gap-2">
                          <FaUsers />
                          Max {trip.max_people} people
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t text-sm">
                      <p className="font-medium text-gray-800">
                        Organizer: {trip.organizer_name}
                      </p>
                      <p className="text-gray-500">
                        {trip.organizer_email}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        {!loading && filteredTrips.length === 0 && (
          <div className="text-center mt-20">
            <h3 className="text-2xl font-bold text-emerald-700 mb-2">
              No trips found 🧭
            </h3>
            <p className="text-gray-500">
              Try another category to explore more adventures.
            </p>
          </div>
        )}
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
