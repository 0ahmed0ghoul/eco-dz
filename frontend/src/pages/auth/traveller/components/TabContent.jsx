import React from "react";
import { FaTimes, FaHeart, FaComment, FaMapMarkerAlt, FaTrash, FaStar, FaExternalLinkAlt, FaCalendarPlus, FaUser, FaEnvelope, FaBirthdayCake } from "react-icons/fa";

const TabContent = ({
  activeTab,
  loadingTab,
  error,
  setError,
  user,
  favorites,
  reviews,
  ratings,
  getPlaceInfo,
  formatDate,
  formatTravelDate,
  renderStars,
  handleRemoveFavorite,
  handleDeleteComment,
  handleDeleteRating,
}) => {
  if (loadingTab) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading content...</p>
      </div>
    );
  }

  return (
    <>
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

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">
              Personal Information
            </h3>
            <p className="text-gray-600 mt-1">View and manage your account details</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <div className={`p-4 rounded-xl border ${
                  user.firstName ? "bg-gray-50 border-gray-200" : "bg-amber-50 border-amber-200"
                }`}>
                  <span className="font-medium">{user.firstName || "Not provided"}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <div className={`p-4 rounded-xl border ${
                  user.lastName ? "bg-gray-50 border-gray-200" : "bg-amber-50 border-amber-200"
                }`}>
                  <span className="font-medium">{user.lastName || "Not provided"}</span>
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

      {/* Favorites Tab */}
      {activeTab === "favorites" && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Favorite Places</h3>
            <p className="text-gray-600 mt-1">Places you've saved for future visits</p>
          </div>
          <div className="p-6">
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHeart className="text-gray-400 text-2xl" />
                </div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">No favorites yet</h4>
                <p className="text-gray-500">Start exploring and save your favorite places!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favorites.map((fav) => {
                  const place = getPlaceInfo(fav.place_id);
                  return (
                    <div key={fav.place_id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-gray-900">{place.name}</h4>
                        <button
                          onClick={() => handleRemoveFavorite(fav.place_id)}
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
                        <a href={`/place/${place.slug}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                          View place <FaExternalLinkAlt className="text-xs" />
                        </a>
                        <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">{place.type}</span>
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
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">My reviews</h3>
            <p className="text-gray-600 mt-1">Reviews and feedback you've shared</p>
          </div>
          <div className="p-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaComment className="text-gray-400 text-2xl" />
                </div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">No reviews yet</h4>
                <p className="text-gray-500">Share your thoughts on places you've visited!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((c) => {
                  const place = getPlaceInfo(c.place_id);
                  return (
                    <div key={c.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">{place.name}</h4>
                          {place.address && (
                            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                              <FaMapMarkerAlt className="text-gray-400" />
                              {place.address}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete comment"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <img
                          className="w-3/12 h-36"
                          src={`http://localhost:5000/uploads/reviews/${c.image}`}
                          alt="review"
                        />
                      </div>
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-800">{c.review}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                          {c.rating}
                        </p>
                        <span className="text-xs text-gray-500">{formatTravelDate(c.created_at)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ratings Tab */}
      {activeTab === "ratings" && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">My Ratings</h3>
            <p className="text-gray-600 mt-1">Places you've rated</p>
          </div>
          <div className="p-6">
            {ratings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaStar className="text-gray-400 text-2xl" />
                </div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">No ratings yet</h4>
                <p className="text-gray-500">Rate places to help other travelers!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ratings.map((r) => {
                  const place = getPlaceInfo(r.place_id);
                  return (
                    <div key={r.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">{place.name}</h4>
                          {place.address && (
                            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                              <FaMapMarkerAlt className="text-gray-400" />
                              {place.address}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteRating(r.id)}
                          className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete rating"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <div className="mt-4 p-4 bg-linear-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1">{renderStars(r.rating)}</div>
                            <span className="text-lg font-bold text-gray-900">{r.rating}.0</span>
                          </div>
                          <span className="text-sm px-3 py-1 bg-white text-gray-700 rounded-full border border-amber-200">Your Rating</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <a href={`/place/${place.slug}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                          View place <FaExternalLinkAlt className="text-xs" />
                        </a>
                        <span className="text-xs text-gray-500">{formatTravelDate(r.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TabContent;
