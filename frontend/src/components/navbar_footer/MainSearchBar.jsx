import { useState } from 'react';
import { MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function SearchBar() {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="z-10 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm 
                    border border-white/20 shadow-2xl rounded-2xl p-4 
                    flex flex-col md:flex-row items-center gap-4 w-full max-w-3xl mx-auto">
      {/* Location Input */}
      <div className="flex items-center border border-white/30 rounded-xl px-3 py-2 w-full md:w-1/3 bg-white/5">
        <MapPinIcon className="h-5 w-5 text-emerald-300 mr-2" />
        <input
          type="text"
          placeholder="Search location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full outline-none text-sm text-white placeholder-white/60 bg-transparent"
        />
      </div>

      {/* Date Range */}
      <div className="flex gap-2 w-full md:w-1/2 ">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-white/30 rounded-xl px-3 py-2 w-1/2 text-sm 
                     text-white bg-white/5 placeholder-white/60 focus:border-emerald-400"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-white/30 rounded-xl px-3 py-2 w-1/2 text-sm 
                     text-white bg-white/5 placeholder-white/60 focus:border-cyan-400"
        />
      </div>

      {/* Search Button */}
      <button
        onClick={() => console.log({ location, startDate, endDate })}
        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 
                   text-white px-6 py-2 rounded-xl flex items-center gap-2 w-full md:w-auto 
                   font-semibold shadow-xl transition-all duration-300"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
        <span className="text-sm">Search</span>
      </button>
    </div>
  );
}
