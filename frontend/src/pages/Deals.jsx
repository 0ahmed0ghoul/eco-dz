import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaTag,
  FaCalendarAlt,
} from "react-icons/fa";
import backgroundImage from "/assets/background/3.jpg";

const categories = ["all", "desert", "mountain", "sea", "city"];

export default function EcoAdventuresPage() {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/deals");
        const data = await res.json();
        setDeals(data.deals || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const filteredDeals =
    activeCategory === "all"
      ? deals
      : deals.filter((d) => d.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen  bg-center bg-no-repeat bg-cover bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* ================= Breadcrumb + Hero (UNCHANGED) ================= */}
      <div className=" border-b bg-linear-to-b from-white/10 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-4">
            <ol className="flex items-center gap-2">
              <li>
                <Link to="/" className="hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-700 font-medium">
                Deals
              </li>
            </ol>
          </nav>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-800">
            Sustainable Adventures
          </h1>

          {/* Description */}
          <p className="mt-2 max-w-2xl text-gray-600">
            Explore eco-friendly tours that connect you with nature while
            supporting local communities
          </p>

          {/* Count */}
          <div className="mt-4 text-lg font-semibold text-emerald-700">
            {filteredDeals.length} Available Tours
          </div>
        </div>
      </div>

      {/* ================= Floating Category Bar ================= */}
      <div className="sticky top-2 z-20 px-4 mt-4">
        <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg px-3 py-2 flex gap-2 overflow-x-auto no-scrollbar max-w-7xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-sm rounded-full capitalize whitespace-nowrap transition
                ${
                  activeCategory === cat
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ================= Deals Grid ================= */}
      <div className="max-w-7xl mx-auto px-4 pb-20 mt-8 py-5 flex justify-center items-center bg-white/20 backdrop-blur-md rounded-xl shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}

          <AnimatePresence>
            {!loading &&
              filteredDeals.map((deal) => (
                <motion.div
                  key={deal.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => navigate(`/deals/${deal.id}`)}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl cursor-pointer overflow-hidden transition"
                >
                  {/* Image */}
                  <div className="relative h-48">
                    <img
                      src={`/assets/deals/${deal.image}`}
                      alt={deal.title}
                      className="w-full h-full object-cover"
                    />

                    {deal.discount_percentage && (
                      <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        -{deal.discount_percentage}%
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-emerald-800 line-clamp-1">
                      {deal.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {deal.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaMapMarkerAlt />
                      {deal.organizer_name}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCalendarAlt />
                      {deal.start_date} → {deal.end_date}
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-center gap-2">
                        <FaTag className="text-emerald-600" />
                        <span className="text-xl font-bold text-emerald-700">
                          {deal.discounted_price} DZD
                        </span>
                        {deal.original_price && (
                          <span className="text-sm line-through text-gray-400">
                            {deal.original_price} DZD
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-semibold text-emerald-600 capitalize">
                        {deal.category}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {!loading && filteredDeals.length === 0 && (
          <div className="text-center mt-20">
            <h3 className="text-2xl font-bold text-emerald-700 mb-2">
              No eco-adventures here 🌱
            </h3>
            <p className="text-gray-500">
              Try another category or come back later.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ================= Skeleton Loader ================= */

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-5 bg-gray-200 rounded w-1/2 mt-4" />
      </div>
    </div>
  );
}
