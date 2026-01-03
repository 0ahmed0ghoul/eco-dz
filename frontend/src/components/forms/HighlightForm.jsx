import { useState } from "react";

export default function HighlightForm({ onSuccess }) {
  const [form, setForm] = useState({
    place_id: "",
    title: "",
    description: "",
    button_text: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    const formData = new FormData();

    Object.entries(form).forEach(([k, v]) => {
      if (v !== "") formData.append(k, v);
    });

    try {
      const response = await fetch("http://localhost:5000/api/agency/highlights", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      onSuccess();
      alert("Highlight created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create highlight.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <input
        type="text"
        name="title"
        placeholder="Highlight title"
        value={form.title}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Description */}
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Place ID */}
      <input
        type="number"
        name="place_id"
        placeholder="Place ID"
        value={form.place_id}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Button Text */}
      <input
        type="text"
        name="button_text"
        placeholder="Button text (optional)"
        value={form.button_text}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Image */}
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleChange}
        className="w-full"
      />

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
      >
        Create Highlight
      </button>
    </div>
  );
}
