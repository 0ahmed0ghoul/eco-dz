import { useState } from "react";
import { MapPinIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const API_URL = "http://localhost:5000";

export default function SearchBar() {
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const saveSearch = async () => {
    if (!location) return;

    const token = localStorage.getItem("authToken");

    // 1️⃣ Save locally (instant UX)
    const local = JSON.parse(localStorage.getItem("recent_searches")) || [];
    const updated = [
      { location, startDate, endDate },
      ...local.filter((s) => s.location !== location),
    ].slice(0, 5);
    localStorage.setItem("recent_searches", JSON.stringify(updated));

    // 2️⃣ Save to backend if logged in
    if (token) {
      await fetch(`${API_URL}/api/searches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ location, startDate, endDate }),
      });
    }

    // 🔜 later: open popup with place → trips → deals
    console.log("Search saved:", { location, startDate, endDate });
  };
  const handleSearch = async () => {
    if (!location) return;
  
    const token = localStorage.getItem("authToken");
  
    await fetch("http://localhost:5000/api/searches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        location,
        start_date: startDate,
        end_date: endDate,
      }),
    });
  
    // later: open popup modal with results
  };

  

  return (
    <div className="z-10 bg-linear-to-b from-white/10 to-transparent backdrop-blur-sm 
      border border-white/20 shadow-2xl rounded-2xl p-4 
      flex flex-col md:flex-row items-center gap-4 w-full max-w-3xl mx-auto">

      {/* Location */}
      <div className="flex items-center border border-white/30 rounded-xl px-3 py-2 w-full md:w-1/3 bg-white/5">
        <MapPinIcon className="h-5 w-5 text-emerald-300 mr-2" />
        <input
          type="text"
          placeholder="Search location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full outline-none text-sm text-black bg-transparent"
        />
      </div>

      {/* Dates */}
      <div className="flex gap-2 w-full md:w-1/2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-white/30 rounded-xl px-3 py-2 w-1/2 text-sm bg-white/5"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-white/30 rounded-xl px-3 py-2 w-1/2 text-sm bg-white/5"
        />
      </div>

      {/* Button */}
      <button
        onClick={handleSearch}
        className="bg-linear-to-r from-emerald-600 to-teal-600 
        text-white px-6 py-2 rounded-xl flex items-center gap-2 font-semibold shadow-xl"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
        Search
      </button>
    </div>
  );
}
