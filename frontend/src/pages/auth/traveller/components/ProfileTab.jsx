import React from "react";
import { FaUser, FaEnvelope, FaBirthdayCake, FaCalendarPlus } from "react-icons/fa";

const ProfileTab = ({ user, formatDate }) => {
  return (
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <div className={`p-4 rounded-xl border ${
              user.firstName ? "bg-gray-50 border-gray-200" : "bg-amber-50 border-amber-200"
            }`}>
              <span className="font-medium">{user.firstName || "Not provided"}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
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
  );
};

export default ProfileTab;
