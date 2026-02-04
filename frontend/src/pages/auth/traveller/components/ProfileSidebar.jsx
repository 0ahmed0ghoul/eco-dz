import React, { useRef } from "react";
import { 
  FaUserCircle, 
  FaCamera, 
  FaEnvelope, 
  FaTimes, 
  FaHeart, 
  FaComment, 
  FaStar 
} from "react-icons/fa";

const ProfileSidebar = ({
  user,
  favoritesLength,
  reviewsLength,
  ratingsLength,
  activeTab,
  setActiveTab,
  triggerFileInput,
  uploading,
}) => {
  const fileInputRef = useRef(null);

  return (
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
            className="absolute bottom-2 right-1/2 translate-x-1/2 translate-y-0 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
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
            onChange={triggerFileInput}
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
          <div className="text-center p-4 bg-linear-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-100">
            <div className="text-2xl font-bold text-blue-700">
              {favoritesLength}
            </div>
            <div className="text-xs text-blue-600 font-medium">Favorites</div>
          </div>
          <div className="text-center p-4 bg-linear-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-100">
            <div className="text-2xl font-bold text-purple-700">
              {reviewsLength}
            </div>
            <div className="text-xs text-purple-600 font-medium">Reviews</div>
          </div>
          <div className="text-center p-4 bg-linear-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-100">
            <div className="text-2xl font-bold text-emerald-700">
              {ratingsLength}
            </div>
            <div className="text-xs text-emerald-600 font-medium">Ratings</div>
          </div>
        </div>

        {/* Tabs */}
        <nav className="space-y-2">
          {[
            { id: "profile", icon: <FaUserCircle />, label: "Profile Details" },
            { id: "favorites", icon: <FaHeart />, label: `Favorites (${favoritesLength})` },
            { id: "reviews", icon: <FaComment />, label: `Reviews (${reviewsLength})` },
            { id: "ratings", icon: <FaStar />, label: `Ratings (${ratingsLength})` },
          ].map((tab) => (
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
                    activeTab === tab.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
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
  );
};

export default ProfileSidebar;
