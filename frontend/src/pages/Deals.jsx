import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaMapMarkerAlt, 
  FaTag, 
  FaCalendarAlt, 
  FaFire, 
  FaClock,
  FaLeaf,
  FaPercent,
  FaSearch,
  FaFilter,
  FaCompass,
  FaSortAmountDown,
  FaSortAmountUp,
  FaChevronRight
} from "react-icons/fa";
import backgroundImage from "/assets/background/3.jpg";

export default function DealsPage() {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("discount");
  const [categories, setCategories] = useState(["all"]);
console.log(deals);
  /* ================= Fetch Deals ================= */
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/deals");
        if (!res.ok) throw new Error("Failed to fetch deals");
        const data = await res.json();
        const dealsList = data.deals || [];
        setDeals(dealsList);

        // Extract unique categories
        const uniqueCategories = [
          "all",
          ...Array.from(
            new Set(dealsList.map((deal) => deal.category).filter(Boolean))
          ),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  /* ================= Filter & Sort Logic ================= */
  const filteredDeals = useMemo(() => {
    let filtered = deals.filter((deal) => {
      const matchesCategory = activeCategory === "all" || deal.category === activeCategory;
      const matchesSearch = 
        searchQuery === "" ||
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.organizer_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });

    // Sorting logic
    switch (sortBy) {
      case "discount":
        filtered.sort((a, b) => (b.discount_percentage || 0) - (a.discount_percentage || 0));
        break;
      case "price_low":
        filtered.sort((a, b) => a.discounted_price - b.discounted_price);
        break;
      case "price_high":
        filtered.sort((a, b) => b.discounted_price - a.discounted_price);
        break;
      case "date":
        filtered.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        break;
      default:
        filtered.sort((a, b) => (b.discount_percentage || 0) - (a.discount_percentage || 0));
    }

    return filtered;
  }, [deals, activeCategory, searchQuery, sortBy]);

  /* ================= Utility Functions ================= */
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      year: "numeric" 
    });
  };

  const calculateSavings = (original, discounted) => {
    return original - discounted;
  };

  /* ================= Error State ================= */
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center p-8 font-sans"
      >
        <div className="text-center max-w-md p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <FaFire className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Oops!</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-linear-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-full hover:from-emerald-700 hover:to-emerald-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen "
    >
      {/* Enhanced Background with Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-fixed -z-10"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
      </div>

      {/* ================= Enhanced Header ================= */}
      <div className="relative border-b border-emerald-100 bg-linear-to-b from-white/95 to-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav className="flex items-center gap-2 text-sm font-medium text-emerald-600 mb-4 bg-emerald-50 w-fit px-3 py-1 rounded-full">
            <Link to="/" className="hover:underline">Home</Link>
            <FaChevronRight className="text-[10px] opacity-50" />
            <span className="text-emerald-900">Deals</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent">
                Hot Eco Deals
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-gray-600">
                Exclusive sustainable adventures at discounted prices. Support local communities while saving big!
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-linear-to-r from-amber-100 to-amber-50 rounded-lg">
                  <FaFire className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Deals</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {filteredDeals.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Enhanced Controls Bar ================= */}
      <div className="sticky top-0 z-20 bg-linear-to-b from-white/95 to-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full lg:w-96">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search deals, destinations, organizers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
              >
                <option value="discount">
                  <FaSortAmountDown className="inline mr-2" />
                  Highest Discount
                </option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="date">Starting Soon</option>
              </select>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                      ${
                        activeCategory === cat
                          ? "bg-linear-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-200"
                          : "bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200"
                      }`}
                  >
                    {cat === "all" ? "All Deals" : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Deals Grid ================= */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredDeals.length > 0 ? (
          <AnimatePresence mode="popLayout">
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredDeals.map((deal) => (
                <DealCard 
                  key={deal.id} 
                  deal={deal} 
                  navigate={navigate}
                  formatDate={formatDate}
                  calculateSavings={calculateSavings}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <EmptyState 
            searchQuery={searchQuery}
            activeCategory={activeCategory}
            onClearFilters={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

/* ================= Enhanced Deal Card ================= */
function DealCard({ deal, navigate, formatDate, calculateSavings }) {
  const savings = deal.original_price 
    ? calculateSavings(deal.original_price, deal.discounted_price)
    : 0;
  
  const discountPercentage = deal.discount_percentage 
    ? Math.round(deal.discount_percentage)
    : deal.original_price 
      ? Math.round((savings / deal.original_price) * 100)
      : 0;

  const startDate = new Date(deal.start_date);
  const endDate = new Date(deal.end_date);
  const isUpcoming = startDate > new Date();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      transition={{ 
        duration: 0.3, 
        ease: "easeInOut",
        layout: { duration: 0.3 }
      }}
      onClick={() => navigate(`/deals/${deal.id}`)}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-emerald-100 overflow-hidden cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        {deal.image ? (
          <motion.img
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
            src={`http://localhost:5000/uploads/deals/${deal.image}`}
            alt={deal.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
            <FaLeaf className="w-12 h-12 text-emerald-400" />
          </div>
        )}
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute top-4 right-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-red-500 to-red-600 rounded-full blur-md" />
              <div className="relative px-4 py-2 bg-linear-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg">
                <div className="flex items-center gap-1">
                  <FaPercent className="w-3 h-3" />
                  <span className="text-lg font-bold">{discountPercentage}% OFF</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-sm text-emerald-700 border border-emerald-200 shadow-sm capitalize">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2" />
            {deal.category}
          </span>
        </div>

        {/* Time Badge */}
        {isUpcoming && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="absolute bottom-4 left-4"
          >
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-sm text-amber-700 border border-amber-200 shadow-sm">
              <FaClock className="w-3 h-3 mr-1" />
              Upcoming
            </span>
          </motion.div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {deal.title}
          </h3>
          <p className="mt-2 text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {deal.description}
          </p>
        </div>

        {/* Deal Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <FaCalendarAlt className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">
                {formatDate(deal.start_date)}
                {" → "}
                {formatDate(deal.end_date)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FaMapMarkerAlt className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">{deal.organizer_name}</span>
            </div>
          </div>

          {/* Savings Badge */}
          {savings > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm"
            >
              <FaTag className="w-3 h-3 mr-2" />
              Save {savings.toLocaleString()} DZD
            </motion.div>
          )}
        </div>

        {/* Price Section */}
        <div className="pt-4 border-t border-emerald-50">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold bg-linear-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent">
                  {deal.discounted_price?.toLocaleString()} DZD
                </span>
                {deal.original_price && (
                  <span className="text-sm line-through text-gray-400">
                    {deal.original_price.toLocaleString()} DZD
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Per person • All inclusive</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Clickable Overlay */}
      <button
        onClick={() => navigate(`/deals/${deal.id}`)}
        className="absolute inset-0 w-full h-full focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-2xl"
        aria-label={`View deal details for ${deal.title}`}
      />
    </motion.article>
  );
}

/* ================= Enhanced Empty State ================= */
function EmptyState({ searchQuery, activeCategory, onClearFilters }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center py-16"
    >
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-linear-to-br from-amber-100 to-amber-50 flex items-center justify-center">
          <FaFire className="w-12 h-12 text-amber-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {searchQuery ? "No matching deals found" : "No active deals"}
        </h3>
        <p className="text-gray-600 mb-8">
          {searchQuery 
            ? `We couldn't find any deals matching "${searchQuery}". Try different keywords.`
            : activeCategory !== "all"
            ? `No deals available in the ${activeCategory} category.`
            : "All current deals have been claimed! Check back soon for new eco-friendly offers."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-full hover:from-emerald-700 hover:to-emerald-800 transition-colors shadow-lg shadow-emerald-200"
          >
            <FaFilter />
            Clear Filters
          </button>
          <Link
            to="/trips"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 font-semibold rounded-full hover:bg-emerald-50 transition-colors border border-emerald-200"
          >
            <FaCompass />
            Browse All Trips
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ================= Enhanced Skeleton ================= */
function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden animate-pulse"
    >
      <div className="h-56 bg-linear-to-r from-emerald-100 to-emerald-50" />
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="h-5 bg-emerald-100 rounded w-3/4" />
          <div className="h-4 bg-emerald-100 rounded w-full" />
          <div className="h-4 bg-emerald-100 rounded w-5/6" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-emerald-100 rounded w-20" />
          <div className="h-4 bg-emerald-100 rounded w-16" />
        </div>
        <div className="space-y-2 pt-4 border-t border-emerald-50">
          <div className="h-6 bg-emerald-100 rounded w-1/2" />
          <div className="h-4 bg-emerald-100 rounded w-1/4" />
        </div>
      </div>
    </motion.div>
  );
}