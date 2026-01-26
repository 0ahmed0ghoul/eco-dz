import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaCalendarAlt, FaUpload, FaCheck, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const CompleteProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Handle avatar selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError("");
  };

  // Remove avatar
  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required");
      return;
    }

    if (!dateOfBirth) {
      setError("Date of birth is required");
      return;
    }

    // Validate age (must be at least 18 years old)
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    
    let age = today.getFullYear() - birthDate.getFullYear();
    
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    
    if (age < 18) {
      setError("You must be at least 18 years old");
      return;
    }

    setIsLoading(true);
    setError("");

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You must be logged in");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", firstName.trim());
      formData.append("lastName", lastName.trim());
      formData.append("dateOfBirth", dateOfBirth);
      if (avatarFile) formData.append("avatar", avatarFile);

      const profileRes = await fetch(
        "http://localhost:5000/api/auth/user/complete-profile",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const profileData = await profileRes.json();

      if (!profileRes.ok)
        throw new Error(profileData.error || "Failed to complete profile");

      // Success animation delay
      setTimeout(() => {
        navigate("/user/profile");
      }, 1000);

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-800 mb-2"
          >
            Complete Your Profile
          </motion.h1>
          <p className="text-gray-600">Just a few more details to personalize your experience</p>
          
          {/* Progress indicator */}
          <div className="w-full max-w-md mx-auto mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">Step 2 of 2</span>
              <span className="text-sm font-medium text-gray-500">100%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-2 rounded-full bg-linear-to-r from-blue-500 to-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20"
        >
          <div className="p-8 md:p-10">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Avatar Upload Section */}
              <div className="text-center">
                <label className="block text-lg font-semibold text-gray-700 mb-4">
                  Profile Picture
                </label>
                
                <div className="relative inline-block">
                  <div className="w-40 h-40 mx-auto rounded-full border-4 border-white shadow-xl overflow-hidden bg-linear-to-br from-blue-100 to-purple-100">
                    {avatarPreview ? (
                      <motion.img
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        src={avatarPreview}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaUser className="w-20 h-20 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Upload Button */}
                  <div className="mt-6">
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={isLoading}
                      className="hidden"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
                    >
                      <FaUpload />
                      {avatarPreview ? "Change Photo" : "Upload Photo"}
                    </label>
                    
                    {avatarPreview && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="ml-4 px-4 py-3 text-red-600 hover:text-red-800 transition-colors"
                      >
                        Remove
                      </motion.button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF (Max 5MB)</p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <FaUser className="text-blue-500" />
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isLoading}
                      className="w-full pl-4 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
                      placeholder="Enter your first name"
                    />
                    {firstName && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <FaCheck className="text-green-500" />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <FaUser className="text-blue-500" />
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isLoading}
                      className="w-full pl-4 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
                      placeholder="Enter your last name"
                    />
                    {lastName && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <FaCheck className="text-green-500" />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <FaCalendarAlt className="text-blue-500" />
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      disabled={isLoading}
                      className="w-full pl-4 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
                    />
                    {dateOfBirth && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <FaCheck className="text-green-500" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl">
                <div className="shrink-0 mt-1">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700 cursor-pointer">
                    I agree to the Terms and Conditions
                  </label>
                  <p className="text-gray-600 mt-1">
                    By clicking "Complete Profile", I accept the Terms of Service and Privacy Policy. I confirm that I am at least 18 years old.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Profile
                      <FaArrowRight />
                    </>
                  )}
                </motion.button>
                
                <p className="text-center text-gray-500 text-sm mt-4">
                  You can update this information anytime in your profile settings
                </p>
              </div>
            </form>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 translate-x-16 translate-y-16"></div>
        </motion.div>

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to previous step
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;