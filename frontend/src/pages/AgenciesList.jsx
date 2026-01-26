import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaStar, 
  FaMapMarkerAlt, 
  FaCheckCircle,
  FaFire,
  FaUsers,
  FaCalendarAlt,
  FaHeart,
  FaRegHeart
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AgenciesList = () => {
  const [agencies, setAgencies] = useState([]);
  const [filteredAgencies, setFilteredAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    verifiedOnly: false,
    minRating: 0,
    location: ''
  });
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    fetchAgencies();
  }, []);

  useEffect(() => {
    filterAndSortAgencies();
  }, [agencies, searchTerm, filters, sortBy]);

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/agencies');
      const data = await res.json();
      setAgencies(data.agencies || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortAgencies = () => {
    let result = [...agencies];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(agency =>
        agency.username.toLowerCase().includes(term) ||
        agency.description?.toLowerCase().includes(term) ||
        agency.address?.toLowerCase().includes(term)
      );
    }

    // Apply filters
    if (filters.verifiedOnly) {
      result = result.filter(agency => agency.verified);
    }

    if (filters.minRating > 0) {
      result = result.filter(agency => agency.avgRating >= filters.minRating);
    }

    if (filters.location) {
      result = result.filter(agency => 
        agency.address?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch(sortBy) {
        case 'rating':
          return (b.avgRating || 0) - (a.avgRating || 0);
        case 'trips':
          return (b.tripCount || 0) - (a.tripCount || 0);
        case 'followers':
          return (b.followerCount || 0) - (a.followerCount || 0);
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return 0;
      }
    });

    setFilteredAgencies(result);
  };

  const handleFollow = async (agencyId, isFollowing) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      await fetch(`http://localhost:5000/api/agencies/${agencyId}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setAgencies(prev => prev.map(agency => {
        if (agency.id === agencyId) {
          return {
            ...agency,
            isFollowing: !isFollowing,
            followerCount: isFollowing 
              ? (agency.followerCount || 1) - 1 
              : (agency.followerCount || 0) + 1
          };
        }
        return agency;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Travel Agencies</h1>
          <p className="text-gray-600">Discover trusted travel agencies for your next adventure</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search agencies by name, location, or specialty..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Highest Rated</option>
                <option value="trips">Most Trips</option>
                <option value="followers">Most Followers</option>
                <option value="newest">Newest</option>
              </select>

              <button
                onClick={() => setFilters(prev => ({ ...prev, verifiedOnly: !prev.verifiedOnly }))}
                className={`px-4 py-3 rounded-xl border flex items-center gap-2 ${
                  filters.verifiedOnly 
                    ? 'bg-blue-50 border-blue-300 text-blue-700' 
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                <FaCheckCircle />
                Verified Only
              </button>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Minimum Rating</label>
            <div className="flex gap-2">
              {[0, 3, 3.5, 4, 4.5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                  className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
                    filters.minRating === rating
                      ? 'bg-amber-100 text-amber-700 border border-amber-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <FaStar className="text-amber-500" />
                  {rating === 0 ? 'Any' : rating}+
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Agencies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgencies.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No agencies found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredAgencies.map(agency => (
              <div key={agency.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                {/* Agency Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-xl border-2 border-white shadow-md overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500">
                          {agency.avatar ? (
                            <img
                              src={`http://localhost:5000/uploads/avatars/${agency.avatar}`}
                              alt={agency.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                              {agency.username?.charAt(0)}
                            </div>
                          )}
                        </div>
                        {agency.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white p-1 rounded-full">
                            <FaCheckCircle className="text-xs" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{agency.username}</h3>
                        {agency.address && (
                          <p className="text-gray-600 text-sm flex items-center gap-1">
                            <FaMapMarkerAlt />
                            {agency.address.split(',')[0]}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollow(agency.id, agency.isFollowing)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      {agency.isFollowing ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {agency.description || 'No description provided.'}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">{agency.tripCount || 0}</div>
                      <div className="text-xs text-gray-500">Trips</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">{agency.followerCount || 0}</div>
                      <div className="text-xs text-gray-500">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">{agency.avgRating || 'N/A'}</div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`${
                            i < Math.floor(agency.avgRating || 0)
                              ? 'text-amber-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({agency.reviewCount || 0} reviews)</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/agency/${agency.id}`}
                      className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium text-sm"
                    >
                      View Profile
                    </Link>
                    <Link
                      to={`/trips?agency=${agency.id}`}
                      className="flex-1 text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm"
                    >
                      View Trips
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Featured Agencies */}
        {agencies.filter(a => a.featured).length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaFire className="text-orange-500" />
              Featured Agencies
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {agencies.filter(a => a.featured).slice(0, 2).map(agency => (
                <div key={agency.id} className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-20 h-20 rounded-xl border-4 border-white/30 overflow-hidden">
                        {agency.avatar ? (
                          <img
                            src={`http://localhost:5000/uploads/avatars/${agency.avatar}`}
                            alt={agency.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-2xl font-bold">{agency.username?.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{agency.username}</h3>
                        <p className="text-blue-200">{agency.specialty || 'Premium Travel Agency'}</p>
                      </div>
                    </div>
                    <p className="text-blue-100 mb-6 line-clamp-2">{agency.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <FaStar className="text-amber-400" />
                          <span className="font-bold">{agency.avgRating || '4.9'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaUsers />
                          <span>{agency.followerCount || 0} followers</span>
                        </div>
                      </div>
                      <Link
                        to={`/agency/${agency.id}`}
                        className="px-6 py-2 bg-white text-blue-900 rounded-lg font-bold hover:bg-blue-50"
                      >
                        Explore
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgenciesList;