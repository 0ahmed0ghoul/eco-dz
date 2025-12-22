import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Ticket,
  Star,
  Globe,
  Phone,
  Mail,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Heart,
  Bookmark
} from "lucide-react";

export default function MonumentDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // If no data passed (user opens page manually)
  if (!state || !state.monument) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800">No Monument Selected</h1>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Sample gallery images (in real app, this would come from monument data)
  const galleryImages = [
    monument.image,
    "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w-800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&auto=format&fit=crop",
  ];

  const monument = {
    ...state.monument,
    location: "Paris, France",
    architect: "Gustave Eiffel",
    builtYear: 1889,
    height: "330 meters",
    openingHours: "9:30 AM - 11:45 PM",
    ticketPrice: "€16-€26",
    website: "www.toureiffel.paris",
    contact: "+33 892 70 12 39",
    email: "contact@toureiffel.paris",
    rating: 4.7,
    reviews: 12843,
    coordinates: { lat: 48.8584, lng: 2.2945 },
    bestTimeToVisit: "April-June, September-October",
    accessibility: true,
    facilities: ["Restrooms", "Restaurant", "Gift Shop", "Elevator"],
    tags: ["Architecture", "History", "Landmark", "UNESCO"]
  };

  // Sample reviews
  const reviews = [
    { id: 1, name: "Alex Johnson", rating: 5, comment: "Breathtaking views! The night lights are magical.", date: "2024-03-15", avatar: "AJ" },
    { id: 2, name: "Maria Garcia", rating: 4, comment: "Very crowded but worth the wait. Book tickets online!", date: "2024-03-10", avatar: "MG" },
    { id: 3, name: "David Chen", rating: 5, comment: "An engineering marvel. The history exhibit was fascinating.", date: "2024-03-05", avatar: "DC" },
  ];

  const handlePrevImage = () => {
    setCurrentGalleryIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentGalleryIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleBookNow = () => {
    alert(`Booking ${monument.name}...`);
    // Implement booking logic
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
        <img
          src={monument.image}
          alt={monument.name}
          className="w-full h-96 object-cover"
        />
        <div className="absolute top-0 left-0 right-0 z-20 p-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-all"
          >
            <ChevronLeft size={20} />
            Back
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">{monument.name}</h1>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <MapPin size={20} />
                  <span>{monument.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={20} className="fill-yellow-400 text-yellow-400" />
                  <span>{monument.rating} ({monument.reviews.toLocaleString()} reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-3 rounded-full ${isLiked ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700'} backdrop-blur-sm`}
              >
                <Heart size={24} className={isLiked ? 'fill-white' : ''} />
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-3 rounded-full ${isBookmarked ? 'bg-blue-500 text-white' : 'bg-white/90 text-gray-700'} backdrop-blur-sm`}
              >
                <Bookmark size={24} className={isBookmarked ? 'fill-white' : ''} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 rounded-full bg-white/90 backdrop-blur-sm text-gray-700"
              >
                <Share2 size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Gallery</h2>
                <span className="text-gray-500">{galleryImages.length} photos</span>
              </div>
              
              {/* Main Gallery Image */}
              <div className="relative mb-4">
                <img
                  src={galleryImages[currentGalleryIndex]}
                  alt={`${monument.name} view ${currentGalleryIndex + 1}`}
                  className="w-full h-96 object-cover rounded-xl cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => setSelectedImage(galleryImages[currentGalleryIndex])}
                />
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                {galleryImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentGalleryIndex(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 ${currentGalleryIndex === index ? 'border-blue-500' : 'border-transparent'}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {monument.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <Calendar className="text-blue-500 mb-2" size={24} />
                  <p className="font-semibold">Built</p>
                  <p className="text-gray-600">{monument.builtYear}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <User className="text-green-500 mb-2" size={24} />
                  <p className="font-semibold">Architect</p>
                  <p className="text-gray-600">{monument.architect}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-purple-500 mb-2 text-xl">📏</div>
                  <p className="font-semibold">Height</p>
                  <p className="text-gray-600">{monument.height}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-orange-500 mb-2 text-xl">⭐</div>
                  <p className="font-semibold">Best Time</p>
                  <p className="text-gray-600">{monument.bestTimeToVisit}</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Visitor Reviews</h2>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-600">
                          {review.avatar}
                        </div>
                        <div>
                          <h4 className="font-semibold">{review.name}</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={`${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">{review.date}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking & Info */}
          <div className="space-y-8">
            {/* Booking Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-6">Plan Your Visit</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="text-blue-200" size={24} />
                  <div>
                    <p className="font-semibold">Opening Hours</p>
                    <p>{monument.openingHours}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Ticket className="text-blue-200" size={24} />
                  <div>
                    <p className="font-semibold">Ticket Price</p>
                    <p className="text-2xl font-bold">{monument.ticketPrice}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors mb-4"
              >
                Book Now
              </button>
              
              <p className="text-center text-blue-200 text-sm">
                Skip the line with online booking
              </p>
            </div>

            {/* Contact & Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact & Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Globe className="text-gray-500" size={20} />
                  <a href={`https://${monument.website}`} className="text-blue-500 hover:underline">
                    {monument.website}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-gray-500" size={20} />
                  <span className="text-gray-700">{monument.contact}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-gray-500" size={20} />
                  <span className="text-gray-700">{monument.email}</span>
                </div>
              </div>

              {/* Facilities */}
              <div className="mt-8">
                <h4 className="font-semibold text-gray-800 mb-3">Facilities</h4>
                <div className="flex flex-wrap gap-2">
                  {monument.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-8">
                <h4 className="font-semibold text-gray-800 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {monument.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Location</h3>
              <div className="bg-gray-200 h-48 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="text-red-500 mx-auto mb-2" />
                  <p className="font-semibold">{monument.location}</p>
                  <p className="text-gray-600 text-sm">Click for directions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20"
          >
            <X size={24} className="text-white" />
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}