import React from "react";
import { FaMapMarkerAlt, FaTrash, FaExternalLinkAlt } from "react-icons/fa";

const PlaceCard = ({ place, onDelete, children }) => {
  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow duration-200">
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
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <FaTrash />
          </button>
        )}
      </div>

      {children}

      <div className="flex items-center justify-between mt-4">
        <a
          href={`/place/${place.slug}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
        >
          View place <FaExternalLinkAlt className="text-xs" />
        </a>
      </div>
    </div>
  );
};

export default PlaceCard;
