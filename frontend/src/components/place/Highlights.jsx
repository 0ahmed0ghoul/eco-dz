import React from "react";

const PlaceHighlights = () => {
  return (
    <section className="bg-white text-gray-800 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Africa highlights</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Safari highlight */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col">
            <div className="h-56 bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
              Safari image
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Search for safari showstoppers
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  On safari, it’s all about getting as close as you can to the safari’s most iconic animals: the African elephant, black rhino, Cape buffalo, African lion and African leopard. Pack your camera and keep your eyes peeled to the grasslands as you travel in a custom-built Overland vehicle on the trip of a lifetime.
                </p>
              </div>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                Serengeti Trail
              </button>
            </div>
          </div>

          {/* Morocco food highlight */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col">
            <div className="h-56 bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
              Morocco food image
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Eat more of Morocco
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  There’s no better way to get to know a place than to learn about its cuisine! Among the sights, sounds and souqs of Morocco, salivate over street-side snacks at Marrakech’s Djemma el-Fna market, taste a tagine in Tangier and embark on a food-focused experience at a Berber family homestay high in the Atlas Mountains.
                </p>
              </div>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                Morocco Real Food Adventure
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlaceHighlights;
