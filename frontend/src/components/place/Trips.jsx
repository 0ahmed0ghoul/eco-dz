import React from "react";

const trips = [
  { title: "Morocco Uncovered", days: 9, price: 2048 },
  { title: "Classic Morocco", days: 8, price: 1471 },
  { title: "Premium Morocco in Depth", days: 15, price: 4328 },
  { title: "Best of Morocco", days: 10, price: 1386 },
  { title: "Okavango Experience", days: 10, price: 2536 },
  { title: "Morocco Highlights", days: 8, price: 1008 },
  { title: "Explore Southern Africa", days: 10, price: 2085 },
  { title: "North Morocco Adventure", days: 8, price: 928 },
  { title: "South Africa Family Safari with Teenagers", days: 12, price: 3218 },
  { title: "Gorillas & Game Parks", days: 16, price: 4340 },
  { title: "East Africa Highlights", days: 10, price: 2475 },
];

const PlaceTrips = () => {
  return (
    <section className="bg-white text-gray-800 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Our Africa trips</h2>
          <button className="px-4 py-2 text-sm font-medium bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
            Refine search
          </button>
        </div>

        {/* Trip grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col"
            >
              <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                Map thumbnail
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{trip.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{trip.days} days</p>
                  <p className="text-lg font-semibold text-blue-600 mt-2">
                    USD ${trip.price.toLocaleString()}
                  </p>
                </div>
                <button className="mt-4 text-sm text-blue-600 hover:underline">
                  Add to compare
                </button>
              </div>
            </div>
          ))}

          {/* Custom adventure card */}
          <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col bg-blue-50">
            <div className="h-40 bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-medium">
              Build your dream adventure
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <p className="text-sm text-gray-700">
                Let us create an exclusive experience for your group.
              </p>
              <button className="mt-4 text-sm text-blue-600 hover:underline">
                Explore tailor-made trips
              </button>
            </div>
          </div>
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
