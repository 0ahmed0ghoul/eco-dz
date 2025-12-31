import React, { useState } from 'react';
import { FiLogIn } from 'react-icons/fi';

export default function DemoLoginButton({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);

  const demoLogin = async (role = 'user') => {
    setLoading(true);

    try {
      // Try to login with demo credentials first
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: role === 'agency' ? "agency@demo.com" : "user@demo.com",
          password: "demo123"
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        alert(`✅ Logged in as ${role === 'agency' ? 'Agency' : 'User'}!\n\nNow you can test the system.`);
        
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }

        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        // Create demo token with agency indicator
        const demoToken = role === 'agency' 
          ? "demo-agency-token"
          : "demo-user-token";
        
        const demoUser = {
          id: role === 'agency' ? "demo-agency" : "demo-user",
          email: role === 'agency' ? "agency@demo.com" : "demo@demo.com",
          username: role === 'agency' ? "Demo Agency" : "Demo User",
          role: role,
          agencyName: role === 'agency' ? "Demo Travel Agency" : undefined
        };

        localStorage.setItem("authToken", demoToken);
        localStorage.setItem("user", JSON.stringify(demoUser));
        
        alert(`✅ Demo mode activated as ${role === 'agency' ? 'Agency' : 'User'}!`);
        window.location.reload();
      }
    } catch (error) {
      alert("Error during demo login: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => demoLogin('user')}
        disabled={loading}
        className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
      >
        <FiLogIn className="w-5 h-5" />
        <span>{loading ? "Logging in..." : "Demo as User"}</span>
      </button>
      <button
        onClick={() => demoLogin('agency')}
        disabled={loading}
        className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50"
      >
        <FiLogIn className="w-5 h-5" />
        <span>{loading ? "Logging in..." : "Demo as Agency"}</span>
      </button>
    </div>
  );
}
