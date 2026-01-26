import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, MapPin, Clock, TrendingUp, Sparkles, Tag, Percent } from "lucide-react";

const tabs = [
  { id: "new", label: "New trips", icon: Sparkles },
  { id: "deals", label: "Deals", icon: TrendingUp }
];

export default function ExperienceGallery({ trips = [], deals = [] }) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  // Filter and prepare data based on active tab
  const displayItems = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    
    if (activeTab === "new") {
      return trips
        .filter(trip => new Date(trip.created_at) > thirtyDaysAgo)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map(trip => ({ ...trip, type: 'trip' }));
    }
    
    // Deals tab - return active deals
    return deals
      .filter(deal => {
        const endDate = new Date(deal.end_date);
        return endDate > new Date();
      })
      .sort((a, b) => b.discount_percentage - a.discount_percentage)
      .map(deal => ({ ...deal, type: 'deal' }));
  }, [trips, deals, activeTab]);

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Truncate text helper
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Calculate days helper
  const getDaysUntil = (dateString) => {
    return Math.ceil((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));
  };

  // Parse image helper
  const getImageUrl = (item) => {
    if (item.type === 'deal') {
      return item.image ? `http://localhost:5000/uploads/deals/${item.image}` : null;
    } else {
      try {
        const images = item.image ? JSON.parse(item.image) : [];
        return images.length > 0 ? `http://localhost:5000${images[0]}` : null;
      } catch {
        return null;
      }
    }
  };

  return (
    <section id="trips" className="py-20 px-4 md:px-8 bg-gradient-to-b from-white via-emerald-50/30 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 rounded-full text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Sustainable Adventures
          </div>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-700 bg-clip-text text-transparent mb-6">
            Only EcoDz Experiences
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Discover eco-friendly adventures that connect you with nature while preserving our beautiful planet.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex p-1.5 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const count = tab.id === 'new' ? trips.filter(t => getDaysUntil(t.created_at) <= 30).length : deals.length;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300
                    ${isActive 
                      ? 'text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-200' 
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/80'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                  <span>{tab.label}</span>
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-bold
                    ${isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'}
                  `}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards Grid */}
        {displayItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 mb-16">
            {displayItems.slice(0, 8).map((item, idx) => {
              const imageUrl = getImageUrl(item);
              const daysUntilStart = getDaysUntil(item.start_date);
              const isDeal = item.type === 'deal';
              const daysUntilDealEnd = isDeal ? getDaysUntil(item.end_date) : null;

              return (
                <article
                  key={`${item.type}-${item.id}-${idx}`}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`
                    group relative bg-white rounded-3xl overflow-hidden border-2
                    ${isDeal ? 'border-amber-200 shadow-lg shadow-amber-100' : 'border-gray-200'}
                    hover:shadow-2xl transition-all duration-500
                    hover:-translate-y-2 ${hoveredCard === idx ? 'ring-4 ring-emerald-100 ring-opacity-60' : ''}
                  `}
                >
                  {/* Deal Badge */}
                  {isDeal && (
                    <div className="absolute top-0 right-0 z-10">
                      <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white px-4 py-2 rounded-bl-2xl shadow-lg">
                        <div className="flex items-center gap-1.5">
                          <Percent className="w-4 h-4" />
                          <span className="font-bold text-lg">{item.discount_percentage}% OFF</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    {imageUrl ? (
                      <>
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-100 via-teal-100 to-blue-100 flex items-center justify-center">
                        <MapPin className="w-16 h-16 text-emerald-400 opacity-50" />
                      </div>
                    )}

                    {/* Category Badge */}
                    {item.category && (
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-2 bg-white/95 backdrop-blur-md text-gray-900 text-xs font-bold rounded-full shadow-lg capitalize">
                          {item.category}
                        </span>
                      </div>
                    )}

                    {/* Days Badge */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-4 py-2 bg-emerald-600/95 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-xl">
                          {daysUntilStart > 0 ? `Starts in ${daysUntilStart} days` : 'Starting soon'}
                        </span>
                        {isDeal && daysUntilDealEnd && (
                          <span className="px-4 py-2 bg-red-500/95 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-xl">
                            {daysUntilDealEnd} days left
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Organizer Info */}
                    <div className="flex items-center gap-3 mb-4">
                      {item.organizer_logo && (
                        <img 
                          src={`http://localhost:5000/uploads/avatars/${item.organizer_logo}`}
                          alt={item.organizer_name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-emerald-200"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.organizer_name}</p>
                        <p className="text-xs text-gray-500 truncate">{item.organizer_email}</p>
                      </div>
                    </div>

                    {/* Duration/Max People */}
                    <div className="flex items-center gap-2 text-sm text-emerald-700 font-semibold mb-3">
                      <Clock className="w-4 h-4" />
                      {isDeal ? (
                        <span>Limited time offer</span>
                      ) : (
                        <span>{item.duration} days • {item.max_people} people max</span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-tight">
                      {truncateText(item.title, 60)}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {truncateText(item.description, 100)}
                    </p>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-5 pb-5 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        <span className="font-medium">{formatDate(item.start_date)}</span>
                      </div>
                      {!isDeal && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Users className="w-4 h-4 text-emerald-500" />
                          <span className="font-medium">{item.max_people} spots</span>
                        </div>
                      )}
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div>
                        {isDeal ? (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg text-gray-400 line-through font-semibold">
                                {parseFloat(item.original_price).toLocaleString()} DZD
                              </span>
                            </div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                              {parseFloat(item.discounted_price).toLocaleString()} DZD
                            </div>
                          </>
                        ) : (
                          <div className="text-2xl font-bold text-gray-900">
                            {parseFloat(item.price).toLocaleString()} DZD
                          </div>
                        )}
                        <div className="text-xs text-gray-500 font-medium">per person</div>
                      </div>
                      <button
                        onClick={() => navigate(`/trips/${item.id}`)}
                        className={`
                          px-5 py-2.5 font-bold rounded-xl transition-all duration-300 active:scale-95 shadow-md
                          ${isDeal 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-xl hover:shadow-amber-200' 
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-xl hover:shadow-emerald-200'
                          }
                        `}
                      >
                        View Deal
                      </button>
                    </div>
                  </div>

                  {/* Hover Glow */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                    ${isDeal ? 'from-amber-500/10 to-transparent' : 'from-emerald-500/10 to-transparent'}
                  `} />
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Sparkles className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No {activeTab === 'new' ? 'New Trips' : 'Deals'} Available</h3>
            <p className="text-gray-600">Check back soon for exciting offers!</p>
          </div>
        )}

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-gradient-to-br from-white to-emerald-50 p-8 rounded-2xl border-2 border-emerald-100 text-center shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">{trips.length}+</div>
            <div className="text-gray-600 font-semibold">Eco Experiences</div>
          </div>
          <div className="bg-gradient-to-br from-white to-emerald-50 p-8 rounded-2xl border-2 border-emerald-100 text-center shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">100%</div>
            <div className="text-gray-600 font-semibold">Sustainable</div>
          </div>
          <div className="bg-gradient-to-br from-white to-emerald-50 p-8 rounded-2xl border-2 border-emerald-100 text-center shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">24/7</div>
            <div className="text-gray-600 font-semibold">Support</div>
          </div>
          <div className="bg-gradient-to-br from-white to-emerald-50 p-8 rounded-2xl border-2 border-emerald-100 text-center shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">4.9★</div>
            <div className="text-gray-600 font-semibold">Average Rating</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate("/trips")}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-emerald-300 transition-all duration-500 active:scale-95 text-lg"
          >
            Explore All Experiences
            <svg 
              className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <p className="text-gray-500 text-sm mt-5 font-medium">
            Join {trips.reduce((sum, trip) => sum + (trip.max_people || 0), 0).toLocaleString()}+ eco-adventurers worldwide
          </p>
        </div>
      </div>
    </section>
  );
}