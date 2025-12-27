import React, { useState, useEffect } from 'react';
import backgroundImage from "/assets/background/2.jpg";
import backgroundImage2 from "/assets/background/3.jpg";
import backgroundImage3 from "/assets/background/4.jpg";
import logo from '/assets/images/main-logo.png';
import { useNavigate } from 'react-router-dom';

const backgrounds = [backgroundImage, backgroundImage2, backgroundImage3];

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
  
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }
      navigate("/user/complete-profile", { state: { userId: data.userId } });
  
    } catch (err) {
      setError(err.message); // ✅ show error in UI
    } finally {
      setIsLoading(false);
    }
  };
  
  

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background slideshow */}
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            animation: index === currentIndex ? "zoomIn 8s ease-in-out forwards" : "none",
          }}
        />
      ))}

      <div className="absolute inset-0 bg-black/50"></div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 sm:p-10 border border-white/20 shadow-2xl">
        {/* Logo */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20">
          <img
            src={logo}
            alt="EcoDz - Sustainable Travel in Algeria"
            className="w-28 h-28 object-contain rounded-full shadow-xl border-4 border-white/30"
            loading="lazy"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-12">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 text-gray-300 font-bold"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 text-gray-300 font-bold"
            />
          </div>
          {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
          )}
         
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition duration-300 transform hover:scale-[1.02] shadow-lg ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Link to Login */}
          <p className="text-center text-sm text-gray-300 mt-4">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-emerald-600 hover:text-emerald-700">Sign In</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
