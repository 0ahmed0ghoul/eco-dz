import React, { useState } from 'react';
import { FiLogIn, FiUser, FiBriefcase } from 'react-icons/fi';

export default function DemoLogin() {
  const [loading, setLoading] = useState(false);

  const demoLoginRegularUser = () => {
    setLoading(true);
    // Simulate login - store token in localStorage
    const demoToken = 'demo-token-user-regular-' + Date.now();
    const demoUser = {
      id: 'user-1',
      username: 'John Doe',
      email: 'user@example.com',
      role: 'user'
    };
    
    localStorage.setItem('authToken', demoToken);
    localStorage.setItem('user', JSON.stringify(demoUser));
    
    setTimeout(() => {
      setLoading(false);
      alert('✅ Demo Login Successful!\n\nYou are logged in as: Regular User\nEmail: user@example.com\n\nNow you can:\n- View trips\n- Favorite agencies\n- Manage subscriptions');
      window.location.reload();
    }, 500);
  };

  const demoLoginAgency = () => {
    setLoading(true);
    // Simulate agency login
    const demoToken = 'demo-token-agency-' + Date.now();
    const demoUser = {
      id: 'user-2',
      username: 'Desert Dreams Agency',
      email: 'agency@example.com',
      role: 'agency',
      agencyName: 'Desert Dreams Agency',
      agencyDescription: 'Best desert tours in Algeria',
      agencyContact: 'agency@example.com'
    };
    
    localStorage.setItem('authToken', demoToken);
    localStorage.setItem('user', JSON.stringify(demoUser));
    
    setTimeout(() => {
      setLoading(false);
      alert('✅ Demo Login Successful!\n\nYou are logged in as: Agency\nAgency: Desert Dreams Agency\n\nNow you can:\n- Click the floating "New Trip" button\n- Create and post trips\n- See email notifications in console');
      window.location.reload();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Eco-Tourism Demo</h1>
          <p className="text-gray-600">Test the Agency System</p>
        </div>

        {/* Demo Login Cards */}
        <div className="space-y-4">
          {/* Regular User */}
          <button
            onClick={demoLoginRegularUser}
            disabled={loading}
            className="w-full bg-white border-2 border-blue-500 rounded-lg p-6 hover:shadow-lg transition-all hover:border-blue-600 disabled:opacity-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FiUser className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-800">Regular User</h3>
                  <p className="text-sm text-gray-600">user@example.com</p>
                </div>
              </div>
              <FiLogIn className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-3 text-left">
              ✓ Browse trips
              <br/>✓ Favorite agencies
              <br/>✓ Manage subscriptions
            </p>
          </button>

          {/* Agency */}
          <button
            onClick={demoLoginAgency}
            disabled={loading}
            className="w-full bg-white border-2 border-emerald-500 rounded-lg p-6 hover:shadow-lg transition-all hover:border-emerald-600 disabled:opacity-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <FiBriefcase className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-800">Agency Account</h3>
                  <p className="text-sm text-gray-600">Desert Dreams Agency</p>
                </div>
              </div>
              <FiLogIn className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-xs text-gray-500 mt-3 text-left">
              ✓ Create trips
              <br/>✓ Post adventures
              <br/>✓ See email notifications
            </p>
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>💡 Demo Mode:</strong> Click a button above to instantly log in and test the agency system without going through registration.
          </p>
        </div>

        {/* Features List */}
        <div className="mt-8">
          <h3 className="font-bold text-gray-800 mb-3">What You Can Test:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center space-x-2">
              <span className="text-emerald-600">✓</span>
              <span>Switch between Regular User and Agency</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-emerald-600">✓</span>
              <span>Create and publish trips (as Agency)</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-emerald-600">✓</span>
              <span>Browse and favorite agencies</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-emerald-600">✓</span>
              <span>Manage email subscriptions</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-emerald-600">✓</span>
              <span>View email notification logs</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>🔐 Demo accounts are temporary</p>
          <p>Refresh the page to log out</p>
        </div>
      </div>
    </div>
  );
}
