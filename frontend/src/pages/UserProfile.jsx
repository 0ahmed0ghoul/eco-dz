import React, { useEffect, useState, useRef } from 'react';
import { 
  FaUserCircle, FaStar, FaEdit, FaCamera, FaHeart, 
  FaComment, FaMapMarkerAlt, FaCalendar, FaTrash,
  FaEnvelope, FaUser, FaBirthdayCake, FaCalendarPlus,
  FaSignInAlt, FaTimes, FaCheck, FaExternalLinkAlt
} from 'react-icons/fa';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [favorites, setFavorites] = useState([]);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [placesData, setPlacesData] = useState({});
  const [loadingTab, setLoadingTab] = useState(false);

  const fileInputRef = useRef(null);

  // Fetch user and all activity
  useEffect(() => {
    const fetchUserAndActivity = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found, please login.');

        setLoadingUser(true);

        // Fetch user data
        const userRes = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        if (!userRes.ok) throw new Error(userData.error || 'Failed to fetch user data');
        setUser(userData.user);

        // Fetch favorites, comments, ratings in parallel
        const [favRes, comRes, rateRes] = await Promise.all([
          fetch('http://localhost:5000/api/user/favorites', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/user/comments', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/user/ratings', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const favData = await favRes.json();
        const comData = await comRes.json();
        const rateData = await rateRes.json();

        const favoritesList = favData.favorites || [];
        const commentsList = comData.comments || [];
        const ratingsList = rateData.ratings || [];

        setFavorites(favoritesList);
        setComments(commentsList);
        setRatings(ratingsList);

        // Collect all unique placeIds
        const allPlaceIds = [
          ...favoritesList.map(f => f.place_id),
          ...commentsList.map(c => c.place_id),
          ...ratingsList.map(r => r.place_id)
        ];
        const uniquePlaceIds = [...new Set(allPlaceIds)];

        // Fetch place details once
        if (uniquePlaceIds.length > 0) {
          const placesRes = await fetch('http://localhost:5000/api/user/places/details', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ placeIds: uniquePlaceIds }),
          });

          if (placesRes.ok) {
            const placesDataJson = await placesRes.json();
            setPlacesData(placesDataJson.places || {});
          }
        }

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserAndActivity();
  }, []);

  // Tab change loading indicator
  useEffect(() => {
    setLoadingTab(true);
    const timer = setTimeout(() => setLoadingTab(false), 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const triggerFileInput = () => fileInputRef.current.click();

  const formatDate = dateString => dateString ? new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : '-';

  const formatTravelDate = dateString => dateString ? new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }) : 'Not specified';

  const renderStars = rating => 
    Array.from({ length: 5 }, (_, i) => (
      <FaStar 
        key={i} 
        className={i < rating ? 'text-amber-500' : 'text-gray-300'} 
        size={14} 
      />
    ));

  const getPlaceInfo = (placeId) => {
    const place = placesData[placeId] || {};
    return {
      name: place.name || 'Unknown Place',
      address: place.location || '',
      image: place.image || '/assets/default-place.jpg',
      type: place.type || 'Unknown',
      avgRating: place.avg_rating || 0,
      physicalRating: place.physical_rating || 0,
      slug: place.slug || '#',
    };
  };
  
  // Handlers remain the same
  const handleRemoveFavorite = async placeId => {
    if (!window.confirm('Remove this place from favorites?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/user/favorites', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId }),
      });
      if (res.ok) setFavorites(prev => prev.filter(f => f.place_id !== placeId));
    } catch (err) { console.error(err); }
  };

  const handleDeleteComment = async commentId => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/user/comments/${commentId}`, { 
        method: 'DELETE', 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (res.ok) setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) { console.error(err); }
  };

  const handleDeleteRating = async ratingId => {
    if (!window.confirm('Delete this rating?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/user/ratings/${ratingId}`, { 
        method: 'DELETE', 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (res.ok) setRatings(prev => prev.filter(r => r.id !== ratingId));
    } catch (err) { console.error(err); }
  };

  const handleProfilePictureUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('Please upload an image file');
    if (file.size > 5 * 1024 * 1024) return setError('Image size should be less than 5MB');

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/user/upload-profile-picture', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setUser(prev => ({ ...prev, profilePicture: data.profilePictureUrl }));
      setError('');
    } catch (err) { setError(err.message); }
    finally { setUploading(false); }
  };

  if (loadingUser) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
      </div>
    </div>
  );

  if (error && !user) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaTimes className="text-red-600 text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Profile</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Go to Login
        </button>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account and activity</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8 border border-gray-100">
              {/* Profile Picture */}
              <div className="relative mb-8">
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
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
                  className="absolute bottom-2 right-1/2 translate-x-1/2 translate-y-0 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
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
                  {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
                </h2>
                <p className="text-gray-600 flex items-center justify-center gap-2">
                  <FaEnvelope className="text-gray-400" />
                  {user.email}
                </p>
                <div className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full ${user.isProfileCompleted ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                  <div className={`w-2 h-2 rounded-full ${user.isProfileCompleted ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                  <span className="text-sm font-medium">
                    {user.isProfileCompleted ? 'Profile Complete' : 'Profile Incomplete'}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-100">
                  <div className="text-2xl font-bold text-blue-700">{favorites.length}</div>
                  <div className="text-xs text-blue-600 font-medium">Favorites</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-100">
                  <div className="text-2xl font-bold text-purple-700">{comments.length}</div>
                  <div className="text-xs text-purple-600 font-medium">Comments</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-100">
                  <div className="text-2xl font-bold text-emerald-700">{ratings.length}</div>
                  <div className="text-xs text-emerald-600 font-medium">Ratings</div>
                </div>
              </div>

              {/* Tabs */}
              <nav className="space-y-2">
                {[
                  { id: 'profile', icon: <FaUserCircle />, label: 'Profile Details' },
                  { id: 'favorites', icon: <FaHeart />, label: `Favorites (${favorites.length})` },
                  { id: 'comments', icon: <FaComment />, label: `Comments (${comments.length})` },
                  { id: 'ratings', icon: <FaStar />, label: `Ratings (${ratings.length})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 shadow-sm' 
                        : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                      }`}>
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
                <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
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
                {activeTab === 'profile' && (
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
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
                          <div className={`p-4 rounded-xl border ${user.firstName ? 'bg-gray-50 border-gray-200' : 'bg-amber-50 border-amber-200'}`}>
                            <span className="font-medium">{user.firstName || 'Not provided'}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <div className={`p-4 rounded-xl border ${user.lastName ? 'bg-gray-50 border-gray-200' : 'bg-amber-50 border-amber-200'}`}>
                            <span className="font-medium">{user.lastName || 'Not provided'}</span>
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
                {activeTab === 'favorites' && (
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
                          {favorites.map(fav => {
                            const place = getPlaceInfo(fav.place_id);
                            return (
                              <div 
                                key={fav.place_id} 
                                className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow duration-200"
                              >
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
                                  <a 
                                    href={`/place/${place.slug}`}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                  >
                                    View place <FaExternalLinkAlt className="text-xs" />
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

                {/* Comments Tab */}
                {activeTab === 'comments' && (
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900">My Comments</h3>
                      <p className="text-gray-600 mt-1">Reviews and feedback you've shared</p>
                    </div>
                    <div className="p-6">
                      {comments.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaComment className="text-gray-400 text-2xl" />
                          </div>
                          <h4 className="text-lg font-medium text-gray-700 mb-2">No comments yet</h4>
                          <p className="text-gray-500">Share your thoughts on places you've visited!</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {comments.map(c => {
                            const place = getPlaceInfo(c.place_id);
                            return (
                              <div 
                                key={c.id} 
                                className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow duration-200"
                              >
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
                                  <p className="text-gray-800">{c.comment}</p>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                  <a 
                                    href={`/place/${place.slug}`}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                  >
                                    View place <FaExternalLinkAlt className="text-xs" />
                                  </a>
                                  <span className="text-xs text-gray-500">
                                    {formatTravelDate(c.createdAt)}
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

                {/* Ratings Tab */}
                {activeTab === 'ratings' && (
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
                          {ratings.map(r => {
                            const place = getPlaceInfo(r.place_id);
                            return (
                              <div 
                                key={r.id} 
                                className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow duration-200"
                              >
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
                                <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="flex gap-1">
                                        {renderStars(r.rating)}
                                      </div>
                                      <span className="text-lg font-bold text-gray-900">
                                        {r.rating}.0
                                      </span>
                                    </div>
                                    <span className="text-sm px-3 py-1 bg-white text-gray-700 rounded-full border border-amber-200">
                                      Your Rating
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                  <a 
                                    href={`/place/${place.slug}`}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                  >
                                    View place <FaExternalLinkAlt className="text-xs" />
                                  </a>
                                  <span className="text-xs text-gray-500">
                                    {formatTravelDate(r.createdAt)}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;