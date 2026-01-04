import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";

export default function CreateHighlight() {
  const { id } = useParams(); // for edit mode
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    place_id: "",
    title: "",
    description: "",
    button_text: "",
    image: null,
  });

  // Fetch places
  useEffect(() => {
    fetch("http://localhost:5000/api/places")
      .then((r) => r.json())
      .then(setPlaces);
  }, []);

  // Fetch highlight data if editing
  useEffect(() => {
    if (!isEdit) return;
    const token = localStorage.getItem("authToken");
    fetch(`http://localhost:5000/api/agency/highlights/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) =>
        setForm({
          place_id: data.place_id,
          title: data.title,
          description: data.description,
          button_text: data.button_text,
          image: null, // file inputs cannot be prefilled
        })
      );
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    const fd = new FormData();

    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));

    const url = isEdit
      ? `http://localhost:5000/api/agency/highlights/${id}`
      : "http://localhost:5000/api/agency/highlights";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) throw new Error();
      navigate("/agency/dashboard");
    } catch {
      alert(`Failed to ${isEdit ? "update" : "create"} highlight`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500">
          <Link to="/agency/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <Link to="/agency/highlights" className="hover:text-blue-600">
            Highlights
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">
            {isEdit ? "Edit" : "Create"}
          </span>
        </nav>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
          <h2 className="text-2xl font-bold">
            {isEdit ? "Edit Highlight" : "Create New Highlight"}
          </h2>

          <input
            name="title"
            value={form.title}
            placeholder="Highlight title"
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <textarea
            name="description"
            value={form.description}
            placeholder="Description"
            onChange={handleChange}
            rows={4}
            className="border rounded px-3 py-2 w-full"
          />

          <select
            name="place_id"
            value={form.place_id}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Select place</option>
            {places.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            name="button_text"
            value={form.button_text}
            placeholder="Button text (optional)"
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
            >
              {loading ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update Highlight" : "Create Highlight"}
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
