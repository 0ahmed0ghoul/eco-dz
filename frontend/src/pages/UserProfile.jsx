import React, { useEffect, useState } from 'react';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found, please login.');

        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to fetch user data');

        setUser(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-12">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>First Name:</strong> {user.firstName || '-'}</p>
      <p><strong>Last Name:</strong> {user.lastName || '-'}</p>
      <p><strong>Date of Birth:</strong> {user.dateOfBirth || '-'}</p>
      <p><strong>Profile Completed:</strong> {user.isProfileCompleted ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default UserProfile;
