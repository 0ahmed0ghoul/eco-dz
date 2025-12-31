import React, { useState, useEffect } from 'react';
import backgroundImage from "/assets/background/2.jpg";
import backgroundImage2 from "/assets/background/3.jpg";
import backgroundImage3 from "/assets/background/4.jpg";
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '/assets/images/main-logo.png';
const backgrounds = [backgroundImage, backgroundImage2, backgroundImage3];

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const redirectFrom = location.state?.from;
  const redirectMessage = location.state?.message;

  // Cycle backgrounds every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
  
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier, password }),
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.message || "Login failed");
  
      // Save token
<<<<<<< HEAD
      localStorage.setItem("token", data.token);
=======
>>>>>>> 9f30c1c95bd3e6e31521eab5aa07080d5559dec1
      localStorage.setItem("authToken", data.token);
  
      // Redirect to place if coming from place view, otherwise to profile
      if (redirectFrom) {
        navigate(redirectFrom);
      } else if (data.isProfileCompleted === 1) {
        navigate("/user/profile");
      } else {
        navigate("/user/complete-profile", { state: { userId: data.userId } });
      }
  
    } catch (err) {
      setError(err.message);
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
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            animation: index === currentIndex ? "zoomIn 8s ease-in-out forwards" : "none",
          }}
        />
      ))}

      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Login Card */}
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
          {/* Username/Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 text-gray-300 font-bold"
                disabled={isLoading}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
          {redirectMessage && (
            <div className="bg-blue-500/20 border border-blue-500 text-blue-300 px-4 py-2 rounded-lg text-sm">
              ℹ️ {redirectMessage}
            </div>
          )}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 text-gray-300 font-bold"
                disabled={isLoading}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition duration-300 transform hover:scale-[1.02] shadow-lg ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300">
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-emerald-600 hover:text-emerald-700">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
