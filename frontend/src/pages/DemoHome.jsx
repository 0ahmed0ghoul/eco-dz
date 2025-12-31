import React, { useState, useEffect } from 'react';
import { FiArrowRight, FiBriefcase, FiMapPin, FiUsers, FiBell, FiLogIn } from 'react-icons/fi';
import AccountTypeSwitcher from '../components/AccountTypeSwitcher';
import TripsList from '../components/TripsList';
import MyTrips from '../components/MyTrips';
import CreateTrip from '../components/CreateTrip';
import EmailSubscriptions from '../components/EmailSubscriptions';
import AgenciesPage from './Agencies';

export default function DemoHome() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    setIsLoggedIn(!!token);
    if (token) {
      const user = localStorage.getItem('user');
      if (user) {
        setUserProfile(JSON.parse(user));
      }
    }
  }, [token]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-emerald-600">Eco-Tourism Platform</h1>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Eco-Tourism
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover amazing travel agencies and book unforgettable eco-friendly adventures.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <FiBriefcase className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Become an Agency</h3>
              <p className="text-sm text-gray-600 mt-2">Manage trips and connect with travelers</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <FiMapPin className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Explore Trips</h3>
              <p className="text-sm text-gray-600 mt-2">Browse amazing destinations worldwide</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <FiUsers className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Find Agencies</h3>
              <p className="text-sm text-gray-600 mt-2">Discover trusted travel agencies</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <FiBell className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Get Notified</h3>
              <p className="text-sm text-gray-600 mt-2">Receive updates about new trips</p>
            </div>
          </div>

          {/* Login Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mx-auto mb-4">
              <FiLogIn className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Log In or Register</h3>
            <p className="text-gray-600 mb-6">
              Please log in with your account or create a new one to access all features.
            </p>
            <div className="space-y-3">
              <a
                href="/login"
                className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                <FiLogIn className="w-5 h-5" />
                <span>Log In</span>
              </a>
              <a
                href="/register"
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <FiArrowRight className="w-5 h-5" />
                <span>Create Account</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged In View
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-emerald-600">Eco-Tourism Platform</h1>
            <p className="text-sm text-gray-600">Logged in as: {userProfile?.username}</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
              window.location.reload();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200 flex space-x-1">
          <button
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'account'
                ? 'border-b-2 border-emerald-600 text-emerald-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Account Settings
          </button>
          <button
            onClick={() => setActiveTab('trips')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'trips'
                ? 'border-b-2 border-emerald-600 text-emerald-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Browse Trips
          </button>
          {userProfile?.role === 'agency' && (
            <button
              onClick={() => setActiveTab('my-trips')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'my-trips'
                  ? 'border-b-2 border-emerald-600 text-emerald-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              My Trips
            </button>
          )}
          <button
            onClick={() => setActiveTab('agencies')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'agencies'
                ? 'border-b-2 border-emerald-600 text-emerald-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Agencies
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'subscriptions'
                ? 'border-b-2 border-emerald-600 text-emerald-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Email Subscriptions
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {activeTab === 'account' && (
          <div className="py-8">
            <AccountTypeSwitcher />
          </div>
        )}

        {activeTab === 'trips' && (
          <div>
            <TripsList />
          </div>
        )}

        {activeTab === 'my-trips' && (
          <div className="py-8 px-4">
            <MyTrips userProfile={userProfile} />
          </div>
        )}

        {activeTab === 'agencies' && (
          <div>
            <AgenciesPage />
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="py-8 px-4">
            <EmailSubscriptions />
          </div>
        )}
      </div>

      {/* Floating Create Trip Button */}
      <CreateTrip userProfile={userProfile} onTripCreated={() => setActiveTab('trips')} />
    </div>
  );
}
