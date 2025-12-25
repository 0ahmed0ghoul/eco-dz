import React, { useMemo } from "react";
import { Search, Heart, User } from "lucide-react";
import { monuments } from "../data/monuments";

export default function Destinations() {
  const heroImage = useMemo(
    () => monuments[Math.floor(Math.random() * monuments.length)].image,
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= TITLE ================= */}
      <h2 className="text-center text-4xl font-bold my-12 text-gray-800">
        All destinations
      </h2>

      {/* ================= HERO ================= */}
      <div className="relative h-[420px] w-full">
        <img
          src={heroImage}
          alt="Hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h3 className="text-white text-5xl font-extrabold tracking-wide">
            Explore Algeria
          </h3>
        </div>
      </div>

      {/* ================= GRID ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-semibold mb-10 text-center text-gray-800">
          Where you can go
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {monuments.map((place) => (
            <div
              key={place.id}
              className="rounded-xl overflow-hidden border bg-white shadow-sm hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <img
                src={place.image}
                alt={place.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
                <h4 className="font-semibold text-lg text-gray-800">
                  {place.name}
                </h4>
                <p className="text-sm text-gray-500">{place.destination}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TOP DESTINATIONS ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h3 className="text-3xl font-bold mb-12 text-gray-800 text-center">
          Our top destinations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {monuments.slice(0, 3).map((place, i) => (
            <div
              key={place.id}
              className="rounded-xl overflow-hidden flex flex-col bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-64">
                <img
                  src={place.image}
                  className="h-full w-full object-cover"
                  alt={place.name}
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center text-gray-800 font-bold">
                  {i + 1}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h4 className="font-bold text-2xl mb-4 text-gray-800">
                  {place.name.split(" ")[0]}
                </h4>

                <p className="text-gray-600 flex-1 leading-relaxed mb-4">
                  {place.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <span className="mr-4">⏱ {place.durationDays} days</span>
                  <span>💰 ${place.price}</span>
                </div>

                <button className="mt-auto border-2 border-gray-800 rounded-full py-3 px-6 text-sm font-semibold text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-300">
                  Trips in {place.name.split(" ")[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}