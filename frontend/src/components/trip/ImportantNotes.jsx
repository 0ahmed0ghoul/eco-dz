import React from "react";

const notes = [
  "A single supplement is available if you'd prefer not to share a room on this trip. The single supplement excludes Day 4 (Sahara Camp) where you will be in shared accommodation and is subject to availability. Please speak to your booking agent for further information.",
  "A complimentary airport arrival transfer is included; valid if you are arriving on Day 1 or if you have booked pre-tour accommodation through us. You must provide your flight details to your booking agent at least 14 days prior to travel.",
  "Optional transfer from Marrakech to Casablanca. If you are flying into Marrakech we can provide an optional transfer to the starting point city of Casablanca. This transfer is on request and prepaid. Please speak to your booking agent for further information.",
];

const ImportantNotes = () => {
  return (
    <section className="bg-white text-gray-800 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Important notes</h2>

        <ul className="list-disc list-inside space-y-4 text-sm text-gray-700 leading-relaxed mb-8">
          {notes.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>

        {/* Essential Trip Info box */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Essential Trip Information</h3>
          <p className="text-sm text-gray-700 mb-4">
            Want an in-depth insight into this trip? Essential Trip Information provides a detailed itinerary,
            visa info, how to get to your hotel, what's included — pretty much everything you need to know
            about this adventure and more.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
            Read Essential Trip Information
          </button>
        </div>
      </div>
    </section>
  );
};

export default ImportantNotes;
