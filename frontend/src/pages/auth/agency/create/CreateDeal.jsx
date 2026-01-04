import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CreateDeal({ onSuccess }) {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Fetch trips
  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:5000/api/agency/trips", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTrips(data.trips || []);
    };
    fetchTrips();
  }, []);

  // Auto calculate discounted price
  useEffect(() => {
    if (selectedTrip && discountPercentage) {
      const discount = (selectedTrip.price * Number(discountPercentage)) / 100;
      setDiscountedPrice((selectedTrip.price - discount).toFixed(2));
    } else {
      setDiscountedPrice("");
    }
  }, [selectedTrip, discountPercentage]);

  
  const handleSubmit = async () => {
    if (!selectedTrip) return;
  
    setLoading(true);
    const token = localStorage.getItem("authToken");
  
    // Build FormData for the deal
    const formData = new FormData();
    formData.append("place_id", selectedTrip.id); // Trip ID
    formData.append("title", selectedTrip.title);
    formData.append("description", description || selectedTrip.description || "");
    formData.append("discount_percentage", discountPercentage);
    formData.append("original_price", selectedTrip.price);
    formData.append("discounted_price", discountedPrice);
    formData.append("start_date", selectedTrip.start_date);
    formData.append("end_date", selectedTrip.end_date);
    formData.append("status", status);
    formData.append("category", selectedTrip.category || "");
    if (imageFile) formData.append("image", imageFile);
  
    try {
      const res = await fetch("http://localhost:5000/api/agency/deals", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // FormData auto sets Content-Type
        body: formData,
      });
  
      if (!res.ok) throw new Error();
  
      // ✅ Refresh trips and deals in parent dashboard
      onSuccess?.(); // This should call fetchDashboard from AgencyDashboard
  
      // Navigate back to dashboard
      navigate("/agency/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to create deal");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <nav className="text-sm text-gray-500">
          <Link to="/agency/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <span className="mx-2">/</span>
          <Link to="/agency/deals" className="hover:text-blue-600">Deals</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Create</span>
        </nav>

        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
          <h2 className="text-2xl font-bold">Create New Deal</h2>

          {/* Select Trip */}
          <select
            className="border rounded px-3 py-2 w-full"
            defaultValue=""
            onChange={(e) =>
              setSelectedTrip(trips.find((t) => t.id == e.target.value))
            }
          >
            <option value="" disabled>Select a trip</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.title} – ${trip.price}
              </option>
            ))}
          </select>

          {selectedTrip && (
            <>
              {selectedTrip.image && (
                <img
                  src={`http://localhost:5000/${selectedTrip.image}`}
                  alt="Trip"
                  className="w-32 h-32 object-cover rounded"
                />
              )}

              <textarea
                placeholder="Deal description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />

              <input
                type="number"
                placeholder="Discount %"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />

              <input
                value={discountedPrice}
                disabled
                className="border rounded px-3 py-2 w-full bg-gray-100"
                placeholder="Discounted price"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="disabled">Disabled</option>
              </select>

              {/* Optional new image */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="border rounded px-3 py-2 w-full"
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                {loading ? "Creating..." : "Create Deal"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
