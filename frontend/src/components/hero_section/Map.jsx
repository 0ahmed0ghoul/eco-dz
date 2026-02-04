import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

/* ---------------- ICON ---------------- */
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

/* ---------------- CATEGORIES ---------------- */
const defaultCategories = [
  { id: "all", name: "All", linear: "from-blue-500 to-blue-600" },
  { id: "desert", name: "Desert", linear: "from-amber-500 to-orange-500" },
  { id: "mountain", name: "Mountains", linear: "from-green-500 to-emerald-600" },
  { id: "forest", name: "Forests", linear: "from-emerald-500 to-green-600" },
  { id: "park", name: "Parks", linear: "from-green-300 to-green-500" },
  { id: "lake", name: "Lakes", linear: "from-blue-400 to-blue-600" },
  { id: "cave", name: "Caves", linear: "from-gray-500 to-gray-700" },
  { id: "beach", name: "Beaches", linear: "from-yellow-400 to-orange-400" },
  { id: "waterfall", name: "Waterfalls", linear: "from-blue-300 to-blue-500" },
];

/* ---------------- MARKER ---------------- */
const createCustomIcon = (category) => {
  const colors = {
    desert: "#f59e0b",
    mountain: "#10b981",
    forest: "#047857",
    park: "#34d399",
    lake: "#3b82f6",
    cave: "#6b7280",
    beach: "#fbbf24",
    waterfall: "#3b82f6",
    all: "#3b82f6",
  };

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="relative">
        <div class="w-5 h-5 rounded-full border-2 border-white shadow"
             style="background:${colors[category] || "#3b82f6"}"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

/* ================= COMPONENT ================= */
export default function Map() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersLayer = useRef(null);
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  /* ---------- FETCH ---------- */
  useEffect(() => {
    fetch("http://localhost:5000/api/places")
      .then((res) => res.json())
      .then((data) =>
        setPlaces(
          data.map((p) => ({
            ...p,
            lat: +p.lat,
            lng: +p.lng,
          }))
        )
      );
  }, []);

  /* ---------- MAP INIT ---------- */
  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, {
      center: [28.0339, 1.6596],
      zoom: 5,
      minZoom: 4,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      mapInstance.current
    );

    markersLayer.current = L.layerGroup().addTo(mapInstance.current);
  }, []);

  /* ---------- LOAD MARKERS ---------- */
  useEffect(() => {
    if (!markersLayer.current) return;

    markersLayer.current.clearLayers();

    const filtered =
      activeCategory === "all"
        ? places
        : places.filter((p) => p.category === activeCategory);

    filtered.forEach((place) => {
      const marker = L.marker([place.lat, place.lng], {
        icon: createCustomIcon(place.category),
      });

      marker.bindPopup(`
        <div class="space-y-2 style={{backgroundImage : src(assets/destination/${place.image})}}>
          <h3 class="font-bold text-lg">${place.name}</h3>
          <p class="text-sm text-gray-600">
            <strong>Category:</strong> ${place.category}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Province:</strong> ${place.province || "—"}
          </p>
          <p class="text-sm">${place.description || ""}</p>
          <button
            onclick="window.location.href='/places/${place.id}'"
            class="mt-2 w-full bg-blue-600 text-white py-1 rounded"
          >
            View details
          </button>
        </div>
      `);

      marker.addTo(markersLayer.current);
    });
  }, [places, activeCategory]);

  return (
    <section id="map" className="w-full h-screen flex flex-col lg:flex-row bg-linear-to-b from-gray-900 to-black">
      
      {/* ---------- CATEGORIES ---------- */}
      <div className="lg:w-72 bg-white/10 backdrop-blur-xl p-4 lg:p-6 lg:m-6 rounded-3xl">
        <h3 className="hidden lg:block text-xl font-bold text-white mb-4">
          Categories
        </h3>

        {/* Mobile: horizontal */}
        <div className="flex lg:hidden gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {defaultCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                activeCategory === cat.id
                  ? `bg-linear-to-r ${cat.linear} text-white`
                  : "bg-white/10 text-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Desktop: vertical */}
        <div className="hidden lg:flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-1">
          {defaultCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-3 rounded-2xl text-left font-medium transition ${
                activeCategory === cat.id
                  ? `bg-linear-to-r ${cat.linear} text-white`
                  : "bg-white/10 text-white/90 hover:bg-white/20"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- MAP ---------- */}
      <div className="flex-1 m-4 lg:m-6 rounded-3xl overflow-hidden border border-white/20">
        <div ref={mapRef} className="w-full h-full" />
      </div>

      <style>{`
        .custom-marker { background: transparent !important; border: none !important; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
