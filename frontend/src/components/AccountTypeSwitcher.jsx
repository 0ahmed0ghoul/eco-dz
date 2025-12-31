import React, { useState, useEffect } from 'react';
import { FiBriefcase, FiUser, FiArrowRight, FiUpload, FiEdit2, FiX } from 'react-icons/fi';

export default function AccountTypeSwitcher() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditingPicture, setIsEditingPicture] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/agency/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUserProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBecomeAgency = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const formData = new FormData();
      formData.append('agencyName', user.username || 'My Agency');
      formData.append('description', 'Travel Agency');
      formData.append('contact', user.email || '');
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      
      const response = await fetch('http://localhost:5000/api/agency/switch-to-agency', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to become agency');
        console.error('Error response:', data);
        return;
      }

      // Update localStorage with new user data
      const updatedUser = {
        ...user,
        role: 'agency',
        agencyName: data.user.agencyName,
        agencyImage: data.user.agencyImage
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUserProfile(updatedUser);
      alert('🎉 You are now an Agency!');
      window.location.reload();
    } catch (err) {
      console.error('Become agency error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfilePicture = async () => {
    if (!selectedImage) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      const response = await fetch('http://localhost:5000/api/agency/update-profile-picture', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        return;
      }

      const data = await response.json();
      setUserProfile(data.user);
      setSelectedImage(null);
      setImagePreview(null);
      setIsEditingPicture(false);
      alert('Profile picture updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userProfile) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${userProfile.role === 'agency' ? 'bg-emerald-100' : 'bg-blue-100'}`}>
            {userProfile.role === 'agency' ? (
              <FiBriefcase className="w-6 h-6 text-emerald-600" />
            ) : (
              <FiUser className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {userProfile.role === 'agency' ? userProfile.agencyName : userProfile.username}
            </h3>
            <p className="text-gray-600 capitalize">{userProfile.role} Account</p>
            {userProfile.role === 'agency' && userProfile.agencyDescription && (
              <p className="text-sm text-gray-500 mt-1">{userProfile.agencyDescription}</p>
            )}
          </div>
        </div>

        {userProfile.role === 'agency' && (
          <div className="text-emerald-600 font-semibold text-lg flex items-center space-x-2">
            <FiBriefcase className="w-5 h-5" />
            <span>Agency Account</span>
          </div>
        )}
      </div>

      {userProfile.role === 'agency' && (
        <div>
          {/* Agency Profile Picture Section */}
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h4 className="font-semibold text-lg text-gray-800">Agency Profile Picture</h4>
              {!isEditingPicture && (
                <button
                  onClick={() => setIsEditingPicture(true)}
                  className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  <FiEdit2 className="w-4 h-4" />
                  <span>Change Picture</span>
                </button>
              )}
            </div>

            {isEditingPicture ? (
              <div className="border-2 border-dashed border-emerald-300 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="relative inline-block mb-4">
                    <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-lg" />
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="mb-4">
                    <FiUpload className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">Select new profile picture</p>
                  </div>
                )}

                <label className="inline-block mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={(e) => e.currentTarget.parentElement.querySelector('input').click()}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    {selectedImage ? 'Change Image' : 'Browse Files'}
                  </button>
                </label>

                <div className="flex space-x-3">
                  <button
                    onClick={handleUpdateProfilePicture}
                    disabled={!selectedImage || loading}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
                  >
                    {loading ? 'Saving...' : 'Save Picture'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingPicture(false);
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                {userProfile.agencyImage ? (
                  <img src={userProfile.agencyImage} alt="Agency" className="w-40 h-40 object-cover rounded-lg shadow-md" />
                ) : (
                  <div className="w-40 h-40 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center text-white text-5xl font-bold shadow-md">
                    {userProfile.agencyName?.charAt(0).toUpperCase() || 'A'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {userProfile.role !== 'agency' && (
        <div className="border-2 border-dashed border-emerald-300 rounded-lg p-8 text-center bg-emerald-50">
          <div className="mb-6">
            {imagePreview ? (
              <div className="relative inline-block">
                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="mb-4">
                <FiUpload className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Upload Agency Logo</p>
              </div>
            )}
          </div>

          <label className="inline-block">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={(e) => e.currentTarget.parentElement.querySelector('input').click()}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              {selectedImage ? 'Change Image' : 'Browse Files'}
            </button>
          </label>

          <button
            onClick={handleBecomeAgency}
            disabled={loading}
            className="w-full mt-6 flex items-center justify-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 font-semibold"
          >
            <FiBriefcase className="w-5 h-5" />
            <span>{loading ? 'Processing...' : 'Become an Agency'}</span>
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
