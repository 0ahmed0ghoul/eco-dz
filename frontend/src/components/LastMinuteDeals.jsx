import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Comments from "./Comments";

export default function LastMinuteDeals() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { subType } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/deals/last-minute")
      .then(res => res.json())
      .then(setData);
  }, []);

  useEffect(() => {
    if (subType) {
      // Filter by subType (weekend-escape, flash-sale, early-bird-special)
      const filtered = data.filter(d => 
        d.type.toLowerCase().replace(/\s+/g, "-") === subType
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [data, subType]);

  const categories = [
    { name: "Weekend Escapes", slug: "weekend-escape", count: 0 },
    { name: "Flash Sales", slug: "flash-sale", count: 0 },
    { name: "Early Bird Specials", slug: "early-bird-special", count: 0 },
  ];

  // Count items in each category
  categories.forEach(cat => {
    cat.count = data.filter(d => 
      d.type.toLowerCase().replace(/\s+/g, "-") === cat.slug
    ).length;
  });

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">Last Minute Deals</h2>
      
      {/* Category Navigation */}
      {!subType && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => navigate(`/deals/last-minute/${cat.slug}`)}
              className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 hover:from-emerald-100 hover:to-blue-100 rounded-lg border border-emerald-200 transition-all"
            >
              <h3 className="font-bold text-lg text-gray-800">{cat.name}</h3>
              <p className="text-sm text-gray-600">{cat.count} deals available</p>
            </button>
          ))}
        </div>
      )}

      {/* Back Button */}
      {subType && (
        <button
          onClick={() => navigate("/deals/last-minute")}
          className="mb-6 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition-all"
        >
          ← Back to All Deals
        </button>
      )}

      {/* Deals List */}
      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map(d => (
            <div key={d.id} className="mb-8 border-l-4 border-emerald-500 pl-4 bg-white p-4 rounded shadow-sm">
              {d.image && (
                <img src={d.image} alt={d.name} className="h-40 w-full object-cover rounded mb-3" />
              )}
              <h3 className="font-bold text-lg text-gray-800">{d.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{d.description}</p>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-3">
                <p><strong>Type:</strong> {d.type}</p>
                <p><strong>Price:</strong> ${d.price_per_day}/day</p>
                <p><strong>Capacity:</strong> {d.capacity} people</p>
                <p><strong>Location:</strong> {d.destination}</p>
              </div>
              <p className="text-emerald-600 text-sm mb-4"><strong>✓ {d.co2_savings}</strong></p>
              
              {/* Comments Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Comments destinationId={d.id.toString()} destinationType="lastMinute" />
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No deals found in this category</p>
        )}
      </div>
    </div>
  );
}
