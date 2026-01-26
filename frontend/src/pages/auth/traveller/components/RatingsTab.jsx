import React from "react";
import { FaStar, FaMapMarkerAlt, FaTrash, FaExternalLinkAlt } from "react-icons/fa";

const RatingsTab = ({ ratings, getPlaceInfo, handleDeleteRating, formatTravelDate, renderStars }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900">My Ratings</h3>
        <p className="text-gray-600 mt-1">Places you've rated</p>
      </div>
      <div className="p-6">
        {ratings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaStar className="text-gray-400 text-2xl" />
            </div>
            <h4 className="text-lg font-medium text-gray-700 mb-2">No ratings yet</h4>
            <p className="text-gray-500">Rate places to help other travelers!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ratings.map((r) => {
              const place = getPlaceInfo(r.place_id);
              return (
                <div
                  key={r.id}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{place.name}</h4>
                      {place.address && (
                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400" />
                          {place.address}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteRating(r.id)}
                      className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete rating"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="mt-4 p-4 bg-linear-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">{renderStars(r.rating)}</div>
                        <span className="text-lg font-bold text-gray-900">{r.rating}.0</span>
                      </div>
                      <span className="text-sm px-3 py-1 bg-white text-gray-700 rounded-full border border-amber-200">
                        Your Rating
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <a
                      href={`/place/${place.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                    >
                      View place <FaExternalLinkAlt className="text-xs" />
                    </a>
                    <span className="text-xs text-gray-500">{formatTravelDate(r.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingsTab;
