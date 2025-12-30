import React, { useEffect, useState, useRef } from 'react';
import { FaUserCircle, FaStar, FaEdit, FaCamera, FaHeart, FaComment, FaMapMarkerAlt, FaCalendar, FaTrash } from 'react-icons/fa';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [favorites, setFavorites] = useState([]);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [placesData, setPlacesData] = useState({}); // id -> place object
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
          } else {
            console.error('Failed to fetch place details', placesRes.status);
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
    const timer = setTimeout(() => setLoadingTab(false), 300); // short delay for smoother UI
    return () => clearTimeout(timer);
  }, [activeTab]);

  const triggerFileInput = () => fileInputRef.current.click();

  const formatDate = dateString => dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-';
  const formatTravelDate = dateString => dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not specified';
  const renderStars = rating => Array.from({ length: 5 }, (_, i) => <FaStar key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'} size={16} />);

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
  
  // Favorite, comment, rating delete handlers
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
      const res = await fetch(`http://localhost:5000/api/user/comments/${commentId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) { console.error(err); }
  };

  const handleDeleteRating = async ratingId => {
    if (!window.confirm('Delete this rating?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/user/ratings/${ratingId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setRatings(prev => prev.filter(r => r.id !== ratingId));
    } catch (err) { console.error(err); }
  };

  // Profile picture upload
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
      alert('Profile picture updated!');
    } catch (err) { setError(err.message); }
    finally { setUploading(false); }
  };

  if (loadingUser) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  if (error && !user) return <p className="text-red-500 text-center mt-12">{error}</p>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">

        {/* Left Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            {/* Profile Picture */}
            <div className="relative mb-6">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                {user.profilePicture ? <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"><FaUserCircle className="text-6xl text-gray-400" /></div>}
              </div>
              <button onClick={triggerFileInput} disabled={uploading} className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg">
                {uploading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : <FaCamera className="text-lg" />}
              </button>
              <input type="file" ref={fileInputRef} onChange={handleProfilePictureUpload} accept="image/*" className="hidden" />
            </div>

            {/* User Info */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="inline-flex items-center gap-2 mt-2 px-4 py-1 bg-blue-50 rounded-full">
                <div className={`w-2 h-2 rounded-full ${user.isProfileCompleted ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm font-medium">{user.isProfileCompleted ? 'Profile Complete' : 'Profile Incomplete'}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-xl font-bold text-blue-600">{favorites.length}</div>
                <div className="text-xs text-gray-600">Favorites</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-xl font-bold text-purple-600">{comments.length}</div>
                <div className="text-xs text-gray-600">Comments</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-xl font-bold text-green-600">{ratings.length}</div>
                <div className="text-xs text-gray-600">Ratings</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="space-y-1">
              {['profile', 'favorites', 'comments', 'ratings'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left p-3 rounded-xl transition-colors ${activeTab === tab ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    {{
                      profile: <FaUserCircle />,
                      favorites: <FaHeart />,
                      comments: <FaComment />,
                      ratings: <FaStar />
                    }[tab]}
                    <span>{{
                      profile: 'Profile Details',
                      favorites: `Favorite Places (${favorites.length})`,
                      comments: `My Comments (${comments.length})`,
                      ratings: `My Ratings (${ratings.length})`
                    }[tab]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:w-2/3">
          {loadingTab ? <p className="text-center text-gray-500 py-12">Loading...</p> : (
            <>
              {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div><label>Username</label><div className="p-3 bg-gray-50 rounded-xl">{user.username}</div></div>
                    <div><label>Email</label><div className="p-3 bg-gray-50 rounded-xl">{user.email}</div></div>
                    <div><label>Date of Birth</label><div className="p-3 bg-gray-50 rounded-xl">{formatDate(user.dateOfBirth)}</div></div>
                  </div>
                  <div className="space-y-4">
                    <div><label>First Name</label><div className="p-3 bg-gray-50 rounded-xl">{user.firstName || 'Not provided'}</div></div>
                    <div><label>Last Name</label><div className="p-3 bg-gray-50 rounded-xl">{user.lastName || 'Not provided'}</div></div>
                    <div><label>Member Since</label><div className="p-3 bg-gray-50 rounded-xl">{formatDate(user.createdAt)}</div></div>
                  </div>
                </div>
              )}

              {activeTab === 'favorites' && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  {favorites.length === 0 ? <p className="text-center text-gray-500 py-12">No favorites yet</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favorites.map(fav => {
                        const place = getPlaceInfo(fav.place_id);
                        return (
                          <div key={fav.place_id} className="border rounded-xl p-4 hover:shadow-md">
                            <h3 className="font-semibold">{place.name}</h3>
                            {place.address && <p className="text-sm text-gray-600">{place.address}</p>}
                            <button onClick={() => handleRemoveFavorite(fav.place_id)} className="text-red-500">Remove</button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  {comments.length === 0 ? <p className="text-center text-gray-500 py-12">No comments yet</p> : (
                    <div className="space-y-4">
                      {comments.map(c => {
                        const place = getPlaceInfo(c.place_id);
                        return (
                          <div key={c.id} className="border rounded-xl p-4 hover:shadow-md">
                            <h3 className="font-semibold">{place.name}</h3>
                            {place.address && <p className="text-sm text-gray-600">{place.address}</p>}
                            <p className="mt-2">{c.comment}</p>
                            <button onClick={() => handleDeleteComment(c.id)} className="text-red-500 mt-2">Delete</button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'ratings' && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  {ratings.length === 0 ? <p className="text-center text-gray-500 py-12">No ratings yet</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ratings.map(r => {
                        const place = getPlaceInfo(r.place_id);
                        return (
                          <div key={r.id} className="border rounded-xl p-4 hover:shadow-md">
                            <h3 className="font-semibold">{place.name}</h3>
                            {place.address && <p className="text-sm text-gray-600">{place.address}</p>}
                            <div className="flex items-center gap-2 mt-2">{renderStars(r.rating)} <span>{r.rating}.0</span></div>
                            <button onClick={() => handleDeleteRating(r.id)} className="text-red-500 mt-2">Delete</button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
