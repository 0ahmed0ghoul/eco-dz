import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaUsers, FaMoneyBillWave, FaEnvelope } from "react-icons/fa";

export default function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/trips/${id}`);
        if (!res.ok) throw new Error("Trip not found");
        const data = await res.json();
        setTrip(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  const handleContactOrganizer = async () => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role"); // "traveller" or null
  
    if (!token || role !== "traveller") {
      navigate("/login");
      return;
    }
  
    try {
      // 1️⃣ Fetch current user ID
      const userRes = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!userRes.ok) throw new Error("Failed to fetch current user");
      const currentUser = await userRes.json();
      const currentUserId = currentUser.user.id;
  
      // 2️⃣ Create or get conversation with organizer
      const convRes = await fetch("http://localhost:5000/api/messaging/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otherUserId: trip.organizer_id }),
      });
  
      if (!convRes.ok) throw new Error("Failed to start conversation");
      const conversation = await convRes.json();
  
      navigate("/inbox", {
        state: {
          selectedConversation: conversation.id,
          otherUserName: trip.organizer_name,
          otherUserId: trip.organizer_id,
          currentUserId
        }
      });
    } catch (err) {
      console.error("Error contacting organizer:", err);
    }
  };
  
  

  if (loading) return <LoadingHero />;
  if (error) return <ErrorMessage message={error} />;
  if (!trip) return <ErrorMessage message="Trip not found" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-emerald-50"
    >
      {/* Breadcrumb & Trip Info */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="text-sm text-gray-500 mb-4">
          <ol className="flex items-center gap-2">
            <li><Link to="/" className="hover:text-gray-700">Home</Link></li>
            <li>/</li>
            <li><Link to="/trips" className="hover:text-gray-700">Trips</Link></li>
            <li>/</li>
            <li className="font-medium text-gray-700">{trip.title}</li>
          </ol>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-800">{trip.title}</h1>
        <p className="mt-2 max-w-2xl text-gray-600">{trip.description}</p>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <img
          src={`/assets/trips/${trip.image}`}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 capitalize">
          {trip.category}
        </span>
      </div>

      {/* Organizer Info */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-3">
        <h2 className="text-lg font-semibold text-emerald-800">Organizer Information</h2>
        <p className="font-medium text-gray-800">{trip.organizer_name}</p>
        <p className="text-gray-500">{trip.organizer_email}</p>
        <button
          onClick={handleContactOrganizer}
          className="inline-flex items-center gap-2 mt-2 px-5 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-semibold"
        >
          <FaEnvelope /> Contact Organizer
        </button>
      </div>
    </motion.div>
  );
}

/* Skeleton & Error Components */
function LoadingHero() {
  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center animate-pulse p-4">
      <div className="w-full h-72 md:h-96 bg-gray-200 rounded-xl mb-6"></div>
      <div className="h-6 w-1/3 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
    </div>
  );
}
function ErrorMessage({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <p className="text-red-600 text-center font-medium">{message}</p>
    </div>
  );
}
