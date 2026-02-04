import React from "react";

const itinerary = [
  { day: 1, location: "Casablanca" },
  { day: 2, location: "Fes" },
  { day: 3, location: "Fes" },
  { day: 4, location: "Sahara Camp" },
  { day: 5, location: "Todra Gorge" },
  { day: 6, location: "Ait Benhaddou" },
  { day: 7, location: "Marrakech" },
  { day: 8, location: "Marrakech" },
];

const TripItinerary = () => {
  return (
    <section className="bg-white text-gray-800 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Itinerary
          </h2>
          <p className="text-sm text-gray-600 mt-2 sm:mt-0">
            Valid for departures from <strong>01 Jan 2026</strong> to <strong>31 Dec 2026</strong>
            <br />
            <a href="#" className="text-blue-600 hover:underline text-sm">
              View itinerary for 2025 departures
            </a>
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-1">
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
              Morocco route map
            </div>
            <p className="text-xs text-gray-500 mt-2">Optional transfer not included</p>
          </div>

          {/* Day-by-day itinerary */}
          <div className="lg:col-span-2">
            <ul className="space-y-4">
              {itinerary.map((item) => (
                <li key={item.day} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Day {item.day}
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">{item.location}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TripItinerary;
