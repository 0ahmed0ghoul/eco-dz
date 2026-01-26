import React from "react";

const TravelDeals = ({ place }) => {
  if (!place || !place.deals || place.deals.length === 0) {
    return (
      <section id="deal" className="bg-white text-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Travel Deals
          </h2>
          <p className="text-gray-600">
            No deals available for this destination.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="deal" className="bg-white text-gray-800 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Top {place.name} Travel Deals
        </h2>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {place.deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            >
              {/* Image */}
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={`http://localhost:5000/uploads/deals/${deal.image}`}
                  alt={deal.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"

                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {deal.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {deal.description}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <div>
                    <p className="text-sm text-gray-500 line-through">
                      {Number(deal.original_price).toLocaleString()} DZD
                    </p>
                    <p className="text-lg font-bold text-green-700">
                      {Number(deal.discounted_price).toLocaleString()} DZD
                    </p>
                  </div>
                  <div className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                    -{deal.discount_percentage}%
                  </div>
                </div>

                <div className="text-sm text-gray-500 mt-1">
                  {new Date(deal.start_date).toLocaleDateString()} →{" "}
                  {new Date(deal.end_date).toLocaleDateString()}
                </div>

                <button className="mt-3 w-full px-4 py-2 bg-emerald-600 text-white font-medium rounded hover:bg-emerald-700 transition-colors">
                  View Deal
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Optional: View more */}
        <div className="mt-8 text-center">
          <button className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
            View more trips
          </button>
        </div>
      </div>
    </section>
  );
};

export default TravelDeals;
