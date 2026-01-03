import { useState, useEffect } from "react";

export default function TripForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState({
    place_id: "",
    category: "",
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    duration: "",
    price: "",
    max_people: "",
    image: null,
  });

  const [places, setPlaces] = useState([]);
  const [placeSearch, setPlaceSearch] = useState("");

  // Fetch all places when component mounts
  useEffect(() => {
    const fetchPlaces = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const res = await fetch("http://localhost:5000/api/places", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPlaces(data);
      } catch (err) {
        console.error("Failed to fetch places:", err);
      }
    };
    fetchPlaces();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== "") formData.append(key, value);
    });

    try {
      const response = await fetch("http://localhost:5000/api/agency/trips", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      alert("Trip created successfully!");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to create trip.");
    }
  };

  // Filter places by search input
  const filteredPlaces = places.filter((p) =>
    p.name.toLowerCase().includes(placeSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        name="title"
        placeholder="Trip title"
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Place search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Type place name..."
          value={placeSearch}
          onChange={(e) => setPlaceSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {placeSearch && filteredPlaces.length > 0 && (
          <ul className="absolute z-10 bg-white border rounded w-full max-h-40 overflow-y-auto mt-1">
            {filteredPlaces.map((place) => (
              <li
                key={place.id}
                className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => {
                  setForm({
                    ...form,
                    place_id: place.id,
                    category: place.category, // set category automatically
                  });
                  setPlaceSearch(place.name);
                }}
              >
                {place.name} - <span className="text-sm text-gray-500">{place.category}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Category (read-only, updated automatically) */}
      <input
        type="text"
        value={form.category}
        placeholder="Category"
        readOnly
        className="border rounded px-3 py-2 w-full bg-gray-100 focus:outline-none"
      />

      <input
        type="date"
        name="start_date"
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="date"
        name="end_date"
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="duration"
        type="number"
        placeholder="Duration (days)"
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        name="max_people"
        type="number"
        placeholder="Max people (optional)"
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="image"
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="w-full"
      />

      <div className="flex space-x-2">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
        >
          Create Trip
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded w-full hover:bg-gray-500 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
