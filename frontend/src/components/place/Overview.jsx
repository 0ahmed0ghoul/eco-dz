
import React from "react";
import Alhaggar from "../../assets/destinations/alhaggar.jpg";
const PlaceOverview = () => {
  return (
    <section className="bg-white text-gray-800">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-500">
        <ol className="flex items-center space-x-2">
          <li><a href="/" className="hover:text-gray-700">Home</a></li>
          <li>/</li>
          <li><a href="/destinations" className="hover:text-gray-700">Destinations</a></li>
          <li>/</li>
          <li className="text-gray-700 font-medium">Africa</li>
        </ol>
      </nav>

      {/* Hero image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="aspect-16/7 overflow-hidden rounded-lg shadow-sm">
          <img
            src={Alhaggar}
            alt="Elephants walking through African savannah"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Overview content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Souqs, safaris and the Sahara – Welcome to Africa</h1>
        <p className="text-lg leading-relaxed text-gray-700">
          With its diverse wildlife, thousands of cultures and breathtaking landscapes, no two adventures to Africa are alike.
          Discover the lost city of Abu Simbel and the Valley of the Kings in Egypt, spend time with a Berber family in the Sahara in Morocco,
          and immerse yourself in local villages with Maasai, San and Malagasy cultures. And, of course, you can head out in search of the Big Five
          in game reserves and parks throughout the continent. We’ve got the trips and you’ve got the choice – Where will you go?
        </p>
      </div>
    </section>
  );
};

export default PlaceOverview;
