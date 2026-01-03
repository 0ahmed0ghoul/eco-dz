import { useState, useEffect } from "react";

export default function DealForm({ trips, onSuccess }) {
  // trips = array of organizer's trips [{ id, title, price, place_id, start_date, end_date, image, category }]
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");

  // Calculate discounted price automatically
  useEffect(() => {
    if (selectedTrip && discountPercentage) {
      const discount = (selectedTrip.price * discountPercentage) / 100;
      setDiscountedPrice((selectedTrip.price - discount).toFixed(2));
    } else {
      setDiscountedPrice("");
    }
  }, [selectedTrip, discountPercentage]);

  const handleSubmit = async () => {
    if (!selectedTrip) return alert("Select a trip first");

    const token = localStorage.getItem("authToken");

    const payload = {
      place_id: selectedTrip.place_id,
      title: selectedTrip.title,
      description,
      discount_percentage: Number(discountPercentage),
      original_price: selectedTrip.price,
      discounted_price: Number(discountedPrice),
      start_date: selectedTrip.start_date,
      end_date: selectedTrip.end_date,
      image: selectedTrip.image || null,
      status,
      category: selectedTrip.category,
    };

    const formData = new FormData();
    Object.entries(payload).forEach(([k, v]) => formData.append(k, v));

    try {
      const response = await fetch("http://localhost:5000/api/agency/deals", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      alert("Deal created successfully!");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to create deal.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Trip selector */}
      <select
        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setSelectedTrip(trips.find((t) => t.id == e.target.value))}
        defaultValue=""
      >
        <option value="" disabled>
          Select a trip
        </option>
        {trips.map((trip) => (
          <option key={trip.id} value={trip.id}>
            {trip.title} - ${trip.price}
          </option>
        ))}
      </select>

      {selectedTrip && (
        <>
          {/* Description */}
          <textarea
            placeholder="Deal description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Discount percentage */}
          <input
            type="number"
            placeholder="Discount percentage"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Discounted price (readonly) */}
          <input
            type="text"
            placeholder="Discounted price"
            value={discountedPrice}
            disabled
            className="border rounded px-3 py-2 w-full bg-gray-100 text-gray-700"
          />

          {/* Status */}
          <select
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="disabled">Disabled</option>
          </select>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
          >
            Create Deal
          </button>
        </>
      )}
    </div>
  );
}
