import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const PlaceOverview = ({ place }) => {
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);

  const authToken = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");
  const canLike = !!authToken && role === "traveller";

  useEffect(() => {
    if (!place?.id) return;

    const fetchLikes = async () => {
      if (!place?.id) return;
    
      try {
        const res = await fetch(`http://localhost:5000/api/places/${place.id}/likes`, {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        });
    
        if (!res.ok) {
          console.error("Failed to fetch likes", await res.text());
          return;
        }
    
        const data = await res.json();
        setLikesCount(data.count || 0);
        setLiked(!!data.likedByUser);
      } catch (err) {
        console.error("Failed to load likes", err);
      }
    };
    

    fetchLikes();
  }, [place?.id, authToken]);

  const handleLike = async () => {
    if (!canLike || loadingLike) return;
  
    setLoadingLike(true);
  
    try {
      const res = await fetch(
        `http://localhost:5000/api/places/${place.id}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
      const data = await res.json();
  
      setLiked(data.liked);
      setLikesCount(data.count);
    } catch (err) {
      console.error("Like failed", err);
    } finally {
      setLoadingLike(false);
    }
  };
  

  if (!place) return null;

  return (
    <section id="overview" className="bg-white text-gray-800">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-500">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="hover:text-gray-700">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link
              to={`/places/${place.category}`}
              className="hover:text-gray-700 capitalize"
            >
              {place.category}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-700 font-medium">{place.name}</li>
        </ol>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative w-full h-[420px] overflow-hidden rounded-xl">
          <img
            src={place.image}
            alt={place.name}
            className="w-full h-full object-cover"
          />

          {/* Likes badge (always visible) */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 shadow">
            <FaHeart className="text-red-500" />
            <span className="font-medium text-sm">
              {likesCount} likes
            </span>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{place.name}</h1>

          {canLike && (
            <button
              onClick={handleLike}
              disabled={loadingLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition
                ${
                  liked
                    ? "bg-red-50 border-red-500 text-red-600"
                    : "border-gray-300 text-gray-600 hover:bg-gray-100"
                }
                ${liked ? "animate-pop" : ""}
              `}
            >
              <FaHeart />
              {liked ? "Liked" : "Like"}
            </button>
          )}
        </div>

        <p className="text-lg text-gray-700">
          {place.description}
        </p>

        <p className="mt-4 text-sm text-gray-500">
          📍 {place.destination || "Location not specified"}
        </p>

        {!canLike && (
          <p className="mt-4 text-sm text-gray-400">
            Login as a traveller to like this place
          </p>
        )}
      </div>
    </section>
  );
};

export default PlaceOverview;
