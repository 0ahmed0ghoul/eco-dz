import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiClock, FiUsers, FiStar, FiChevronLeft, FiChevronRight, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';

export default function TripBooking() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingData, setBookingData] = useState({
    participants: 1,
    fullName: '',
    email: '',
    phone: ''
  });
  const [bookingError, setBookingError] = useState('');
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchTripDetails();
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/agency/trips/${tripId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trip details');
      }
      const data = await response.json();
      setTrip(data);
      setBookingData(prev => ({
        ...prev,
        fullName: user.username || '',
        email: user.email || ''
      }));
    } catch (err) {
      console.error('Error fetching trip details:', err);
      setBookingError('Trip not found');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (trip.images && trip.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % trip.images.length);
    }
  };

  const prevImage = () => {
    if (trip.images && trip.images.length > 1) {
      const totalImages = trip.images ? trip.images.length : 1;
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  };

  const getCurrentImage = () => {
    if (trip.images && trip.images.length > 0) {
      return trip.images[currentImageIndex];
    }
    return trip.image || null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleParticipantsChange = (e) => {
    const value = Math.min(parseInt(e.target.value) || 1, trip.maxParticipants);
    setBookingData(prev => ({
      ...prev,
      participants: value
    }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingError('');

    if (!token) {
      alert('Please login to book a trip');
      navigate('/login');
      return;
    }

    if (!bookingData.fullName || !bookingData.email || !bookingData.phone) {
      setBookingError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tripId: trip.id,
          participants: bookingData.participants,
          fullName: bookingData.fullName,
          email: bookingData.email,
          phone: bookingData.phone
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setBookingError(data.message || 'Booking failed');
        return;
      }

      alert(`✅ Booking confirmed!\n\nTrip: ${trip.title}\nParticipants: ${bookingData.participants}\n\nA confirmation email has been sent to ${bookingData.email}`);
      navigate('/');
    } catch (err) {
      console.error('Booking error:', err);
      setBookingError('Error creating booking. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading trip details...</div>;
  }

  if (!trip || bookingError) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600 text-lg">{bookingError || 'Trip not found'}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const totalPrice = trip.price * bookingData.participants;
  const availableSeats = trip.maxParticipants - trip.currentParticipants;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium"
      >
        <FiChevronLeft className="w-5 h-5" />
        <span>Back to Trips</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trip Details Section */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="relative h-96 overflow-hidden bg-gray-200 rounded-lg mb-6 group">
            {getCurrentImage() ? (
              <img
                src={getCurrentImage()}
                alt={trip.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-5xl font-bold">
                {trip.title.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Image Navigation */}
            {trip.images && trip.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all"
                >
                  <FiChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all"
                >
                  <FiChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {trip.images.length}
                </div>
              </>
            )}
          </div>

          {/* Trip Thumbnail Gallery */}
          {trip.images && trip.images.length > 1 && (
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              {trip.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === idx ? 'border-emerald-600' : 'border-gray-300'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trip Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{trip.title}</h1>
            <p className="text-gray-600 text-sm mb-4">{trip.agencyName}</p>

            <div className="flex items-center space-x-4 mb-6">
              {trip.rating > 0 && (
                <div className="flex items-center space-x-1">
                  <FiStar className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{trip.rating}</span>
                  <span className="text-gray-600 text-sm">({trip.reviews} reviews)</span>
                </div>
              )}
            </div>

            <p className="text-gray-700 text-lg mb-6">{trip.description}</p>

            {/* Trip Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="flex items-center text-emerald-600 mb-2">
                  <FiMapPin className="w-5 h-5 mr-2" />
                  <span className="text-sm font-semibold">Destination</span>
                </div>
                <p className="text-gray-800 font-medium">{trip.destination}</p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="flex items-center text-emerald-600 mb-2">
                  <FiClock className="w-5 h-5 mr-2" />
                  <span className="text-sm font-semibold">Duration</span>
                </div>
                <p className="text-gray-800 font-medium">{trip.duration} days</p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="flex items-center text-emerald-600 mb-2">
                  <FiCalendar className="w-5 h-5 mr-2" />
                  <span className="text-sm font-semibold">Start Date</span>
                </div>
                <p className="text-gray-800 font-medium">{new Date(trip.startDate).toLocaleDateString()}</p>
              </div>

              <div className={`${availableSeats > 0 ? 'bg-emerald-50' : 'bg-red-50'} p-4 rounded-lg`}>
                <div className={`flex items-center ${availableSeats > 0 ? 'text-emerald-600' : 'text-red-600'} mb-2`}>
                  <FiUsers className="w-5 h-5 mr-2" />
                  <span className="text-sm font-semibold">Available Seats</span>
                </div>
                <p className={`text-2xl font-bold ${availableSeats > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {availableSeats}
                </p>
                <p className="text-xs text-gray-600 mt-1">of {trip.maxParticipants} total</p>
              </div>
            </div>

            {/* Activities */}
            {trip.activities && trip.activities.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Activities</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {trip.activities.map((activity, idx) => (
                    <span key={idx} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Form Section */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            {/* Price Card */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-gray-600 text-sm mb-2">Price per person</p>
              <p className="text-4xl font-bold text-emerald-600 mb-4">${trip.price}</p>
              
              {availableSeats <= 0 ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-center font-medium">
                  No seats available
                </div>
              ) : availableSeats < 3 ? (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-lg text-center text-sm font-medium">
                  Only {availableSeats} seat{availableSeats !== 1 ? 's' : ''} left!
                </div>
              ) : null}
            </div>

            {/* Booking Form */}
            {availableSeats > 0 && (
              <form onSubmit={handleBooking} className="space-y-4">
                {bookingError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {bookingError}
                  </div>
                )}

                {/* Participants */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Participants
                  </label>
                  <input
                    type="number"
                    name="participants"
                    min="1"
                    max={availableSeats}
                    value={bookingData.participants}
                    onChange={handleParticipantsChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Max {availableSeats} available</p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={bookingData.fullName}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={bookingData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={bookingData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                {/* Total Price */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">${trip.price} × {bookingData.participants}</span>
                    <span className="text-2xl font-bold text-emerald-600">${totalPrice}</span>
                  </div>
                  <p className="text-xs text-gray-500">Total amount</p>
                </div>

                {/* Book Button */}
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-bold text-lg"
                >
                  Complete Booking
                </button>

                <p className="text-xs text-gray-500 text-center">
                  You will receive a confirmation email at {bookingData.email}
                </p>
              </form>
            )}

            {/* Agency Contact */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-800 mb-3">Contact Agency</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">
                  <span className="font-semibold">{trip.agencyName}</span>
                </p>
                {trip.agencyContact && (
                  <>
                    <a href={`mailto:${trip.agencyContact}`} className="flex items-center text-emerald-600 hover:text-emerald-700">
                      <FiMail className="w-4 h-4 mr-2" />
                      {trip.agencyContact}
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
