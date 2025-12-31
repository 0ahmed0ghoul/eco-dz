import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiClock,
  FiUsers,
  FiStar,
  FiHeart,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function TripsList() {
  const [trips, setTrips] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [imageIndexes, setImageIndexes] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchTrips();
    if (token) fetchFavorites();
  }, []);

  const fetchTrips = async () => {
    const res = await fetch("http://localhost:5000/api/agency/trips");
    const data = await res.json();
    setTrips(data);
    setLoading(false);
  };

  const fetchFavorites = async () => {
    const res = await fetch("http://localhost:5000/api/agency/favorites", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setFavorites(data.map(f => f.agencyId));
  };

  const toggleFavorite = async agencyId => {
    if (!token) return alert("Login required");

    if (favorites.includes(agencyId)) {
      await fetch(`http://localhost:5000/api/agency/favorites/${agencyId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(favorites.filter(id => id !== agencyId));
    } else {
      await fetch("http://localhost:5000/api/agency/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ agencyId }),
      });
      setFavorites([...favorites, agencyId]);
    }
  };

  const getImage = trip => trip.image;

  if (loading)
    return <div className="text-center py-20 text-lg">Loading adventures…</div>;

  const filteredTrips =
    filter === "favorites"
      ? trips.filter(t => favorites.includes(t.agencyId))
      : trips;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">
          🌍 Explore Adventures
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              filter === "all"
                ? "bg-emerald-600 text-white shadow-lg"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            All Trips
          </button>

          {token && (
            <button
              onClick={() => setFilter("favorites")}
              className={`px-5 py-2 rounded-full font-semibold transition ${
                filter === "favorites"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              ❤️ Favorites
            </button>
          )}
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTrips.map(trip => {
          const soldOut =
            trip.currentParticipants >= trip.maxParticipants;

          return (
            <div
              key={trip.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300"
            >
              {/* IMAGE */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={getImage(trip)}
                  alt={trip.title}
                  className="h-full w-full object-cover group-hover:scale-110 transition duration-700"
                />

                {/* GRADIENT */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* SOLD OUT */}
                {soldOut && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-center">
                    <span className="text-white tracking-widest text-xs mb-2">
                      AVAILABILITY
                    </span>
                    <span className="text-4xl font-black text-red-500 drop-shadow-lg">
                      SOLD OUT
                    </span>
                    <span className="text-gray-200 text-sm mt-2">
                      No seats left
                    </span>
                  </div>
                )}

                {/* PRICE */}
                <span className="absolute top-4 left-4 bg-emerald-600 text-white px-4 py-1 rounded-full font-bold shadow">
                  ${trip.price}
                </span>

                {/* FAVORITE */}
                <button
                  onClick={() => toggleFavorite(trip.agencyId)}
                  className={`absolute top-4 right-4 p-2 rounded-full transition ${
                    favorites.includes(trip.agencyId)
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FiHeart
                    className={`w-5 h-5 ${
                      favorites.includes(trip.agencyId)
                        ? "fill-current"
                        : ""
                    }`}
                  />
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-1">
                  {trip.agencyName}
                </p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {trip.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {trip.description}
                </p>

                {/* INFO */}
                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-emerald-600" />
                    {trip.destination}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="text-emerald-600" />
                    {trip.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUsers className="text-emerald-600" />
                    {trip.currentParticipants}/{trip.maxParticipants}
                  </div>
                </div>

                {/* RATING */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(trip.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">
                    ({trip.reviews})
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3">
                  <button
                    disabled={soldOut}
                    onClick={() => navigate(`/trip/${trip.id}/book`)}
                    className={`flex-1 py-2 rounded-xl font-semibold transition ${
                      soldOut
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {soldOut ? "Fully Booked" : "Book Now"}
                  </button>

                  <button className="p-2 rounded-xl border border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    <FiShare2 />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTrips.length === 0 && (
        <div className="text-center py-20 text-gray-600 text-lg">
          No trips found 🌿
        </div>
      )}
    </div>
  );
}
