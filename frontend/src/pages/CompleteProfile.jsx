import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CompleteProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [optOut, setOptOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};

  // If no userId, redirect to login
  if (!userId) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:5000/api/auth/user/${userId}/complete-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          dateOfBirth,
          isProfileCompleted: 1,
          optOut
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to complete profile');

      // Redirect to user profile page after success
      navigate('/user/profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-12">
      <h2 className="text-2xl font-semibold mb-4">Terminer mon inscription</h2>

      <div className="space-y-4">
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>
        )}

        <div>
          <label className="font-medium">Prénom</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="font-medium">Nom</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="font-medium">Date de naissance</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="mt-4">
          <input
            type="checkbox"
            id="optOut"
            checked={optOut}
            onChange={() => setOptOut(!optOut)}
            disabled={isLoading}
          />
          <label htmlFor="optOut" className="ml-2">
            Je ne souhaite pas recevoir de messages promotionnels.
          </label>
        </div>

        <button
          className={`mt-6 w-full bg-pink-500 text-white py-2 rounded ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'En cours...' : 'Accepter et continuer'}
        </button>

        <p className="text-xs text-gray-500 mt-4">
          En cliquant sur Accepter et continuer, j’accepte les Conditions générales et la Politique de confidentialité.
        </p>
      </div>
    </div>
  );
};

export default CompleteProfile;
