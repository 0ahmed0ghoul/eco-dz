import React, { useState, useEffect } from 'react';
import { FiBell, FiToggleRight, FiToggleLeft, FiTrash2 } from 'react-icons/fi';

export default function EmailSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (token) {
      fetchSubscriptions();
    }
  }, [token]);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/agency/subscriptions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setSubscriptions(data);
      setError('');
    } catch (err) {
      setError('Error loading subscriptions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscription = async (agencyId) => {
    try {
      const response = await fetch('http://localhost:5000/api/agency/subscriptions/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ agencyId })
      });

      if (response.ok) {
        const data = await response.json();
        setSubscriptions(subscriptions.map(sub =>
          sub.agencyId === agencyId ? data.subscription : sub
        ));
      }
    } catch (err) {
      console.error('Error toggling subscription:', err);
    }
  };

  const removeSubscription = async (agencyId) => {
    try {
      await fetch(`http://localhost:5000/api/agency/favorites/${agencyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSubscriptions(subscriptions.filter(sub => sub.agencyId !== agencyId));
    } catch (err) {
      console.error('Error removing subscription:', err);
    }
  };

  if (!token) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p className="text-blue-800">Please login to manage email subscriptions</p>
      </div>
    );
  }

  if (loading) {
    return <div className="p-6 text-center">Loading subscriptions...</div>;
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <FiBell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No agency subscriptions yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
        <FiBell className="w-6 h-6 text-emerald-600" />
        <span>Email Subscriptions</span>
      </h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {subscriptions.map((sub) => (
          <div key={sub.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">{sub.agencyName}</h4>
              <p className="text-sm text-gray-600">
                {sub.emailNotifications ? '✅ Emails enabled' : '🔕 Emails disabled'}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleSubscription(sub.agencyId)}
                className="text-emerald-600 hover:text-emerald-700 transition-colors"
                title={sub.emailNotifications ? 'Disable emails' : 'Enable emails'}
              >
                {sub.emailNotifications ? (
                  <FiToggleRight className="w-6 h-6" />
                ) : (
                  <FiToggleLeft className="w-6 h-6" />
                )}
              </button>

              <button
                onClick={() => removeSubscription(sub.agencyId)}
                className="text-red-600 hover:text-red-700 transition-colors"
                title="Remove favorite"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-6 p-3 bg-gray-50 rounded">
        💡 Tip: Agencies will send you an email with an unsubscribe button whenever they post new trips. You can manage notifications here or use the unsubscribe link in the email.
      </p>
    </div>
  );
}
