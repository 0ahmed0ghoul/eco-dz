import React, { useState, useEffect } from 'react';
import { FiMapPin, FiClock, FiUsers, FiStar, FiHeart, FiShare2 } from 'react-icons/fi';

export default function TripsList() {
  const [trips, setTrips] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchTrips();
    if (token) {
      fetchFavorites();
    }
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/agency/trips');
      const data = await response.json();
      setTrips(data);
    } catch (err) {
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/agency/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setFavorites(data.map(f => f.agencyId));
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const toggleFavorite = async (agencyId) => {
    if (!token) {
      alert('Please login to add favorites');
      return;
    }

    try {
      if (favorites.includes(agencyId)) {
        await fetch(`http://localhost:5000/api/agency/favorites/${agencyId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setFavorites(favorites.filter(id => id !== agencyId));
      } else {
        await fetch('http://localhost:5000/api/agency/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ agencyId })
        });
        setFavorites([...favorites, agencyId]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading trips...</div>;
  }

  const filteredTrips = filter === 'all' ? trips : trips.filter(trip => {
    if (filter === 'favorites') {
      return favorites.includes(trip.agencyId);
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Explore Adventures</h2>
        
        <div className="flex space-x-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Trips
          </button>
          {token && (
            <button
              onClick={() => setFilter('favorites')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                filter === 'favorites'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FiHeart className="w-5 h-5" />
              <span>My Favorites</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Trip Image */}
            <div className="relative h-48 overflow-hidden bg-gray-200">
              <img
                src={trip.image}
                alt={trip.title}
                className="w-full h-full object-cover hover:scale-110 transition-transform"
              />
              <button
                onClick={() => toggleFavorite(trip.agencyId)}
                className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                  favorites.includes(trip.agencyId)
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiHeart className={`w-5 h-5 ${favorites.includes(trip.agencyId) ? 'fill-current' : ''}`} />
              </button>

              <div className="absolute top-3 left-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                ${trip.price}
              </div>
            </div>

            {/* Trip Details */}
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-1">{trip.agencyName}</p>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{trip.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{trip.description}</p>

              {/* Trip Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-700 text-sm">
                  <FiMapPin className="w-4 h-4 mr-2 text-emerald-600" />
                  {trip.destination}
                </div>
                <div className="flex items-center text-gray-700 text-sm">
                  <FiClock className="w-4 h-4 mr-2 text-emerald-600" />
                  {trip.duration}
                </div>
                <div className="flex items-center text-gray-700 text-sm">
                  <FiUsers className="w-4 h-4 mr-2 text-emerald-600" />
                  {trip.currentParticipants}/{trip.maxParticipants} participants
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(trip.rating) ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">({trip.reviews})</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                  Book Now
                </button>
                <button className="flex-1 border border-emerald-600 text-emerald-600 py-2 rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-center">
                  <FiShare2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTrips.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No trips found</p>
        </div>
      )}
    </div>
  );
}
