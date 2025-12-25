import { useState } from "react";
import { monuments } from "../data/monuments";
import { Heart, MapPin, Star, Plus, Search, Grid3x3, List, ArrowUpDown, Clock, TrendingUp, DollarSign } from "lucide-react";

export default function Travels() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Relevance");
  const [activeRegion, setActiveRegion] = useState("all");
  const [compareList, setCompareList] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  const regions = [
    { id: "all", name: "All Regions", count: monuments.length },
    { id: "desert", name: "Sahara Desert", count: monuments.filter(m => m.region === "desert").length },
    { id: "mountains", name: "Atlas Mountains", count: monuments.filter(m => m.region === "mountains").length },
    { id: "coast", name: "Mediterranean Coast", count: monuments.filter(m => m.region === "coast").length },
    { id: "oasis", name: "Desert Oases", count: monuments.filter(m => m.region === "oasis").length },
    { id: "valleys", name: "Mountain Valleys", count: monuments.filter(m => m.region === "valleys").length },
    { id: "caves", name: "Ancient Caves", count: monuments.filter(m => m.region === "caves").length },
  ];

  // Color scheme
  const regionColors = {
    desert: "bg-amber-500",
    mountains: "bg-emerald-500",
    coast: "bg-blue-500",
    oasis: "bg-teal-500",
    valleys: "bg-purple-500",
    caves: "bg-stone-600",
  };

  // FILTER
  let filtered = monuments.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  if (activeRegion !== "all") {
    filtered = filtered.filter((t) => t.region === activeRegion);
  }

  // SORT
  if (sort === "Price: Low to High") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "Price: High to Low") filtered.sort((a, b) => b.price - a.price);
  else if (sort === "Duration: Short to Long") filtered.sort((a, b) => a.duration - b.duration);
  else if (sort === "Duration: Long to Short") filtered.sort((a, b) => b.duration - a.duration);
  else if (sort === "Rating") filtered.sort((a, b) => b.physicalRating - a.physicalRating);

  const toggleCompare = (id) => {
    setCompareList(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">

      <div className="max-w-7xl mx-auto px-4 py-8 -mt-4">
        {/* SEARCH */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="relative max-w-3xl mx-auto flex justify-between ">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-emerald-600" size={22} />
            <input
              type="text"
              placeholder="Search destinations, activities, or keywords..."
              className="w-full pl-14 pr-5 py-4 text-lg text-black border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-emerald-800" : "text-emerald-100 hover:bg-white/20"}`}
              >
                <Grid3x3 size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-emerald-800" : "text-emerald-100 hover:bg-white/20"}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
          
        </div>

        {/* REGIONS */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Explore Regions</h2>
            <span className="text-sm text-gray-500 font-medium">
              {monuments.length} total destinations
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {regions.map((region) => {
              const regionColor = region.id === "all" 
                ? "bg-gray-800" 
                : regionColors[region.id] || "bg-gray-600";
              
              return (
                <button
                  key={region.id}
                  onClick={() => setActiveRegion(region.id)}
                  className={`group relative px-5 py-3 rounded-xl font-medium transition-all duration-300 overflow-hidden ${
                    activeRegion === region.id
                      ? `${regionColor} text-white shadow-lg scale-105`
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102"
                  }`}
                >
                  <div className="flex items-center gap-2 relative z-10">
                    <span>{region.name}</span>
                    <span className={`text-sm px-2 py-0.5 rounded-full ${
                      activeRegion === region.id 
                        ? "bg-white/20" 
                        : "bg-gray-300"
                    }`}>
                      {region.count}
                    </span>
                  </div>
                  {activeRegion === region.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SORT & COMPARE */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
              <TrendingUp size={18} className="text-emerald-600" />
              <span className="text-gray-700 font-medium">Sort by:</span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 font-medium"
                >
                  <option>Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Duration: Short to Long</option>
                  <option>Duration: Long to Short</option>
                  <option>Rating</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-600 pointer-events-none" size={16} />
              </div>
            </div>
            
            {activeRegion !== "all" && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-100">
                <MapPin size={16} className="text-emerald-600" />
                <span className="text-emerald-800 font-medium capitalize">{activeRegion}</span>
                <span className="text-emerald-600 text-sm">({filtered.length})</span>
              </div>
            )}
          </div>

          {compareList.length > 0 && (
            <button className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl font-medium group">
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              Compare Selected ({compareList.length})
            </button>
          )}
        </div>

        {/* TRIPS GRID */}
        <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="max-w-md mx-auto">
                <Search size={64} className="mx-auto text-gray-300 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No trips found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or region filters</p>
                <button
                  onClick={() => { setSearch(""); setActiveRegion("all"); }}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          ) : (
            filtered.map((trip) => {
              const regionColor = regionColors[trip.region] || "bg-gray-600";
              const pricePerDay = Math.round(trip.price / trip.duration);
              
              return (
                <div
                  key={trip.id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 ${
                    viewMode === "list" ? "flex" : ""
                  } ${compareList.includes(trip.id) ? "ring-2 ring-emerald-500 ring-offset-2" : ""}`}
                >
                  {/* IMAGE */}
                  <div className={`relative overflow-hidden ${viewMode === "list" ? "w-80 h-64" : "h-64"}`}>
                    <img
                      src={trip.image}
                      alt={trip.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* GRADIENT OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                        <div>
                          <p className="text-sm font-medium opacity-90">${trip.price.toLocaleString()}</p>
                          <p className="text-2xl font-bold">Full Package</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium opacity-90">{trip.duration} days</p>
                          <p className="text-lg font-bold">${pricePerDay}/day</p>
                        </div>
                      </div>
                    </div>

                    {/* TOP BADGES */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <span className={`px-3 py-1.5 ${regionColor} text-white text-sm font-semibold rounded-full shadow-lg`}>
                        {trip.category.charAt(0).toUpperCase() + trip.category.slice(1)}
                      </span>
                      
                      <div className="flex gap-2">
                        <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors group/wish">
                          <Heart size={18} className="text-white group-hover/wish:fill-red-500 group-hover/wish:text-red-500 transition-colors" />
                        </button>
                      </div>
                    </div>

                    {/* PHYSICAL RATING OVERLAY */}
                    <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-xl px-3 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < Math.floor(trip.physicalRating) 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-400"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-white font-bold text-sm ml-1">{trip.physicalRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {trip.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{trip.description}</p>

                    {/* DETAILS */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          <DollarSign size={16} className="text-emerald-600" />
                          <span className="font-bold text-gray-900">${trip.price.toLocaleString()}</span>
                        </div>
                        <span className="text-xs text-gray-500">Total Price</span>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          <Clock size={16} className="text-emerald-600" />
                          <span className="font-bold text-gray-900">{trip.duration} days</span>
                        </div>
                        <span className="text-xs text-gray-500">Duration</span>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          <span className="font-bold text-gray-900">${pricePerDay}</span>
                        </div>
                        <span className="text-xs text-gray-500">Per Day</span>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-sm text-gray-500">Physical Level</p>
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full mx-0.5 ${
                                  i < Math.floor(trip.physicalRating)
                                    ? "bg-emerald-500"
                                    : "bg-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-700 ml-2">
                            {trip.physicalRating >= 4 ? "Challenging" : 
                             trip.physicalRating >= 3 ? "Moderate" : "Easy"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleCompare(trip.id)}
                        className={`px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow ${
                          compareList.includes(trip.id)
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                            : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700"
                        }`}
                      >
                        {compareList.includes(trip.id) ? (
                          <span className="flex items-center gap-2">
                            <span>✓ Added</span>
                          </span>
                        ) : (
                          "Add to Compare"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER STATS */}
        {filtered.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-700">{filtered.length}</div>
                <div className="text-gray-600">Trips Found</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-700">
                  ${Math.min(...filtered.map(t => t.price)).toLocaleString()}
                </div>
                <div className="text-gray-600">Lowest Price</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-700">
                  ${Math.max(...filtered.map(t => t.price)).toLocaleString()}
                </div>
                <div className="text-gray-600">Highest Price</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-700">
                  {Math.round(filtered.reduce((acc, t) => acc + t.duration, 0) / filtered.length)} days
                </div>
                <div className="text-gray-600">Avg. Duration</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}