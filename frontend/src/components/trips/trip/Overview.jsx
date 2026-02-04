import React from "react";
import { Star, Plus } from "lucide-react";


const TripOverview = () => {
  return (
    <section className="bg-white text-gray-800">
      {/* Hero image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="aspect-16/7 overflow-hidden rounded-lg shadow-sm">
          <img
            src={'/destinations/alhaggar.jpg'}
            alt="Elephants walking through African savannah"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Trip summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Trip details */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Classic Morocco</h1>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-medium text-gray-800">4.9</span>
            <span>from 618 reviews</span>
          </div>

          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700">
            <li><strong>Trip code:</strong> XMKN</li>
            <li><strong>Start:</strong> Casablanca, Morocco</li>
            <li><strong>End:</strong> Marrakech, Morocco</li>
            <li><strong>Duration:</strong> 8 days</li>
            <li><strong>Group size:</strong> 1 to 12</li>
            <li><strong>Min age:</strong> 15 years</li>
            <li><strong>Style:</strong> Comfort</li>
            <li><strong>Theme:</strong> Explorer</li>
            <li className="col-span-2"><strong>Physical rating:</strong> <span className="inline-block w-24 h-2 bg-gray-200 relative"><span className="absolute left-0 top-0 h-2 bg-blue-600" style={{ width: "40%" }} /></span> 2/5</li>
          </ul>

          <p className="text-lg font-semibold text-blue-600">From USD $1,471</p>

          <div className="flex gap-3 mt-4">
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
              Dates and prices
            </button>
            <button className="px-4 py-2 border border-gray-300 text-sm text-gray-700 rounded-md flex items-center gap-1 hover:bg-gray-50">
              <Plus className="h-4 w-4" /> Add to compare
            </button>
          </div>
        </div>

        {/* Right: Thumbnails + intro */}
        <div className="space-y-6">
          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2">
            {["Map", "Camel", "Musician", "Crafts"].map((label, i) => (
              <div key={i} className="h-20 bg-gray-100 flex items-center justify-center text-gray-500 text-xs rounded">
                {label}
              </div>
            ))}
          </div>
          <button className="text-sm text-blue-600 hover:underline">All photos (10)</button>

          {/* Intro paragraph */}
          <div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Take an adventure through the bustling medinas, city squares and mountain ranges of Morocco.
              You don’t have to sacrifice your comfort for a great adventure! On this eight-day discovery of Morocco,
              you’ll explore sacred sites like the Hassan II Mosque, Moulay Idriss and the...
            </p>
            <button className="mt-2 text-sm text-blue-600 hover:underline">Read more</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TripOverview;
