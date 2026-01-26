import React, { useMemo, useState, useEffect } from "react";

const PlaceTrips = ({ place }) => {
  if (!place || !place.trips || place.trips.length === 0) {
    return (
      <section id="trips" className="bg-white text-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trips</h2>
          <p className="text-gray-600">No trips available for this destination.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="trips" className="bg-white text-gray-800 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Our {place.name} trips
          </h2>
          <button className="px-4 py-2 text-sm font-medium bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
            Refine search
          </button>
        </div>

        {/* Trip grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {place.trips.map((trip) => {
            // Safely parse the image array
            const images = useMemo(() => {
              try {
                const raw = typeof trip.image === "string" ? JSON.parse(trip.image) : [];
                return raw.map(img => img.startsWith("http") ? img : `http://localhost:5000${img}`);
              } catch (e) {
                console.error("Invalid trip.image format:", trip.image);
                return [];
              }
            }, [trip.image]);

            const currentImage = images[0] || "https://via.placeholder.com/400x224/4F46E5/FFFFFF?text=Trip";

            return (
              <div
                key={trip.id}
                className="border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col"
              >
                {/* Trip Image */}
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={currentImage}
                    alt={trip.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://via.placeholder.com/400x224/4F46E5/FFFFFF?text=Trip")
                    }
                  />
                </div>

                {/* Trip Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{trip.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{trip.duration} days</p>
                    <p className="text-lg font-semibold text-emerald-700 mt-2">
                      {Number(trip.price).toLocaleString()} DZD
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(trip.start_date).toLocaleDateString()} → {new Date(trip.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="mt-4 px-3 py-2 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 transition-colors">
                    View Trip
                  </button>
                </div>
              </div>
            );
          })}

        </div>

        {/* Show more button */}
        <div className="mt-8 text-center">
          <button className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
            Show more trips
          </button>
        </div>
      </div>
    </section>
  );
};

export default PlaceTrips;
