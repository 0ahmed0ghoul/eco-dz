import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShareAlt,
  FaHeart,
  FaArrowLeft,
  FaCheckCircle,
  FaLeaf,
  FaShieldAlt,
  FaStar,
  FaUserFriends,
  FaTimes,
  FaStore,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

// --- Constants & Config ---
const API_BASE = "http://localhost:5000";
const ENDPOINTS = {
  TRIPS: (id) => `${API_BASE}/api/trips/${id}`,
  USER_BOOKINGS: `${API_BASE}/api/bookings/getUserBookings`,
  CREATE_BOOKING: `${API_BASE}/api/bookings/create`,
  AUTH_ME: `${API_BASE}/api/auth/me`,
  ORG_INFO: (id) => `${API_BASE}/api/auth/${id}`,
  CONVERSATIONS: `${API_BASE}/api/messaging/conversations`,
  IMG: (path) => `${API_BASE}${path}`,
  AVATAR: (path) => `${API_BASE}/uploads/avatars/${path}`,
};

// --- Custom Hook: Manage Trip Data ---
const useTripData = (id, token) => {
  const [trip, setTrip] = useState(null);
  const [organizerInfo, setOrganizerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userBookings, setUserBookings] = useState([]);

  // Fetch User Bookings
  useEffect(() => {
    if (!token) return;
    fetch(ENDPOINTS.USER_BOOKINGS, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUserBookings(data.bookings || []))
      .catch(() => {}); // Silent fail
  }, [token]);

  // Fetch Trip & Organizer
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        const res = await fetch(ENDPOINTS.TRIPS(id));
        if (!res.ok) throw new Error("Trip not found");
        const data = await res.json();
        setTrip(data);

        if (data.organizer_id) {
          const orgRes = await fetch(ENDPOINTS.ORG_INFO(data.organizer_id), {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (orgRes.ok) setOrganizerInfo(await orgRes.json());
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id, token]);

  const existingBooking = useMemo(
    () => userBookings.find((b) => b.trip_id === Number(id)),
    [userBookings, id]
  );

  return { trip, setTrip, organizerInfo, loading, error, existingBooking };
};

// --- Main Component ---
export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Auth State
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  // Data State
  const { trip, setTrip, organizerInfo, loading, error, existingBooking } =
    useTripData(id, token);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Actions
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: trip.title,
        text: trip.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  const handleContactOrganizer = async () => {
    if (!token || role !== "traveller")
      return navigate("/login", { state: { from: `/trips/${id}` } });

    try {
      const userRes = await fetch(ENDPOINTS.AUTH_ME, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { user } = await userRes.json();

      const convRes = await fetch(ENDPOINTS.CONVERSATIONS, {
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
          otherUserId: trip.organizer_id,
          otherUserName: trip.organizer_name,
          currentUserId: user.id,
          tripId: id,
          tripTitle: trip.title,
        },
      });
    } catch (err) {
      toast.error("Could not contact organizer.");
    }
  };

  if (loading) return <LoadingHero />;
  if (error || !trip)
    return <ErrorMessage message={error || "Trip not found"} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-emerald-50/30"
    >
      {/* Navbar Placeholder / Back Button */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-emerald-700 font-medium hover:text-emerald-800"
          >
            <FaArrowLeft /> Back to Trips
          </button>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* LEFT COLUMN: Content */}
          <div className="lg:w-2/3 space-y-8">
            <TripHeader trip={trip} />
            <TripGallery images={trip.image ? JSON.parse(trip.image) : []} />
            <TripStats trip={trip} />
          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            <OrganizerCard organizer={trip} details={organizerInfo} />

            {/* Booking & Price Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-6 sticky top-24"
            >
              <div className="space-y-6">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-emerald-800">
                      {trip.price?.toLocaleString()} DZD
                    </span>
                    <span className="text-gray-500">/ person</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    All taxes included
                  </p>
                </div>

                <ActionButtons
                  role={role}
                  hasBooked={!!existingBooking}
                  bookingStatus={existingBooking?.status}
                  onBook={() => setShowBookingModal(true)}
                  onContact={handleContactOrganizer}
                  isFavorite={isFavorite}
                  toggleFavorite={() => setIsFavorite(!isFavorite)}
                  onShare={handleShare}
                  organizerId={trip.organizer_id}   // ✅ ADD THIS
                />
                <SafetyBadges />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showBookingModal && (
          <BookingModal
            trip={trip}
            token={token}
            onClose={() => setShowBookingModal(false)}
            onSuccess={(newBooking) => {
              // Update local state to reflect reduced seats
              setTrip((prev) => ({
                ...prev,
                available_seats: prev.available_seats - newBooking.seats,
              }));
              window.location.reload(); // Simple reload to sync all states
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ================= SUB COMPONENTS ================= */

function TripHeader({ trip }) {
  const isUpcoming = new Date(trip.start_date) > new Date();
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Badge label={trip.category} />
        {isUpcoming && (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500 text-white">
            <FaStar className="mr-1" /> Upcoming
          </span>
        )}
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold text-emerald-900 mb-4">
        {trip.title}
      </h1>
      <p className="text-lg text-gray-600 leading-relaxed">
        {trip.description}
      </p>
    </div>
  );
}

function TripGallery({ images }) {
  const [active, setActive] = useState(0);
  if (!images.length) return null;

  return (
    <div className="space-y-4">
      <div className="relative rounded-2xl overflow-hidden shadow-lg h-96">
        <img
          src={ENDPOINTS.IMG(images[active])}
          alt="Trip"
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className={`rounded-lg overflow-hidden border-2 transition-all h-24 ${
                idx === active
                  ? "border-emerald-500 opacity-100"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={ENDPOINTS.IMG(img)}
                alt={`Thumb ${idx}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TripStats({ trip }) {
  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard icon={<FaCalendarAlt />} title="Dates">
        <span className="font-semibold">{formatDate(trip.start_date)}</span> -{" "}
        <span className="font-semibold">{formatDate(trip.end_date)}</span>
      </StatCard>
      <StatCard icon={<FaClock />} title="Duration">
        <span className="text-xl font-bold text-emerald-700">
          {trip.duration} days
        </span>
      </StatCard>
      <StatCard icon={<FaUsers />} title="Group Size">
        <span className="text-xl font-bold text-emerald-700">
          {trip.max_people}
        </span>{" "}
        people
      </StatCard>
      <StatCard icon={<FaLeaf />} title="Eco-Friendly">
        <div className="text-sm">Includes sustainable practices</div>
      </StatCard>
    </div>
  );
}

function OrganizerCard({ organizer, details }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizer</h3>
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={ENDPOINTS.AVATAR(organizer.organizer_logo)}
            onError={(e) =>
              (e.currentTarget.src = "https://via.placeholder.com/64?text=ORG")
            }
            className="w-16 h-16 rounded-full border-4 border-emerald-50 object-cover"
            alt="Org Logo"
          />
          <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-white text-xs">
            <FaCheckCircle />
          </div>
        </div>
        <div>
          <h4 className="font-bold text-gray-900">
            {organizer.organizer_name}
          </h4>
          <p className="text-xs text-gray-500 mb-2">
            {organizer.organizer_email}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <FaMapMarkerAlt /> Algeria
          </div>
        </div>
      </div>
      {details?.bio && (
        <p className="text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100">
          {details.bio}
        </p>
      )}
    </div>
  );
}

function ActionButtons({
  role,
  hasBooked,
  bookingStatus,
  onBook,
  onContact,
  organizerId,
  isFavorite,
  toggleFavorite,
  onShare,
}) {
  const navigate = useNavigate();

  const handleBookClick = () => {
    if (hasBooked) return;
    if (role !== "traveller") {
      toast.error("Please login as a traveller to book.");
      return navigate("/login");
    }
    onBook();
  };

  let btnColor = "bg-emerald-600 hover:bg-emerald-700 text-white";
  let btnText = "Book This Trip";

  if (role !== "traveller" && role !== null) {
    btnColor = "bg-gray-200 text-gray-500 cursor-not-allowed";
  }
  if (hasBooked) {
    btnColor =
      bookingStatus === "CONFIRMED"
        ? "bg-emerald-500 cursor-default"
        : "bg-amber-400 cursor-default";
    btnText =
      bookingStatus === "CONFIRMED" ? "Booking Confirmed" : "Booking Pending";
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleBookClick}
        disabled={hasBooked || (role && role !== "traveller")}
        className={`w-full py-4 font-bold rounded-xl shadow-md transition-all ${btnColor}`}
      >
        {btnText}
      </button>
      {/* --- NEW BUTTON HERE --- */}
      <button
        onClick={() => navigate(`/agency/${organizerId}`)}
        className="w-full mt-2 py-3 border border-amber-200 bg-amber-50 text-amber-800 font-medium rounded-xl hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
      >
        <FaStore className="w-4 h-4" />
        Visit Agency Page
      </button>
      <button
        onClick={onContact}
        disabled={role !== "traveller"}
        className={`w-full py-3 font-semibold rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
          role === "traveller"
            ? "border-emerald-600 text-emerald-700 hover:bg-emerald-50"
            : "border-gray-200 text-gray-400"
        }`}
      >
        <FaEnvelope /> Contact Organizer
      </button>

      <div className="flex gap-3 pt-2">
        <button
          onClick={toggleFavorite}
          className={`flex-1 py-2 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 ${
            isFavorite
              ? "text-red-500 bg-red-50 border-red-200"
              : "text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          <FaHeart className={isFavorite ? "fill-current" : ""} />{" "}
          {isFavorite ? "Saved" : "Save"}
        </button>
        <button
          onClick={onShare}
          className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <FaShareAlt /> Share
        </button>
      </div>
    </div>
  );
}

function BookingModal({ trip, token, onClose, onSuccess }) {
  const [phone, setPhone] = useState("");
  const [seats, setSeats] = useState(1);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!phone) return toast.error("Phone number is required");
    setLoading(true);

    try {
      // 1. Get User Name
      const userRes = await fetch(ENDPOINTS.AUTH_ME, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { user } = await userRes.json();

      // 2. Create Booking
      const res = await fetch(ENDPOINTS.CREATE_BOOKING, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          trip_id: trip.id,
          full_name: `${user.firstName} ${user.lastName}`,
          phone,
          seats,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      toast.success(`Booked! Code: ${data.attendance_code}`);
      onSuccess({ seats, ...data });
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FaTimes />
        </button>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Confirm Booking
        </h3>

        <div className="space-y-4">
          <InputGroup
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={setPhone}
            placeholder="06..."
          />
          <InputGroup
            label="Travellers"
            type="number"
            value={seats}
            onChange={(v) => setSeats(Number(v))}
            min={1}
            max={trip.available_seats}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 ring-emerald-500 outline-none"
              rows="2"
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : `Pay ${trip.price * seats} DZD & Book`}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Generic Helpers ---
const Badge = ({ label }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
    {label}
  </span>
);

const StatCard = ({ icon, title, children }) => (
  <div className="bg-white rounded-xl p-4 border border-emerald-50 shadow-sm flex items-start gap-3">
    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">{icon}</div>
    <div>
      <h4 className="text-sm text-gray-500 font-medium mb-1">{title}</h4>
      <div className="text-gray-900">{children}</div>
    </div>
  </div>
);

const InputGroup = ({ label, onChange, value, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    />
  </div>
);

const SafetyBadges = () => (
  <div className="pt-6 border-t border-emerald-100 space-y-3">
    <div className="flex items-center gap-3 text-xs text-gray-600">
      <FaShieldAlt className="text-emerald-500" /> Secure payment & messaging
    </div>
    <div className="flex items-center gap-3 text-xs text-gray-600">
      <FaUserFriends className="text-emerald-500" /> Verified Organizer
    </div>
  </div>
);

const LoadingHero = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
    <div className="bg-red-50 p-4 rounded-full mb-4">
      <FaMapMarkerAlt className="text-red-500 text-2xl" />
    </div>
    <h3 className="text-xl font-bold mb-2">Error</h3>
    <p className="text-gray-600">{message}</p>
    <Link to="/trips" className="mt-6 text-emerald-600 hover:underline">
      Return to Trips
    </Link>
  </div>
);
