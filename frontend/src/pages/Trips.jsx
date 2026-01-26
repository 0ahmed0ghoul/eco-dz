import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import backgroundImage from "/assets/background/2.jpg";
import {
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaCompass,
  FaFilter,
  FaSearch,
  FaMapMarkerAlt,
  FaChevronRight,
  FaTag
} from "react-icons/fa";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const navigate = useNavigate();
console.log(trips);
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

  const categories = useMemo(() => {
    const unique = new Set(trips.map((t) => t.category).filter(Boolean));
    return ["all", ...unique];
  }, [trips]);

  const filteredTrips = useMemo(() => {
    let filtered = trips.filter((trip) => {
      const matchesCategory = selectedCategory === "all" || trip.category === selectedCategory;
      const matchesSearch = 
        searchQuery === "" ||
        trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.organizer_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });

    switch (sortBy) {
      case "price_low": filtered.sort((a, b) => a.price - b.price); break;
      case "price_high": filtered.sort((a, b) => b.price - a.price); break;
      case "duration": filtered.sort((a, b) => a.duration - b.duration); break;
      default: filtered.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    }
    return filtered;
  }, [trips, selectedCategory, searchQuery, sortBy]);

  if (error) return <ErrorState error={error} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen font-sans text-slate-900"
    >
      {/* Dynamic Background Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Hero Header */}
      <header className="relative pt-12 pb-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm font-medium text-emerald-600 mb-4 bg-emerald-50 w-fit px-3 py-1 rounded-full">
            <Link to="/" className="hover:underline">Home</Link>
            <FaChevronRight className="text-[10px] opacity-50" />
            <span className="text-emerald-900">Trips</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
                Find Your <span className="text-emerald-600 underline decoration-emerald-200">Escape</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-xl">
                Curated eco-friendly adventures led by local experts across the Saharan and Coastal landscapes.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
               <div className="h-12 w-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  <FaCompass size={24} />
               </div>
               <div className="pr-4">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Experiences</p>
                  <p className="text-2xl font-black text-slate-800">{filteredTrips.length}</p>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters Sticky Bar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-y border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative w-full lg:w-1/3 group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Search destinations or agencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-100/50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            <div className="flex bg-slate-100 p-1 rounded-xl">
               {categories.map((cat) => (
                <motion.button
                  key={cat}
                  layout
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {cat === "all" ? "Explore All" : cat}
                </motion.button>
              ))}
            </div>
            <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden lg:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-slate-600 focus:ring-0 cursor-pointer"
            >
              <option value="date">Latest Dates</option>
              <option value="price_low">Budget Friendly</option>
              <option value="price_high">Luxury First</option>
              <option value="duration">By Duration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {[...Array(8)].map((_, i) => (
              <SkeletonTrip key={i} />
            ))}
          </motion.div>
        ) : filteredTrips.length > 0 ? (
          <AnimatePresence mode="popLayout">
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} navigate={navigate} />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <EmptyState onClear={() => {
            setSearchQuery("");
            setSelectedCategory("all");
          }} />
        )}
      </main>
    </motion.div>
  );
}

function TripCard({ trip, navigate }) {
  const [imgIdx, setImgIdx] = useState(0);

  const images = useMemo(() => {
    try {
      const raw = typeof trip.image === "string" ? JSON.parse(trip.image) : trip.image || [];
      return raw.map(img => img.startsWith("http") ? img : `http://localhost:5000${img}`);
    } catch { return []; }
  }, [trip.image]);

  useEffect(() => {
    if (images.length < 2) return;
    const itv = setInterval(() => setImgIdx(p => (p + 1) % images.length), 5000);
    return () => clearInterval(itv);
  }, [images.length]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      whileHover={{ 
        y: -10,
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      transition={{ 
        duration: 0.3,
        ease: "easeInOut",
        layout: { duration: 0.3 }
      }}
      className="group bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-slate-100 relative"
    >
      {/* Price Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-sm border border-white/50"
      >
        <p className="text-emerald-700 font-black text-sm flex items-center gap-1">
          <FaTag className="text-[10px]" />
          ${trip.price || '85'}
        </p>
      </motion.div>

      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <motion.img
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
          src={images[imgIdx]}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
        
        {/* Category Label */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="absolute bottom-4 left-4"
        >
           <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">
              {trip.category || 'Adventure'}
           </span>
        </motion.div>
      </div>

      {/* Body */}
      <div className="p-6">
        <h3 className="text-xl font-extrabold text-slate-800 line-clamp-1 mb-2 group-hover:text-emerald-600 transition-colors">
          {trip.title}
        </h3>
        
        <div className="flex items-center gap-4 mb-4 text-slate-500">
           <div className="flex items-center gap-1.5 text-xs font-semibold">
              <FaCalendarAlt className="text-emerald-500" />
              {trip.duration} Days
           </div>
           <div className="flex items-center gap-1.5 text-xs font-semibold">
              <FaUsers className="text-emerald-500" />
              {trip.max_people || 12} Max
           </div>
        </div>

        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6">
          {trip.description}
        </p>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              src={`http://localhost:5000/uploads/avatars/${trip.organizer_logo}`}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-50"
              onError={(e) => e.currentTarget.src = "https://ui-avatars.com/api/?name=" + trip.organizer_name}
            />
            <span className="text-xs font-bold text-slate-700">{trip.organizer_name}</span>
          </div>
          
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            onClick={() => navigate(`/trips/${trip.id}`)}
            className="p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.1 }}
          >
            <FaChevronRight size={12} />
          </motion.button>
        </div>
      </div>

      {/* Clickable Overlay */}
      <button
        onClick={() => navigate(`/trips/${trip.id}`)}
        className="absolute inset-0 w-full h-full focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-3xl"
        aria-label={`View trip details for ${trip.title}`}
      />
    </motion.div>
  );
}

function EmptyState({ onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-200"
    >
      <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
         <FaCompass size={40} className="text-slate-300" />
      </div>
      <h3 className="text-2xl font-black text-slate-800">No trips match your vibe</h3>
      <p className="text-slate-500 mt-2 mb-8">Try adjusting your filters or search terms.</p>
      <motion.button 
        onClick={onClear}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:scale-105 transition-transform"
      >
        Clear all filters
      </motion.button>
    </motion.div>
  );
}

function ErrorState({ error }) {
    return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex items-center justify-center bg-white p-6"
        >
            <div className="text-center">
                <div className="text-6xl mb-4">🏜️</div>
                <h2 className="text-2xl font-black text-slate-900">Connection Lost</h2>
                <p className="text-slate-500 mt-2 mb-6">{error}</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.reload()} 
                  className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold"
                >
                  Try Again
                </motion.button>
            </div>
        </motion.div>
    );
}

function SkeletonTrip() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 animate-pulse"
    >
      <div className="h-64 bg-slate-200" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
        <div className="h-4 bg-slate-100 rounded-lg w-full" />
        <div className="flex gap-2">
          <div className="h-4 bg-slate-100 rounded-lg w-16" />
          <div className="h-4 bg-slate-100 rounded-lg w-16" />
        </div>
      </div>
    </motion.div>
  );
}