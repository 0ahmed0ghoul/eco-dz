import React from "react";
import { Link } from "react-router-dom";

const PlaceOverview = ({ place }) => {
  if (!place) return null; // in case place is not loaded yet

  return (
    <section className="bg-white text-gray-800">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-500">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="hover:text-gray-700">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/places" className="hover:text-gray-700">
              Destinations
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-700 font-medium">{place.name}</li>
        </ol>
      </nav>

      {/* Hero image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="aspect-16/7 overflow-hidden rounded-lg shadow-sm">
          <img
            src={place.images?.[0]} // first image of the place
            alt={place.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Overview content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{place.name}</h1>
        <p className="text-lg leading-relaxed text-gray-700">
          {place.description}
        </p>
      </div>
    </section>
  );
};

export default PlaceOverview;
