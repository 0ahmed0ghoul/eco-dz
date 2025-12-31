import React, { useState, useEffect } from "react";
import {
  FiMapPin,
  FiClock,
  FiUsers,
  FiStar,
  FiEdit2,
  FiTrash2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function MyTrips({ userProfile }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTrip, setEditingTrip] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});
  const token = localStorage.getItem("authToken");

  const availableActivities = [
    "Hiking",
    "Camel Riding",
    "Camping",
    "Swimming",
    "Snorkeling",
    "Stargazing",
    "Cultural Visit",
    "Wildlife Spotting",
  ];

  useEffect(() => {
    if (userProfile?.id) fetchMyTrips();
  }, [userProfile]);

  const fetchMyTrips = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/agency/agency/${userProfile.id}/trips`
      );
      const data = await res.json();
      setTrips(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (id) => {
    if (!confirm("Delete this trip permanently?")) return;
    await fetch(`http://localhost:5000/api/agency/trips/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setTrips(trips.filter((t) => t.id !== id));
  };

  const openEdit = (trip) => {
    setEditingTrip(trip);
    setEditFormData(trip);
    setSelectedActivities(trip.activities || []);
    setSelectedImages([]);
    setImagePreviews([]);
    setShowEditModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const getImage = (trip) => trip.image;

  if (!userProfile || userProfile.role !== "agency") return null;

  if (loading)
    return <div className="py-20 text-center text-lg">Loading trips…</div>;

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold mb-2">My Trips</h1>
        <p className="text-gray-500 mb-8">Manage your published experiences</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {trips.map((trip) => {
            const soldOut =
              trip.currentParticipants >= trip.maxParticipants;

            return (
              <div
                key={trip.id}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
              >
                {/* IMAGE */}
                <div className="relative h-52 overflow-hidden group">
                  <img
                    src={getImage(trip)}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {soldOut && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur flex items-center justify-center">
                      <span className="text-4xl font-black text-red-500">
                        SOLD OUT
                      </span>
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{trip.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {trip.description}
                  </p>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-emerald-600" />
                      {trip.destination}
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock className="text-emerald-600" />
                      {trip.duration} days
                    </div>
                    <div className="flex items-center gap-2">
                      <FiUsers className="text-emerald-600" />
                      {trip.currentParticipants}/{trip.maxParticipants}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-5">
                    <span className="text-2xl font-bold text-emerald-600">
                      ${trip.price}
                    </span>
                    <div className="flex items-center gap-1">
                      <FiStar className="text-yellow-400 fill-current" />
                      <span>{trip.rating || 0}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => openEdit(trip)}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 transition"
                    >
                      <FiEdit2 /> Edit
                    </button>
                    <button
                      onClick={() => deleteTrip(trip.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 py-2 rounded-xl hover:bg-red-200 transition"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">Edit Trip</h2>
              <button onClick={() => setShowEditModal(false)}>
                <FiX size={22} />
              </button>
            </div>

            <form className="p-6 space-y-4">
              <input
                className="w-full border rounded-lg p-2"
                value={editFormData.title || ""}
                placeholder="Trip title"
              />

              <textarea
                className="w-full border rounded-lg p-2"
                rows={4}
                value={editFormData.description || ""}
              />

              <input type="file" multiple onChange={handleImageChange} />

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {imagePreviews.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      className="h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 border py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
