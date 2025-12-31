import React, { useState, useEffect } from 'react';
import { FiArrowRight, FiBriefcase, FiMapPin, FiUsers, FiBell } from 'react-icons/fi';
import DemoLoginButton from '../components/DemoLoginButton';
import AccountTypeSwitcher from '../components/AccountTypeSwitcher';
import TripsList from '../components/TripsList';
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
            <span className="text-gray-600">Demo Mode</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to the Agency System Demo
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Test the complete agency management system with trip creation, favorites, and email notifications.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <FiBriefcase className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Switch to Agency</h3>
              <p className="text-sm text-gray-600 mt-2">Convert your account to become a travel agency</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <FiMapPin className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Create Trips</h3>
              <p className="text-sm text-gray-600 mt-2">Post amazing adventures and manage your trips</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <FiUsers className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Find Agencies</h3>
              <p className="text-sm text-gray-600 mt-2">Discover and favorite travel agencies</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <FiBell className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Get Notified</h3>
              <p className="text-sm text-gray-600 mt-2">Receive emails about new trips from agencies</p>
            </div>
          </div>

          {/* Quick Start */}
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Quick Start</h3>
            <p className="text-gray-600 mb-6">
              Click the button below to instantly log in with a demo account and start testing all features.
            </p>
            <DemoLoginButton onLoginSuccess={() => setIsLoggedIn(true)} />
          </div>

          {/* How It Works */}
          <div className="mt-16 text-left max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">How to Test</h3>
            <div className="space-y-6">
              <div className="flex space-x-4">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-emerald-600 text-white font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Click Demo Login</h4>
                  <p className="text-gray-600">Get instantly logged in with a test account</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-emerald-600 text-white font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Switch to Agency (Optional)</h4>
                  <p className="text-gray-600">Convert your account to an agency to create trips</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-emerald-600 text-white font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Create a Trip</h4>
                  <p className="text-gray-600">Click the floating "New Trip" button to create your first adventure</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-emerald-600 text-white font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Browse & Favorite</h4>
                  <p className="text-gray-600">View trips, favorite agencies, manage subscriptions</p>
                </div>
              </div>
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
