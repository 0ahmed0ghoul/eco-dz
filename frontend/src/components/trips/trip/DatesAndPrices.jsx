import React from "react";

const departures = [
  {
    start: "Thu 1 Jan 2026",
    end: "Thu 8 Jan 2026",
    status: "3 spaces left",
    price: "$1,905",
    label: null,
  },
  {
    start: "Fri 2 Jan 2026",
    end: "Fri 9 Jan 2026",
    status: "Available",
    price: "$1,674",
    original: "$1,805",
    label: "Sale • Last Minute",
  },
  {
    start: "Sat 3 Jan 2026",
    end: "Sat 10 Jan 2026",
    status: "2 spaces left",
    price: "$1,945",
    label: null,
  },
  {
    start: "Mon 5 Jan 2026",
    end: "Mon 12 Jan 2026",
    status: "4 spaces left",
    price: "$1,805",
    original: "$1,945",
    label: "Sale • Last Minute",
  },
  {
    start: "Thu 8 Jan 2026",
    end: "Thu 15 Jan 2026",
    status: "Fully booked",
    price: null,
    label: null,
  },
  {
    start: "Sat 10 Jan 2026",
    end: "Sat 17 Jan 2026",
    status: "1 space left",
    price: "$1,915",
    label: null,
  },
  {
    start: "Thu 15 Jan 2026",
    end: "Thu 22 Jan 2026",
    status: "Fully booked",
    price: null,
    label: null,
  },
  {
    start: "Sat 17 Jan 2026",
    end: "Sat 24 Jan 2026",
    status: "Fully booked",
    price: null,
    label: null,
  },
  {
    start: "Mon 19 Jan 2026",
    end: "Mon 26 Jan 2026",
    status: "Available",
    price: "$1,557",
    original: "$1,805",
    label: "Sale • Last Minute",
  },
  {
    start: "Thu 22 Jan 2026",
    end: "Thu 29 Jan 2026",
    status: "Fully booked",
    price: null,
    label: null,
  },
];

const DatesAndPrices = () => {
  return (
    <section className="bg-white text-gray-800 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dates and prices</h2>
        <p className="text-sm text-gray-600 mb-6">
          Lock in your trip with a <strong>$400 flexible deposit</strong> if it departs 56+ days from now.{" "}
          <a href="#" className="text-blue-600 hover:underline">Terms and conditions</a>
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 text-sm">
          <button className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">
            Travel dates
          </button>
          <button className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">
            Deals (8)
          </button>
          <button className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">
            Start date (earliest)
          </button>
        </div>

        {/* Departure list */}
        <div className="space-y-4">
          {departures.map((d, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {d.start} – {d.end}
                </p>
                <p className="text-sm text-gray-600">{d.status}</p>
                {d.label && (
                  <p className="text-xs text-red-600 font-medium mt-1">{d.label}</p>
                )}
              </div>

              <div className="text-right">
                {d.price ? (
                  <>
                    {d.original && (
                      <p className="text-sm text-gray-500 line-through">{d.original}</p>
                    )}
                    <p className="text-lg font-semibold text-blue-600">{d.price}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">No availability</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View more button */}
        <div className="mt-8 text-center">
          <button className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
            View more dates
          </button>
        </div>
      </div>
    </section>
  );
};

export default DatesAndPrices;
