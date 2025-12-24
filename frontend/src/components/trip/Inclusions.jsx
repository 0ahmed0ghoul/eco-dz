import React from "react";

const includedActivities = [
  "Complimentary Arrival Transfer",
  "Casablanca - Hassan II Mosque",
  "Moulay Idriss - Leader-led village walk",
  "Volubilis - Entrance and guided tour",
  "Fes - Pastilla dinner",
  "Fes - Medersa El Attarine",
];

const optionalActivities = [
  { name: "Casablanca - The Medina and Beyond Urban Adventure", price: "MAD700" },
  { name: "Casablanca - Villa des Arts Gallery & Museum (entrance fee)", price: "Free" },
  { name: "Casablanca - Jewish Museum (entrance fee)", price: "MAD50" },
  { name: "Todra Gorge - Hike", price: "MAD350" },
];

const Inclusions = () => {
  return (
    <section className="bg-white text-gray-800 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Inclusions and activities</h2>

        {/* Summary grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700 mb-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Destinations</h3>
            <p>Morocco</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Meals</h3>
            <p>7 breakfasts, 1 lunch, 3 dinners</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Transport</h3>
            <p>Private vehicle, Camel</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Accommodation</h3>
            <p>Hotel (4 nights), Desert camp (1 night), Riad (2 nights)</p>
          </div>
        </div>

        {/* Included activities */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Included activities</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
            {includedActivities.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <button className="mt-2 text-sm text-blue-600 hover:underline">Show all (17)</button>
        </div>

        {/* Optional activities */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Optional activities</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {optionalActivities.map((item, i) => (
              <li key={i}>
                {item.name} – <span className="text-gray-500">{item.price}</span>
              </li>
            ))}
          </ul>
          <button className="mt-2 text-sm text-blue-600 hover:underline">Show all (7)</button>
        </div>

        {/* Notes */}
        <div className="space-y-4 text-sm text-gray-600">
          <p>
            We're in the process of figuring out how much CO₂-e this trip generates.
            In the meantime, <a href="#" className="text-blue-600 hover:underline">learn more about our climate commitment</a>.
          </p>
          <p>
            When you travel with us, The Intrepid Foundation gives you more opportunities
            to support important causes in destinations you visit.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Inclusions;
