import { useState, useEffect } from "react";
import "../styles/Intro.css";
import logo from "../assets/images/main-logo.png";

function Intro() {
  const [isSignedIn] = useState(true); // Placeholder for user authentication status
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true);
  }, []);

  function scrollToSection(id) {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section
      id="intro"
      className={`relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      aria-label="Introduction to EcoDz"
      style={{
        background: "linear-gradient(135deg, #134e4a 0%, #166534 100%)"
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-400 rounded-full opacity-10 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-white space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Welcome to <span className="text-emerald-400">EcoDz</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-lg">
            Your gateway to eco-friendly travel experiences in Algeria. Discover
            sustainable adventures that respect our planet.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-green-700 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              onClick={() => scrollToSection("maps")}
              aria-label="Explore interactive maps"
            >
              <span className="text-xl">🗺️</span>
              Explore Maps
            </button>
            <button
              className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-green-700 transition-all duration-300"
              onClick={() => scrollToSection("travels")}
              aria-label="View travel offers"
            >
              <span className="text-xl">✈️</span>
              See Travel Offers
            </button>
          </div>

          {!isSignedIn && (
            <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
              <p className="text-lg mb-4">Join our eco-community today!</p>
              <button className="px-6 py-2 bg-transparent border border-white text-white rounded-full hover:bg-white hover:text-green-700 transition-all duration-300">
                Sign Up Free
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <img
              src={logo}
              alt="EcoDz - Sustainable Travel in Algeria"
              className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="floating-element absolute top-0 left-0 text-4xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>🌿</div>
              <div className="floating-element absolute top-0 right-0 text-4xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>🌍</div>
              <div className="floating-element absolute bottom-0 left-0 text-4xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '3s' }}>🚶‍♂️</div>
            </div>
          </div>
        </div>
      </div>

{/* Scroll indicator */}
        <div
    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-white gap-2"
    aria-hidden="true"
  >
    <span className="text-sm">Scroll to explore</span>
    <div className="text-4xl animate-bounce-custom">↓</div>
  </div>
    </section>
  );
}

export default Intro;