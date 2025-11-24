import React from "react";

const travelOffers = [
  {
    id: 1,
    title: "Tassili n'Ajjer National Park",
    location: "Djanet, Southern Algeria",
    price: 45000,
    duration: "5 days",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1000&q=80",
    description:
      "Explore the stunning rock formations and ancient cave paintings in this UNESCO World Heritage site."
  },
  {
    id: 2,
    title: "Ahaggar National Park",
    location: "Tamanrasset, Sahara Desert",
    price: 38000,
    duration: "4 days",
    image: "https://images.unsplash.com/photo-1589330694652-d53bf3e11ff0?auto=format&fit=crop&w=1000&q=80",
    description:
      "Discover the majestic Hoggar Mountains and experience traditional Tuareg culture."
  },
  {
    id: 3,
    title: "Chrea National Park",
    location: "Blida, Atlas Mountains",
    price: 25000,
    duration: "3 days",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1000&q=80",
    description:
      "Hike through cedar forests and enjoy biodiversity of the Atlas Mountains."
  },
  {
    id: 4,
    title: "Gouraya National Park",
    location: "Béjaïa, Mediterranean Coast",
    price: 22000,
    duration: "2 days",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba94693?auto=format&fit=crop&w=1000&q=80",
    description:
      "Coastal park with stunning Mediterranean views and diverse marine life."
  },
  {
    id: 5,
    title: "El Kala National Park",
    location: "El Kala, Northeast Algeria",
    price: 28000,
    duration: "3 days",
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1000&q=80",
    description:
      "Wetlands and lakes ecosystem with exceptional bird watching."
  },
  {
    id: 6,
    title: "Djurdjura National Park",
    location: "Tizi Ouzou, Kabylie Region",
    price: 32000,
    duration: "4 days",
    image: "https://images.unsplash.com/photo-1464822759849-e41fc6e4c6b3?auto=format&fit=crop&w=1000&q=80",
    description:
      "Mountain range with gorges, caves, and Barbary macaque monkeys."
  }
];

function Travel() {
  return (
    <section className="relative min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gray-900" id="travels">
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
          Discover Algeria's Ecological Treasures
        </h1>
        <p className="text-lg sm:text-xl text-white/90 font-light">
          Explore the breathtaking national parks and ecological monuments of Algeria
        </p>
      </div>

      <div className="overflow-hidden relative">
        <div className="flex animate-marquee gap-6">
          {travelOffers.concat(travelOffers).map((offer, index) => (
            <div
              key={index}
              className="min-w-[280px] max-w-[360px] bg-white rounded-2xl shadow-lg cursor-pointer overflow-hidden hover:pause-marquee"
            >
              <div className="relative h-56 overflow-hidden rounded-t-2xl">
                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-1 rounded-lg font-semibold text-sm">
                  {offer.price.toLocaleString()} DZD
                </div>
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg drop-shadow-lg">
                  0{(index % travelOffers.length) + 1}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-800">{offer.title}</h3>
                <div className="flex justify-between text-gray-600 text-sm opacity-80 mb-3">
                  <span>📍 {offer.location}</span>
                  <span>⏱️ {offer.duration}</span>
                </div>
                <p className="text-gray-700 text-sm line-clamp-3 mb-4">{offer.description}</p>
                <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .hover\\:pause-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

export default Travel;
