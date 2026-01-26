import React, { useEffect, useState, useRef } from "react";
import {
  FaUserCircle,
  FaStar,
  FaEdit,
  FaCamera,
  FaHeart,
  FaComment,
  FaMapMarkerAlt,
  FaCalendar,
  FaTrash,
  FaEnvelope,
  FaUser,
  FaBirthdayCake,
  FaCalendarPlus,
  FaSignInAlt,
  FaTimes,
  FaCheck,
  FaExternalLinkAlt,
} from "react-icons/fa";

import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/utils/cropImage";
import ReviewsTab from "./components/ReviewsTab";
import AchievementTab from "./components/AchievementTab";

const UserProfile = () => {
  // State declarations (moved inside component)
  const [cropSrc, setCropSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [placesData, setPlacesData] = useState({});
  const [loadingTab, setLoadingTab] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);
  const [saving, setSaving] = useState(false);
// Add these state declarations with your other states
const [userAchievements, setUserAchievements] = useState([]);
const [userPoints, setUserPoints] = useState(0);
  const fileInputRef = useRef(null);

  // Helper to get token
  const getToken = () => localStorage.getItem("authToken");

  // Crop complete handler
  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const fetchUserAndActivity = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token found, please login.");

      setLoadingUser(true);

      // Fetch user data
      const userRes = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      if (!userRes.ok)
        throw new Error(userData.error || "Failed to fetch user data");
      setUser(userData.user);

      // Fetch favorites, reviews, ratings in parallel
      const [favRes, comRes, rateRes] = await Promise.all([
        fetch("http://localhost:5000/api/user/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/user/reviews", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/user/ratings", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const favData = await favRes.json();
      const comData = await comRes.json();
      const rateData = await rateRes.json();

      const favoritesArr = Array.isArray(favData.favorites)
        ? favData.favorites
        : [];

      const reviewsArr = Array.isArray(comData.comments)
        ? comData.comments.map((review) => ({
            ...review,
            // ensure images field exists
            images: Array.isArray(review.images) ? review.images : [],
          }))
        : [];

      const ratingsArr = Array.isArray(rateData.ratings)
        ? rateData.ratings
        : [];

      setFavorites(favoritesArr);
      setReviews(reviewsArr);
      setRatings(ratingsArr);

      const allPlaceIds = [
        ...favoritesArr.map((f) => f.place_id),
        ...reviewsArr.map((c) => c.place_id),
        ...ratingsArr.map((r) => r.place_id),
      ];

      const uniquePlaceIds = [...new Set(allPlaceIds)];

      if (uniquePlaceIds.length > 0) {
        const placesRes = await fetch(
          "http://localhost:5000/api/user/places/details",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ placeIds: uniquePlaceIds }),
          }
        );

        if (placesRes.ok) {
          const placesDataJson = await placesRes.json();
          setPlacesData(placesDataJson.places || {});
        }

        const bookingsRes = await fetch(
          "http://localhost:5000/api/bookings/getUserBookings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const bookingsData = await bookingsRes.json();
        setBookings(
          Array.isArray(bookingsData.bookings) ? bookingsData.bookings : []
        );
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoadingUser(false);
    }
  };
  const handleUpdateReview = async (reviewId) => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("review", editingReview.review);
      formData.append("rating", editingReview.rating);

      // Add IDs of images to delete
      deleteImages.forEach((filename) => formData.append("deleteImages[]",filename));

      // Add new images — must use the same field name "images" for Multer
      newImages.forEach((file) => formData.append("images", file));

      const token = localStorage.getItem("authToken");

      const res = await fetch(
        `http://localhost:5000/api/user/review/${reviewId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // refresh reviews and ensure new images show
      await fetchUserAndActivity();

      setEditingReview(null);
      setNewImages([]);
      setDeleteImages([]);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchUserAndActivity();
  }, []);

  // Tab change loading indicator
  useEffect(() => {
    setLoadingTab(true);
    const timer = setTimeout(() => setLoadingTab(false), 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const triggerFileInput = () => fileInputRef.current.click();

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const handleClaimReward = async (achievementId, points) => {
    try {
      const token = getToken();
      const res = await fetch("http://localhost:5000/api/user/achievements/claim", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ achievementId, points }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setUserPoints(data.totalPoints);
        // Show success notification
      }
    } catch (err) {
      console.error(err);
      setError("Failed to claim reward");
    }
  };

  const formatTravelDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={i < rating ? "text-amber-500" : "text-gray-300"}
        size={14}
      />
    ));
  };

  const getPlaceInfo = (placeId) => {
    const place = placesData[placeId] || {};
    return {
      name: place.name || "Unknown Place",
      address: place.location || "",
      image: place.image || "/assets/default-place.jpg",
      type: place.type || "Unknown",
      avgRating: place.avg_rating || 0,
      physicalRating: place.physical_rating || 0,
      slug: place.slug || "#",
    };
  };

  // Handlers
  const handleRemoveFavorite = async (placeId) => {
    if (!window.confirm("Remove this place from favorites?")) return;
    try {
      const token = getToken();
      const res = await fetch("http://localhost:5000/api/user/favorites", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ placeId }),
      });
      if (res.ok)
        setFavorites((prev) => prev.filter((f) => f.place_id !== placeId));
    } catch (err) {
      console.error(err);
      setError("Failed to remove favorite");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const token = getToken();
      const res = await fetch(
        `http://localhost:5000/api/user/reviews/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) setReviews((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error(err);
      setError("Failed to delete comment");
    }
  };

  const handleDeleteRating = async (ratingId) => {
    if (!window.confirm("Delete this rating?")) return;
    try {
      const token = getToken();
      const res = await fetch(
        `http://localhost:5000/api/user/ratings/${ratingId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) setRatings((prev) => prev.filter((r) => r.id !== ratingId));
    } catch (err) {
      console.error(err);
      setError("Failed to delete rating");
    }
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSaveCroppedImage = async () => {
    try {
      const blob = await getCroppedImg(cropSrc, croppedAreaPixels, 512);

      const formData = new FormData();
      formData.append("image", blob, "avatar.jpg");

      setUploading(true);
      const token = getToken();
      const res = await fetch(
        "http://localhost:5000/api/user/upload-profile-picture",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUser((prev) => ({ ...prev, avatar: data.avatar }));
      setCropSrc(null);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimes className="text-red-600 text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Unable to Load Profile
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const tabs = [
    {
      id: "profile",
      icon: <FaUserCircle />,
      label: "Profile Details",
    },
    {
      id: "bookings",
      icon: <FaCalendar />,
      label: `My Bookings (${bookings.length})`,
    },
    {
      id: "favorites",
      icon: <FaHeart />,
      label: `Favorites (${favorites.length})`,
    },
    {
      id: "reviews",
      icon: <FaComment />,
      label: `Reviews (${reviews.length})`,
    },
    {
      id: "achievements",
      icon: <FaStar />,
      label: `Achievements (${reviews.length})`,
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">
              Manage your account and activity
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-50 text-red-700 hover:bg-red-100 font-medium rounded-lg transition-colors whitespace-nowrap border border-red-200"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8 border border-gray-100">
              {/* Profile Picture */}
              <div className="relative mb-8">
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl bg-linear-to-br from-blue-50 to-purple-50">
                  {user.avatar ? (
                    <img
                      src={`http://localhost:5000/uploads/avatars/${user.avatar}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center">
                            <FaUserCircle class="text-8xl text-gray-400" />
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaUserCircle className="text-8xl text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={triggerFileInput}
                  disabled={uploading}
                  className="absolute bottom-2 right-1/2 translate-x-1/2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  {uploading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <FaCamera className="text-lg" />
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfilePictureUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* User Info */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username}
                </h2>
                <p className="text-gray-600 flex items-center justify-center gap-2">
                  <FaEnvelope className="text-gray-400" />
                  {user.email}
                </p>
                <div
                  className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full ${
                    user.isProfileCompleted
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      user.isProfileCompleted ? "bg-green-500" : "bg-amber-500"
                    }`}
                  ></div>
                  <span className="text-sm font-medium">
                    {user.isProfileCompleted
                      ? "Profile Complete"
                      : "Profile Incomplete"}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-linear-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-100">
                  <div className="text-2xl font-bold text-amber-700">
                    {favorites.length}
                  </div>
                  <div className="text-xs text-amber-500 font-medium">
                    Bookings
                  </div>
                </div>
                <div className="text-center p-4 bg-linear-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-100">
                  <div className="text-2xl font-bold text-blue-700">
                    {favorites.length}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">
                    Favorites
                  </div>
                </div>
                <div className="text-center p-4 bg-linear-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-100">
                  <div className="text-2xl font-bold text-purple-700">
                    {reviews.length}
                  </div>
                  <div className="text-xs text-purple-600 font-medium">
                    Reviews
                  </div>
                </div>
                <div className="text-center p-4 bg-linear-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-100">
                  <div className="text-2xl font-bold text-purple-700">
                    {reviews.length}
                  </div>
                  <div className="text-xs text-purple-600 font-medium">
                    Achievements
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-linear-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 shadow-sm"
                        : "hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          activeTab === tab.id
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {tab.icon}
                      </div>
                      <span className="font-medium">{tab.label}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:w-2/3">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaTimes className="text-red-500" />
                  <p className="text-red-700">{error}</p>
                </div>
                <button
                  onClick={() => setError("")}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              </div>
            )}

            {loadingTab ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading content...</p>
              </div>
            ) : (
              <>
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900">
                        Personal Information
                      </h3>
                      <p className="text-gray-600 mt-1">
                        View and manage your account details
                      </p>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaUser className="inline mr-2 text-gray-400" />
                            Username
                          </label>
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 font-medium">
                            {user.username}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaEnvelope className="inline mr-2 text-gray-400" />
                            Email Address
                          </label>
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 font-medium">
                            {user.email}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaBirthdayCake className="inline mr-2 text-gray-400" />
                            Date of Birth
                          </label>
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 font-medium">
                            {formatDate(user.dateOfBirth)}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <div
                            className={`p-4 rounded-xl border ${
                              user.firstName
                                ? "bg-gray-50 border-gray-200"
                                : "bg-amber-50 border-amber-200"
                            }`}
                          >
                            <span className="font-medium">
                              {user.firstName || "Not provided"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <div
                            className={`p-4 rounded-xl border ${
                              user.lastName
                                ? "bg-gray-50 border-gray-200"
                                : "bg-amber-50 border-amber-200"
                            }`}
                          >
                            <span className="font-medium">
                              {user.lastName || "Not provided"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaCalendarPlus className="inline mr-2 text-gray-400" />
                            Member Since
                          </label>
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 font-medium">
                            {formatDate(user.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bookings Tab */}
                {activeTab === "bookings" && (
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900">
                        My Bookings
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Trips you have booked
                      </p>
                    </div>

                    <div className="p-6">
                      {bookings.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaCalendar className="text-gray-400 text-2xl" />
                          </div>
                          <h4 className="text-lg font-medium text-gray-700 mb-2">
                            No bookings yet
                          </h4>
                          <p className="text-gray-500">
                            You haven't booked any trips yet.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {bookings.map((b) => (
                            <div
                              key={b.id}
                              className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-bold text-gray-900">
                                    {b.trip_title}
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                    <FaCalendar className="text-gray-400" />
                                    {formatTravelDate(b.start_at)} →{" "}
                                    {formatTravelDate(b.end_at)}
                                  </p>
                                </div>

                                <span
                                  className={`px-3 py-1 text-xs rounded-full font-semibold ${
                                    b.status === "CONFIRMED"
                                      ? "bg-green-100 text-green-700"
                                      : b.status === "PENDING"
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {b.status}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Seats</p>
                                  <p className="font-medium">{b.seats}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Full Name</p>
                                  <p className="font-medium">{b.full_name}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Phone</p>
                                  <p className="font-medium">{b.phone}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Code</p>
                                  <p className="font-mono font-bold">
                                    {b.attendance_code}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Favorites Tab */}
                {activeTab === "favorites" && (
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900">
                        Favorite Places
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Places you've saved for future visits
                      </p>
                    </div>
                    <div className="p-6">
                      {favorites.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaHeart className="text-gray-400 text-2xl" />
                          </div>
                          <h4 className="text-lg font-medium text-gray-700 mb-2">
                            No favorites yet
                          </h4>
                          <p className="text-gray-500">
                            Start exploring and save your favorite places!
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {favorites.map((fav) => {
                            const place = getPlaceInfo(fav.place_id);
                            return (
                              <div
                                key={fav.place_id}
                                className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow duration-200"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className="font-bold text-gray-900">
                                    {place.name}
                                  </h4>
                                  <button
                                    onClick={() =>
                                      handleRemoveFavorite(fav.place_id)
                                    }
                                    className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remove from favorites"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                                {place.address && (
                                  <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-gray-400" />
                                    {place.address}
                                  </p>
                                )}
                                <div className="flex items-center justify-between mt-4">
                                  <a
                                    href={`/place/${place.slug}`}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                  >
                                    View place{" "}
                                    <FaExternalLinkAlt className="text-xs" />
                                  </a>
                                  <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                    {place.type}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <ReviewsTab
                    reviews={reviews}
                    getPlaceInfo={getPlaceInfo}
                    handleDeleteComment={handleDeleteComment}
                    handleUpdateReview={handleUpdateReview}
                    renderStars={renderStars}
                    formatTravelDate={formatTravelDate}
                    editingReview={editingReview}
                    setEditingReview={setEditingReview}
                    newImages={newImages}
                    setNewImages={setNewImages}
                    deleteImages={deleteImages}
                    setDeleteImages={setDeleteImages}
                    saving={saving}
                    setSaving={setSaving}
                  />
                )}

{activeTab === "achievements" && (
                  <AchievementTab
                  userAchievements={userAchievements}
                  points={userPoints}
                  onClaimReward={handleClaimReward}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {cropSrc && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Crop Profile Picture
            </h3>
            <div className="relative w-full h-72 rounded-lg overflow-hidden">
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                classes={{
                  containerClassName: "rounded-lg",
                  mediaClassName: "rounded-lg",
                }}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zoom
              </label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setCropSrc(null)}
                className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveCroppedImage}
                disabled={uploading}
                className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Uploading...
                  </span>
                ) : (
                  "Save Profile Picture"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
