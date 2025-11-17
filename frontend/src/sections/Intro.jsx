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
    <section id='intro' className={`intro-section ${isVisible ? 'visible' : ''}`} aria-label="Introduction to EcoDz">
      <div className="intro-content">
        <div className="text-content">
          <h1 className="main-title">
            Welcome to <span className="brand-highlight">EcoDz</span>
          </h1>
          <p className="subtitle">
            Your gateway to eco-friendly travel experiences in Algeria. 
            Discover sustainable adventures that respect our planet.
          </p>
          
          <div className="cta-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => scrollToSection('maps')}
              aria-label="Explore interactive maps"
            >
              <span className="btn-icon">🗺️</span>
              Explore Maps
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => scrollToSection('travels')}
              aria-label="View travel offers"
            >
              <span className="btn-icon">✈️</span>
              See Travel Offers
            </button>
          </div>

          {!isSignedIn && (
            <div className="auth-prompt">
              <p>Join our eco-community today!</p>
              <button className="btn btn-outline">Sign Up Free</button>
            </div>
          )}
        </div>

        <div className="image-container">
          <div className="logo-wrapper">
            <img 
              src={logo} 
              alt="EcoDz - Sustainable Travel in Algeria" 
              className="logo-image"
            />
            <div className="floating-elements">
              <div className="floating-element eco-1">🌿</div>
              <div className="floating-element eco-2">🌍</div>
              <div className="floating-element eco-3">🚶‍♂️</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator" aria-hidden="true">
        <span>Scroll to explore</span>
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
}

export default Intro;