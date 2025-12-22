import React, { useState, useEffect } from 'react';
import '../styles/Navbar.css';
import logo from '../assets/logos/logo.png';
import user from '../assets/icons/user.png';
import { Link } from 'react-router-dom';
function Navbar() {
  const [isSignedIn] = useState(true); // Placeholder for user authentication status
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');


  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle active section tracking
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = ['home', 'maps', 'travels', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScrollSpy);
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
      setIsMobileMenuOpen(false); // Close mobile menu after clicking
    }
  }

  function handleLogoClick() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSection('home');
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="nav-container">
        {/* Logo Section */}
        <Link to={"/"} ><div className="logo-section" onClick={handleLogoClick} style={{cursor: 'pointer'}}>
          <img src={logo} alt="EcoDz Logo" className="logo-img" />
          <h2 className="logo-text">
            <span className="logo-accent">E</span>co
            <span className="logo-accent">D</span>z
          </h2>
        </div>
        </Link>
        

        {/* Desktop Navigation */}
        <nav className="nav-links">
          <a 
            className={`nav-link ${activeSection === 'maps' ? 'active' : ''}`}
            onClick={() => scrollToSection('maps')}
          >
            <span className="nav-icon">🗺️</span>
            Map
          </a>
          <a 
            className={`nav-link ${activeSection === 'travels' ? 'active' : ''}`}
            onClick={() => scrollToSection('travels')}
          >
            <span className="nav-icon">✈️</span>
            Travels
          </a>
         <Link to="/contact" className='nav-link'>
            <span className="nav-icon">📞</span>
            Contact
         </Link>
        </nav>

        {/* User Section */}
        <div className="user-section">
          {isSignedIn ? (
            <div className="user-profile">
              <img 
                src={user} 
                alt="User Account" 
                className="user-avatar"
              />
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn-login" onClick={() => console.log('Navigate to login')}>
                Login
              </button>
              <button className="btn-signup" onClick={() => console.log('Navigate to signup')}>
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className={`menu-line ${isMobileMenuOpen ? 'line-1' : ''}`}></span>
            <span className={`menu-line ${isMobileMenuOpen ? 'line-2' : ''}`}></span>
            <span className={`menu-line ${isMobileMenuOpen ? 'line-3' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <a 
            className={`mobile-nav-link ${activeSection === 'maps' ? 'active' : ''}`}
            onClick={() => scrollToSection('maps')}
          >
            <span className="nav-icon">🗺️</span>
            Map
          </a>
          <a 
            className={`mobile-nav-link ${activeSection === 'travels' ? 'active' : ''}`}
            onClick={() => scrollToSection('travels')}
          >
            <span className="nav-icon">✈️</span>
            Travels
          </a>
          <a 
            className={`mobile-nav-link ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={() => scrollToSection('contact')}
          >
            <span className="nav-icon">📞</span>
            Contact
          </a>
          
          {!isSignedIn && (
            <div className="mobile-auth">
              <button className="btn-login-mobile">Login</button>
              <button className="btn-signup-mobile">Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;