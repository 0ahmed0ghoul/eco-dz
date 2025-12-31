import React, { useState, useEffect } from 'react';
import backgroundImage from "/assets/background/2.jpg";
import backgroundImage2 from "/assets/background/3.jpg";
import backgroundImage3 from "/assets/background/4.jpg";
import logo from '/assets/images/main-logo.png';
import { useNavigate } from 'react-router-dom';
import TravellerSignupForm from '../../components/forms/TravellerSignupForm.jsx';
import AgencySignupForm from '../../components/forms/AgencySignupForm.jsx';

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
  const [role, setRole] = useState("traveller"); // "traveller" or "agency"
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
      {/* Background */}
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-black/50" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
        {/* Logo */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <img src={logo} className="w-28 h-28 rounded-full border-4 border-white/30" />
        </div>

        {/* Role Switch */}
        <div className="flex mt-14 mb-6 bg-white/10 rounded-xl p-1">
          <button
            onClick={() => setRole("traveller")}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              role === "traveller"
                ? "bg-emerald-600 text-white"
                : "text-gray-300"
            }`}
          >
            Traveller
          </button>
          <button
            onClick={() => setRole("agency")}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              role === "agency"
                ? "bg-emerald-600 text-white"
                : "text-gray-300"
            }`}
          >
            Travel Agency
          </button>
        </div>

        {/* Forms */}
        {role === "traveller" ? (
          <TravellerSignupForm />
        ) : (
          <AgencySignupForm />
        )}
      </div>
    </div>
  );
};

export default Signup;
