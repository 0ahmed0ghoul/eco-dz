import React from "react";

const PlaceHighlights = ({ place }) => {
  if (!place || !place.highlights || place.highlights.length === 0) {
    return (
      <section id="highlight" className="bg-white text-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Highlights</h2>
          <p className="text-gray-600">No highlights available for this destination.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="highlight" className="bg-white text-gray-800 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{place.name} Highlights</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {place.highlights.map((highlight) => (
            <div
              key={highlight.id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="h-56 w-full overflow-hidden">
                <img
                  src={highlight.image ? `http://localhost:5000/uploads/highlights/${highlight.image}` : ""}
                  alt={highlight.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://via.placeholder.com/400x224/4F46E5/FFFFFF?text=Highlight")
                  }
                />
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{highlight.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{highlight.description}</p>
                </div>

                {highlight.button_text && (
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                    {highlight.button_text}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlaceHighlights;
