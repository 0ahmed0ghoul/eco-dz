import React, { useState, useEffect } from 'react';
import '../styles/Intro.css';
import logo from '../assets/images/main-logo.png';

function Intro() {
  const [isSignedIn] = useState(true); // Placeholder for user authentication status
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true);
  }, []);

  function scrollToSection(id) {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <section
      id='intro'
      className={`intro-section ${isVisible ? 'visible' : ''}`}
      aria-label="Introduction to EcoDz"
    >
      <div className="intro-content flex flex-col items-center justify-center text-center relative min-h-[80vh]  px-4">

        {/* Text Content */}
        <div className="text-content relative mt-10" >
          <h1 className="main-title text-5xl font-bold mb-4">
            Welcome to <span className="brand-highlight text-yellow-400">EcoDz</span>
          </h1>

          <p className="subtitle text-lg text-white mb-12 relative z-10">
            Your gateway to eco-friendly travel experiences in Algeria.<br/>
            Discover sustainable adventures that respect our planet.
          </p>

          {/* Logo overlapping subtitle */}
          <div className="image-container absolute -top-10 left-1/2 transform -translate-x-1/2 z-20">
            <img 
              src={logo} 
              alt="EcoDz - Sustainable Travel in Algeria" 
              className="logo-image w-32 h-32 object-contain rounded-full shadow-xl"
            />
          </div>

          {/* CTA Buttons */}
          <div className="cta-buttons flex flex-col sm:flex-row gap-4 justify-center z-10 relative">
            <button 
              className="btn btn-primary px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={() => scrollToSection('maps')}
              aria-label="Explore interactive maps"
            >
              🗺️ Explore Maps
            </button>
            <button 
              className="btn btn-secondary px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={() => scrollToSection('travels')}
              aria-label="View travel offers"
            >
              ✈️ See Travel Offers
            </button>
          </div>

          {/* Sign Up Prompt */}
          {!isSignedIn && (
            <div className="auth-prompt mt-8">
              <p>Join our eco-community today!</p>
              <button className="btn btn-outline px-6 py-2 mt-2 rounded-xl">Sign Up Free</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Intro;
