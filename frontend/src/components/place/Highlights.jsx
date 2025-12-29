import React from "react";

const PlaceHighlights = ({ place }) => {
  if (!place || !place.highlights || place.highlights.length === 0) {
    return (
      <section className="bg-white text-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Highlights</h2>
          <p className="text-gray-600">No highlights available for this destination.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white text-gray-800 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{place.name} highlights</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {place.highlights.map((highlight, i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col">
              <div className="h-56 bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                {highlight.image ? <img src={highlight.image} alt={highlight.title} className="w-full h-full object-cover"/> : "Image"}
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{highlight.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{highlight.description}</p>
                </div>
                {highlight.buttonText && (
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                    {highlight.buttonText}
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
