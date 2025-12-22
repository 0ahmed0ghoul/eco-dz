import React, { useState, useEffect } from 'react';
import logo from '../assets/images/main-logo.png';
import backgroundVideo from '../assets/background/back.mp4';
import backgroundImage from '../assets/background/2.jpg';

function Intro() {
  const [isSignedIn] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  function scrollToSection(id) {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <section
      id="intro"
      className={`
        relative flex flex-col justify-center min-h-screen px-5 overflow-hidden
        bg-gradient-to-br from-blue-100/10 via-emerald-100/10 to-teal-100/10
        bg-center bg-no-repeat bg-cover bg-fixed
        transition-all duration-800 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{
        backgroundImage: videoEnded ? `url(${backgroundImage})` : 'none',
      }}
      aria-label="Introduction to EcoDz"
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30 z-0" />
      
      {/* Background Video */}
      {!videoEnded && (
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          playsInline
          onEnded={() => setVideoEnded(true)}
        >
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[80vh] px-4">
        <div className={`
          relative mt-10 max-w-4xl mx-auto
          ${videoEnded ? 'animate-fadeSlideUp' : 'opacity-0 translate-y-8'}
        `}>
          {/* Logo */}
          <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 z-20">
            <img
              src={logo}
              alt="EcoDz - Sustainable Travel in Algeria"
              className="w-32 h-32 object-contain rounded-full shadow-2xl border-4 border-white/20"
            />
          </div>

          {/* Text Content */}
          <div className="bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-100 to-cyan-100 bg-clip-text text-transparent">
              Welcome to <span className="text-yellow-400 drop-shadow-lg">EcoDz</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 leading-relaxed px-4">
              Your gateway to eco-friendly travel experiences in Algeria.<br className="hidden sm:block" />
              Discover sustainable adventures that respect our planet.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 min-w-[200px]"
                onClick={() => scrollToSection('maps')}
                aria-label="Explore interactive maps"
              >
                <span className="text-xl">🗺️</span>
                <span>Explore Maps</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
              
              <button
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 min-w-[200px]"
                onClick={() => scrollToSection('travels')}
                aria-label="View travel offers"
              >
                <span className="text-xl">✈️</span>
                <span>Travel Offers</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            {/* Auth Prompt */}
            {!isSignedIn && (
              <div className="mt-10 pt-8 border-t border-white/20">
                <p className="text-white/80 mb-4">Join our eco-community today!</p>
                <button className="px-8 py-3 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                  Sign Up Free
                </button>
              </div>
            )}
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl" />
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Intro;