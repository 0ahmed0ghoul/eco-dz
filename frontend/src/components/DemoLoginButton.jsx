import React, { useState } from 'react';
import { FiLogIn } from 'react-icons/fi';

export default function DemoLoginButton({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);

  const demoLogin = async () => {
    setLoading(true);

    try {
      // Create a demo user
      const demoUser = {
        id: "demo-user-" + Date.now(),
        username: "Demo User",
        email: "demo@ecotourism.com",
        role: "user"
      };

      // Generate a fake JWT token (in real app, this comes from backend)
      const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IiIgKyBEYXRlLm5vdygpLCJ1c2VybmFtZSI6IkRlbW8gVXNlciIsImVtYWlsIjoiZGVtb0BlY290b3VyaXNtLmNvbSJ9.signature";

      // Store in localStorage
      localStorage.setItem("authToken", fakeToken);
      localStorage.setItem("user", JSON.stringify(demoUser));

      alert(`✅ Logged in as: ${demoUser.username}\n\nNow you can:\n1. Switch to Agency\n2. Create Trips\n3. Favorite Agencies\n4. Manage Subscriptions`);

      if (onLoginSuccess) {
        onLoginSuccess(demoUser);
      }

      // Refresh page to apply auth state
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      alert("Error during demo login: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={demoLogin}
      disabled={loading}
      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
    >
      <FiLogIn className="w-5 h-5" />
      <span>{loading ? "Logging in..." : "Demo Login"}</span>
    </button>
  );
}
