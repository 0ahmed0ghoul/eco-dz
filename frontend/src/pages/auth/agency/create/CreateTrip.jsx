import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function CreateTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState([]);
  const [search, setSearch] = useState("");
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
    newImages: [], // new files selected by user
    existingImages: [], // URLs of images already uploaded
    removedImages: [], // images the user wants to delete
  });

  // Fetch places
  useEffect(() => {
    fetch("http://localhost:5000/api/places")
      .then((r) => r.json())
      .then(setPlaces)
      .catch(console.error);
  }, []);

  // Fetch trip data if editing
  useEffect(() => {
    if (!isEdit) return;
    const token = localStorage.getItem("authToken");
    fetch(`http://localhost:5000/api/agency/trips/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setForm({
          place_id: data.place_id || "",
          category: data.category || "",
          title: data.title || "",
          description: data.description || "",
          start_date: data.start_date || "",
          end_date: data.end_date || "",
          duration: data.duration || "",
          price: data.price || "",
          max_people: data.max_people || "",
          newImages: [], // cannot prefill File input
          existingImages: data.images || [], // URLs of already uploaded images
          removedImages: [],
        });
        setSearch(data.place_name || "");
      })
      .catch(console.error);
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      // Add new selected images
      setForm((prev) => ({ ...prev, newImages: [...prev.newImages, ...files] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));

      // Auto calculate duration if dates change
      if (name === "start_date" || name === "end_date") {
        const start = name === "start_date" ? value : form.start_date;
        const end = name === "end_date" ? value : form.end_date;
        if (start && end) {
          const diff = Math.ceil(
            (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)
          );
          setForm((prev) => ({ ...prev, duration: diff > 0 ? diff : 0 }));
        }
      }
    }
  };

  // Remove existing image
  const handleRemoveExistingImage = (index) => {
    setForm((prev) => {
      const removed = prev.existingImages[index];
      return {
        ...prev,
        existingImages: prev.existingImages.filter((_, i) => i !== index),
        removedImages: [...prev.removedImages, removed],
      };
    });
  };

  // Remove newly selected image
  const handleRemoveNewImage = (index) => {
    setForm((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
    }));
  };

  // Submit form
  const handleSubmit = async () => {
    if (!form.place_id) {
      alert("Please select a place from the list");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("authToken");

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "newImages" && Array.isArray(value)) {
        value.forEach((file) => fd.append("images", file));
      } else if (key === "removedImages" && Array.isArray(value)) {
        // Send removed image URLs to backend
        value.forEach((img) => fd.append("removedImages", img));
      } else if (
        key !== "existingImages" &&
        value !== undefined &&
        value !== null
      ) {
        fd.append(key, value);
      }
    });

    try {
      const url = isEdit
        ? `http://localhost:5000/api/agency/trips/${id}`
        : "http://localhost:5000/api/agency/trips";

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      if (!res.ok) throw new Error("Failed to save trip");
      navigate("/agency/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to save trip");
    } finally {
      setLoading(false);
    }
  };

  const filtered = places.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500">
          <Link to="/agency/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <Link to="/agency/trips" className="hover:text-blue-600">
            Trips
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">
            {isEdit ? "Edit" : "Create"}
          </span>
        </nav>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
          <h2 className="text-2xl font-bold">
            {isEdit ? "Edit Trip" : "Create New Trip"}
          </h2>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Trip title"
            className="border px-3 py-2 rounded w-full"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={4}
            className="border px-3 py-2 rounded w-full"
          />

          {/* Place selection */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search place"
            className="border px-3 py-2 rounded w-full"
          />
          {search &&
            filtered.map((p) => (
              <div
                key={p.id}
                className="border rounded px-3 py-2 cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setForm((prev) => ({
                    ...prev,
                    place_id: p.id,
                    category: p.category,
                  }));
                  setSearch(p.name);
                }}
              >
                {p.name}{" "}
                <span className="text-sm text-gray-500">({p.category})</span>
              </div>
            ))}

          <input
            value={form.category}
            readOnly
            placeholder="Category"
            className="border px-3 py-2 rounded w-full bg-gray-100"
          />

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          {/* Duration and Price */}
          <input
            name="duration"
            value={form.duration}
            readOnly
            placeholder="Duration (days)"
            className="border px-3 py-2 rounded w-full bg-gray-100"
          />

          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="border px-3 py-2 rounded w-full"
          />

          <input
            name="max_people"
            value={form.max_people}
            onChange={handleChange}
            placeholder="Max people"
            type="number"
            className="border px-3 py-2 rounded w-full"
          />

          {/* Existing Images preview */}
          {form.existingImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.existingImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img} // URL from backend
                    alt="existing"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(idx)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New Images preview */}
          {form.newImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.newImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(idx)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          <input type="file" multiple onChange={handleChange} />

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
            >
              {loading ? "Saving..." : isEdit ? "Update Trip" : "Create Trip"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="border px-4 py-2 rounded w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
