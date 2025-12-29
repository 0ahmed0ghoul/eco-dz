import React from "react";
import Comments from "../Comments";

const TravelDeals = ({ place }) => {
  if (!place || !place.deals || place.deals.length === 0) {
    return (
      <section className="bg-white text-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Travel Deals</h2>
          <p className="text-gray-600">No deals available for this destination.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white text-gray-800 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Top {place.name} travel deals
        </h2>

        {/* Deals table */}
        <div className="space-y-6">
          {place.deals.map((deal, i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900 block">Departing</span>
                {deal.date}
              </div>

              <div className="sm:col-span-2">
                <h3 className="text-base font-semibold text-gray-900">{deal.trip}</h3>
                <p className="text-sm text-gray-600">{deal.route}</p>
              </div>

              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900 block">Days</span>
                {deal.days}
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500 line-through">
                  USD ${deal.price.original.toLocaleString()}
                </p>
                <p className="text-lg font-semibold text-green-700">
                  USD ${deal.price.discounted.toLocaleString()}
                </p>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                >
                  View trip
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View more button */}
        <div className="mt-8 text-center">
          <button className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
            View more trips
          </button>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <Comments destinationId={place.id} destinationType="place" />
        </div>
      </div>
    </section>
  );
};

export default TravelDeals;
