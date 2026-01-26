import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTag,
  FaPercent,
  FaFire,
  FaArrowLeft,
  FaShareAlt,
  FaHeart,
  FaLeaf,
  FaShieldAlt,
  FaUsers,
  FaStar,
  FaStore, // Added FaStore icon
} from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function DealDetails() {
  const { id } = useParams();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [organizerInfo, setOrganizerInfo] = useState(null);
  const navigate = useNavigate();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingQty, setBookingQty] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/deals/${id}`);
        if (!res.ok) throw new Error("Deal not found");
        const data = await res.json();
        setDeal(data);

        // Fetch organizer details
        if (data.organizer_id) {
          const orgRes = await fetch(
            `http://localhost:5000/api/users/${data.organizer_id}`
          );
          if (orgRes.ok) {
            const orgData = await orgRes.json();
            setOrganizerInfo(orgData);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDeal();
  }, [id]);

  const handleContactOrganizer = async () => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");

    if (!token || role !== "traveller") {
      navigate("/login", { state: { from: `/deals/${id}` } });
      return;
    }

    try {
      const userRes = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userRes.ok) throw new Error("Failed to fetch current user");
      const { user } = await userRes.json();

      const convRes = await fetch(
        "http://localhost:5000/api/messaging/conversations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ otherUserId: deal.organizer_id }),
        }
      );

      if (!convRes.ok) throw new Error("Failed to start conversation");
      const conversation = await convRes.json();

      navigate("/inbox", {
        state: {
          selectedConversation: conversation.id,
          otherUserId: deal.organizer_id,
          otherUserName: deal.organizer_name,
          currentUserId: user.id,
          dealId: id,
          dealTitle: deal.title,
        },
      });
    } catch (err) {
      toast.error("Failed to start conversation. Please try again.");
      console.error("Error contacting organizer:", err);
    }
  };

  const handleDealBooking = async () => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");

    if (!token || role !== "traveller") {
      navigate("/login", { state: { from: `/deals/${id}` } });
      return;
    }

    if (!bookingPhone || bookingQty < 1) {
      toast.error("Please fill all fields");
      return;
    }

    setBookingLoading(true);

    try {
      const userRes = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userRes.ok) throw new Error("Failed to fetch current user");
      const { user } = await userRes.json();
      setUser(user);
      console.log(user);

      const res = await fetch(
        "http://localhost:5000/api/bookings/deals/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            full_name: user.firstName + " " + user.lastName,
            deal_id: deal.id,
            phone: bookingPhone,
            seats: bookingQty,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Deal booked successfully!");
      setShowBookingModal(false);
      setBookingPhone("");
      setBookingQty(1);
    } catch (err) {
      toast.error(err.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(
      !isFavorite ? "Added to favorites!" : "Removed from favorites!"
    );
  };

  const shareDeal = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `🔥 ${deal.title}`,
          text: `Check out this amazing eco deal: ${deal.description}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const calculateSavings = () => {
    if (!deal.original_price || !deal.discounted_price)
      return { amount: 0, percentage: 0 };
    const savings = deal.original_price - deal.discounted_price;
    const percentage = Math.round((savings / deal.original_price) * 100);
    return { amount: savings, percentage };
  };

  if (loading) return <LoadingHero />;
  if (error) return <ErrorMessage message={error} />;
  if (!deal) return <ErrorMessage message="Deal not found" />;

  const savings = calculateSavings();
  const startDate = new Date(deal.start_date);
  const endDate = new Date(deal.end_date);
  const isUpcoming = startDate > new Date();
  const isActive = startDate <= new Date() && endDate >= new Date();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen"
    >
      {/* Back Navigation */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Deals
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Main Content */}
          <div className="lg:w-2/3 space-y-8">
            {/* Deal Header */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge category={deal.category} />
                {savings.percentage > 0 && (
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-linear-to-r from-red-400 to-red-500 text-white">
                    HOT DEAL
                  </span>
                )}
                {isUpcoming && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-linear-to-r from-amber-500 to-amber-600 text-white">
                    <FaClock className="w-3 h-3 mr-1" />
                    Starting Soon
                  </span>
                )}
              </div>

              <h1 className="h-24 text-4xl sm:text-5xl font-bold bg-linear-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent mb-6">
                {deal.title}
              </h1>

              <p className="text-xl text-gray-600 font-bold leading-relaxed">
                {deal.description}
              </p>
            </div>

            {/* Image Section */}
            {deal.image && (
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={`http://localhost:5000/${deal.deal_image}`}
                  alt={deal.title}
                  className="w-full h-96 object-cover"
                />
                {/* Savings Overlay */}
                {savings.amount > 0 && (
                  <div className="absolute top-6 right-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-linear-to-r from-red-500 to-red-600 rounded-2xl blur-lg" />
                      <div className="relative px-6 py-4 bg-linear-to-r from-red-600 to-red-700 text-white rounded-2xl shadow-2xl">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <FaPercent className="w-5 h-5" />
                            <span className="text-3xl font-bold">
                              {savings.percentage}%
                            </span>
                          </div>
                          <div className="text-xs font-medium">OFF</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Deal Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DetailCard
                icon={<FaCalendarAlt className="w-5 h-5" />}
                title="Dates"
                content={
                  <>
                    <div className="font-semibold text-gray-900">
                      {startDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-gray-500 text-sm">to</div>
                    <div className="font-semibold text-gray-900">
                      {endDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </>
                }
              />

              <DetailCard
                icon={<FaClock className="w-5 h-5" />}
                title="Time Left"
                content={
                  <div className="font-semibold text-2xl text-amber-700">
                    {isActive ? "Active Now" : "Starting Soon"}
                  </div>
                }
              />

              <DetailCard
                icon={<FaLeaf className="w-5 h-5" />}
                title="Sustainability"
                content={
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FaStar className="w-3 h-3 text-amber-500" />
                      <span className="text-sm">Eco-certified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaStar className="w-3 h-3 text-amber-500" />
                      <span className="text-sm">Local impact</span>
                    </div>
                  </div>
                }
              />
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-white rounded-2xl p-6 border border-amber-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Price Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Original Price</span>
                  <span className="text-lg line-through text-gray-400">
                    {deal.original_price?.toLocaleString()} DZD
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-lg font-semibold text-red-600">
                    -{savings.percentage}%
                  </span>
                </div>
                <div className="border-t border-amber-100 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                      Your Price
                    </span>
                    <div className="text-right">
                      <div className="text-3xl font-bold bg-linear-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
                        {deal.discounted_price?.toLocaleString()} DZD
                      </div>
                      <div className="text-sm text-emerald-600 font-medium">
                        You save {savings.amount.toLocaleString()} DZD
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Booking & Organizer */}
          <div className="lg:w-1/3 space-y-6">
            {/* Organizer Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 relative"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Organizer
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="relative z-10">
                    <img
                      src={`http://localhost:5000/uploads/avatars/${deal.organizer_logo}`}
                      alt={deal.organizer_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">
                      {deal.organizer_name}
                    </h4>
                    <p className="text-sm text-gray-500 mb-2">
                      {deal.organizer_email}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaMapMarkerAlt className="w-3 h-3" />
                      <span>Algeria • Verified Organizer</span>
                    </div>
                  </div>
                </div>

                {organizerInfo?.bio && (
                  <p className="text-sm text-gray-600">{organizerInfo.bio}</p>
                )}

                {/* --- NEW BUTTON HERE --- */}
                <button
                  onClick={() => navigate(`/agency/${deal.organizer_id}`)}
                  className="w-full mt-2 py-3 border border-amber-200 bg-amber-50 text-amber-800 font-medium rounded-xl hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
                >
                  <FaStore className="w-4 h-4" />
                  Visit Agency Page
                </button>
              </div>
            </motion.div>

            {/* Action Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl border border-amber-100 p-6 sticky top-24"
            >
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-linear-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent mb-2">
                    {deal.discounted_price?.toLocaleString()} DZD
                  </div>
                  <p className="text-sm text-gray-500">
                    Limited time offer • All inclusive
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="w-full py-4 bg-linear-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg"
                  >
                    Book This Deal
                  </button>
                  <button
                    onClick={handleContactOrganizer}
                    className="w-full py-4 bg-linear-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300"
                  >
                    <FaEnvelope className="inline w-5 h-5 mr-2" />
                    Contact Organizer
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={toggleFavorite}
                      className={`flex-1 py-3 rounded-xl border font-medium transition-all ${
                        isFavorite
                          ? "bg-red-50 border-red-200 text-red-600"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <FaHeart
                        className={`inline w-4 h-4 mr-2 ${
                          isFavorite ? "fill-current" : ""
                        }`}
                      />
                      {isFavorite ? "Saved" : "Save Deal"}
                    </button>
                    <button
                      onClick={shareDeal}
                      className="flex-1 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    >
                      <FaShareAlt className="inline w-4 h-4 mr-2" />
                      Share
                    </button>
                  </div>
                </div>

                {/* Deal Features */}
                <div className="pt-6 border-t border-amber-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    What's Included
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <FaShieldAlt className="w-4 h-4 text-amber-600" />
                      </div>
                      <span>Secure booking guarantee</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <FaLeaf className="w-4 h-4 text-amber-600" />
                      </div>
                      <span>Sustainable travel certified</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Deal Timer (if upcoming) */}
            {isUpcoming && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-linear-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FaClock className="w-5 h-5" />
                  <h4 className="font-semibold">Deal Starts In</h4>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">Coming Soon</div>
                  <p className="text-sm opacity-90">
                    This special offer will be available starting{" "}
                    {startDate.toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold mb-4">Book Deal: {deal.title}</h3>

            <div className="space-y-4">
              <input
                type="tel"
                placeholder="Phone number"
                value={bookingPhone}
                onChange={(e) => setBookingPhone(e.target.value)}
                className="w-full border rounded-lg p-2"
              />

              <input
                type="number"
                min={1}
                value={bookingQty}
                onChange={(e) => setBookingQty(Number(e.target.value))}
                className="w-full border rounded-lg p-2"
                placeholder="Quantity"
              />

              <button
                onClick={handleDealBooking}
                disabled={bookingLoading}
                className="w-full py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700"
              >
                {bookingLoading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ================= Sub Components ================= */
function Badge({ category }) {
  return (
    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-linear-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200">
      <FaTag className="w-3 h-3 mr-2" />
      {category}
    </span>
  );
}

function DetailCard({ icon, title, content }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-amber-100 rounded-lg">
          <div className="text-amber-600">{icon}</div>
        </div>
        <h4 className="font-semibold text-gray-700">{title}</h4>
      </div>
      <div className="text-center space-y-1">{content}</div>
    </div>
  );
}

function LoadingHero() {
  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="h-96 bg-linear-to-r from-amber-100 to-amber-50 rounded-2xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-8 bg-amber-100 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-amber-100 rounded w-full animate-pulse" />
          <div className="h-4 bg-amber-100 rounded w-5/6 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-amber-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorMessage({ message }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-red-100 to-red-50 flex items-center justify-center">
          <FaFire className="w-10 h-10 text-amber-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Deal Not Found
        </h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-linear-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-full hover:from-emerald-700 hover:to-emerald-800 transition-colors"
          >
            <FaArrowLeft className="inline w-4 h-4 mr-2" />
            Go Back
          </button>
          <Link
            to="/deals"
            className="px-6 py-3 bg-white text-emerald-700 font-semibold rounded-full hover:bg-emerald-50 transition-colors border border-emerald-200"
          >
            Browse Deals
          </Link>
        </div>
      </div>
    </div>
  );
}