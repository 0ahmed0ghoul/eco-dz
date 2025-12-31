import React, { useState, useEffect } from 'react';
import { FiMapPin, FiBriefcase, FiUsers, FiHeart, FiMail } from 'react-icons/fi';

export default function AgenciesPage() {
  const [trips, setTrips] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/agency/trips');
      const tripsData = await response.json();
      setTrips(tripsData);

      // Extract unique agencies from trips
      const agenciesList = [...new Map(
        tripsData.map(trip => [trip.agencyId, {
          id: trip.agencyId,
          name: trip.agencyName,
          tripCount: 0
        }])
      ).values()];

      // Count trips per agency
      agenciesList.forEach(agency => {
        agency.tripCount = tripsData.filter(t => t.agencyId === agency.id).length;
      });

      setAgencies(agenciesList);

      if (token) {
        const favResponse = await fetch('http://localhost:5000/api/agency/favorites', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const favData = await favResponse.json();
        setFavorites(favData.map(f => f.agencyId));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
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
          headers: { 'Authorization': `Bearer ${token}` }
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
    return <div className="text-center py-12">Loading agencies...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Travel Agencies</h1>
        <p className="text-gray-600">Discover amazing agencies and their unforgettable adventures</p>
      </div>

      {/* Agencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {agencies.map((agency) => {
          const agencyTrips = trips.filter(t => t.agencyId === agency.id);
          const avgRating = agencyTrips.length > 0
            ? (agencyTrips.reduce((sum, t) => sum + t.rating, 0) / agencyTrips.length).toFixed(1)
            : 0;

          return (
            <div key={agency.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Featured Trip Image */}
              {agencyTrips.length > 0 && (
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-emerald-400 to-emerald-600">
                  <img
                    src={agencyTrips[0].image}
                    alt={agency.name}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <button
                    onClick={() => toggleFavorite(agency.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                      favorites.includes(agency.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiHeart className={`w-5 h-5 ${favorites.includes(agency.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              )}

              {/* Agency Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{agency.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center space-x-1 mt-1">
                      <FiBriefcase className="w-4 h-4" />
                      <span>Travel Agency</span>
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4 pt-3 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">{agency.tripCount}</p>
                    <p className="text-xs text-gray-600">Active Trips</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-500">{avgRating}</p>
                    <p className="text-xs text-gray-600">Avg Rating</p>
                  </div>
                </div>

                {/* Featured Trips Preview */}
                {agencyTrips.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Featured Trips:</p>
                    <div className="space-y-1">
                      {agencyTrips.slice(0, 2).map((trip) => (
                        <div key={trip.id} className="text-xs text-gray-600 flex items-center space-x-1">
                          <FiMapPin className="w-3 h-3 text-emerald-600" />
                          <span>{trip.destination}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm">
                    View Trips
                  </button>
                  {token && favorites.includes(agency.id) && (
                    <button className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm flex items-center justify-center space-x-1">
                      <FiMail className="w-4 h-4" />
                      <span>Subscribed</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {agencies.length === 0 && (
        <div className="text-center py-12">
          <FiBriefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 text-lg">No agencies available yet</p>
        </div>
      )}
    </div>
  );
}
