import React, { useEffect, useState } from 'react';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaStar,
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaShareAlt,
  FaHeart,
  FaRegHeart,
  FaTag,
  FaClock,
  FaCertificate,
  FaImage,
  FaExternalLinkAlt,
  FaShieldAlt,
  FaTimes,
  FaBell
} from 'react-icons/fa';
import { useParams, Link } from 'react-router-dom';

/* ----------------------------------
   Helpers
----------------------------------- */
const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

/* ----------------------------------
   Component
----------------------------------- */
export default function TravelAgency() {
  const { id } = useParams();

  const [agency, setAgency] = useState(null);
  const [trips, setTrips] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activeTab, setActiveTab] = useState('about');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFollowPopup, setShowFollowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [notificationPrefs, setNotificationPrefs] = useState({
    trips: true,
    deals: true,
    updates: true,
  });

  /* ----------------------------------
     Mock data (replace later with API)
  ----------------------------------- */
  useEffect(() => {
    setTimeout(() => {
      setAgency({
        id,
        username: 'Algerian Adventure Tours',
        firstName: 'Mohammed',
        lastName: 'Benzerga',
        email: 'contact@algerianadventures.dz',
        phone: '+213 770 123 456',
        website: 'https://algerianadventures.dz',
        address: 'Algiers, Algeria',
        verified: true,
        isProfileCompleted: true,
        created_at: '2023-05-15T10:30:00Z',
        description:
          'Specializing in authentic Algerian adventure tours with expert guides.',
      });

      setTrips([
        { id: 1, title: "Tassili N'Ajjer Expedition", price: 450, start_date: '2024-06-15', duration: 5 },
        { id: 2, title: 'Hoggar Mountains Adventure', price: 650, start_date: '2024-07-10', duration: 7 },
      ]);

      setDeals([
        { id: 1, title: 'Early Bird Summer Special', discount: 20, end_date: '2024-05-31', code: 'SUMMER20' },
      ]);

      setLoading(false);
    }, 500);
  }, [id]);

  /* ----------------------------------
     Actions
  ----------------------------------- */
  const toggleNotification = (key) =>
    setNotificationPrefs((p) => ({ ...p, [key]: !p[key] }));

  const handleFollowClick = () => {
    if (isFollowing) return handleUnfollow();
    setShowFollowPopup(true);
  };

  const handleFollowConfirm = async () => {
    setIsSubmitting(true);
    try {
      await sendFollowEmail();
      setIsFollowing(true);
      setShowFollowPopup(false);
      alert(`✅ You are now following ${agency.username}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnfollow = async () => {
    if (!window.confirm(`Unfollow ${agency.username}?`)) return;
    setIsFollowing(false);
  };

  const sendFollowEmail = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Please login first');

    const res = await fetch(
      'http://localhost:5000/api/user/email/follow-confirmation',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agencyId: agency.id,
          notificationPrefs,
        }),
      }
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Email failed');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied!');
  };

  /* ----------------------------------
     Render states
  ----------------------------------- */
  if (loading) return <p className="p-10 text-center">Loading...</p>;

  if (!agency || error)
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">Agency not found</h2>
        <Link to="/agencies" className="text-blue-600 underline">
          Back to agencies
        </Link>
      </div>
    );

  /* ----------------------------------
     UI
  ----------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* FOLLOW MODAL */}
      {showFollowPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold text-lg">Follow {agency.username}</h3>
              <button onClick={() => setShowFollowPopup(false)}>
                <FaTimes />
              </button>
            </div>

            {['trips', 'deals', 'updates'].map((k) => (
              <div
                key={k}
                onClick={() => toggleNotification(k)}
                className={`p-3 border rounded-lg mb-3 cursor-pointer ${
                  notificationPrefs[k] ? 'border-blue-500 bg-blue-50' : ''
                }`}
              >
                <FaBell className="inline mr-2" />
                {k}
              </div>
            ))}

            <button
              disabled={isSubmitting}
              onClick={handleFollowConfirm}
              className="w-full bg-orange-500 text-white py-3 rounded-lg"
            >
              {isSubmitting ? 'Following...' : 'Confirm Follow'}
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-blue-900 text-white p-8">
        <h1 className="text-3xl font-bold">{agency.username}</h1>
        <p>{agency.address}</p>

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleFollowClick}
            className="px-5 py-2 bg-orange-500 rounded-lg flex items-center gap-2"
          >
            {isFollowing ? <FaHeart /> : <FaRegHeart />}
            {isFollowing ? 'Following' : 'Follow'}
          </button>

          <button
            onClick={handleShare}
            className="px-5 py-2 bg-white/20 rounded-lg"
          >
            <FaShareAlt />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex gap-4 mb-6">
          {['about', 'trips', 'deals', 'contact'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded ${
                activeTab === t ? 'bg-blue-600 text-white' : 'bg-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'about' && <p>{agency.description}</p>}

        {activeTab === 'trips' &&
          trips.map((t) => (
            <div key={t.id} className="p-4 bg-white mb-4 rounded shadow">
              <h3 className="font-bold">{t.title}</h3>
              <p>
                {formatDate(t.start_date)} • {t.duration} days • ${t.price}
              </p>
            </div>
          ))}

        {activeTab === 'deals' &&
          deals.map((d) => (
            <div key={d.id} className="p-4 bg-orange-50 mb-4 rounded">
              <strong>{d.discount}% OFF</strong> – {d.title}
            </div>
          ))}

        {activeTab === 'contact' && (
          <div>
            <p>Email: {agency.email}</p>
            <p>Phone: {agency.phone}</p>
          </div>
        )}
      </div>
    </div>
  );
}
