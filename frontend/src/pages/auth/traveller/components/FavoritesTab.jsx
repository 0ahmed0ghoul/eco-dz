import React from "react";
import { FaHeart, FaMapMarkerAlt, FaTimes, FaExternalLinkAlt } from "react-icons/fa";

const FavoritesTab = ({ favorites, getPlaceInfo, handleRemoveFavorite }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900">Favorite Places</h3>
        <p className="text-gray-600 mt-1">Places you've saved for future visits</p>
      </div>
      <div className="p-6">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHeart className="text-gray-400 text-2xl" />
            </div>
            <h4 className="text-lg font-medium text-gray-700 mb-2">No favorites yet</h4>
            <p className="text-gray-500">Start exploring and save your favorite places!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map((fav) => {
              const place = getPlaceInfo(fav.place_id);
              return (
                <div
                  key={fav.place_id}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-gray-900">{place.name}</h4>
                    <button
                      onClick={() => handleRemoveFavorite(fav.place_id)}
                      className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from favorites"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  {place.address && (
                    <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-400" />
                      {place.address}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <a
                      href={`/place/${place.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                    >
                      View place <FaExternalLinkAlt className="text-xs" />
                    </a>
                    <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {place.type}
                    </span>
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

export default FavoritesTab;
