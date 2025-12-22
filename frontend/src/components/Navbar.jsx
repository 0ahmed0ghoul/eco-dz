import React, { useState, useEffect } from 'react';
import logo from '../assets/logos/logo.png';
import user from '../assets/icons/user.png';

function Navbar() {
  const [isSignedIn] = useState(true);
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
      setIsMobileMenuOpen(false);
    }
  }

  function handleLogoClick() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSection('home');
  }

  return (
    <>
      {/* Navbar */}
      <nav className={`
        fixed top-0 left-0 w-full z-50
        flex items-center justify-between
        px-4 sm:px-6 lg:px-8
        h-20 lg:h-24
        backdrop-blur-md transition-all duration-300
        ${isScrolled 
          ? 'bg-black/95 shadow-2xl h-16 lg:h-20 opacity-60' 
          : 'bg-gray-800/90'
        }
      `}>
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          
          {/* Logo Section */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={handleLogoClick}
          >
            <img 
              src={logo} 
              alt="EcoDz Logo" 
              className="h-12 lg:h-14 transition-transform duration-300 group-hover:scale-110"
            />
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              <span className="text-emerald-400">E</span>co
              <span className="text-emerald-400">D</span>z
            </h2>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12">
            <button
              className={`
                flex items-center gap-2 font-semibold text-lg
                transition-all duration-300 hover:text-emerald-400
                ${activeSection === 'maps' 
                  ? 'text-emerald-400 transform -translate-y-1' 
                  : 'text-white'
                }
              `}
              onClick={() => scrollToSection('maps')}
            >
              <span className="text-xl">🗺️</span>
              <span>Map</span>
              <span className={`
                block h-0.5 bg-emerald-400 transition-all duration-300
                ${activeSection === 'maps' ? 'w-full' : 'w-0'}
              `} />
            </button>

            <button
              className={`
                flex items-center gap-2 font-semibold text-lg
                transition-all duration-300 hover:text-emerald-400
                ${activeSection === 'travels' 
                  ? 'text-emerald-400 transform -translate-y-1' 
                  : 'text-white'
                }
              `}
              onClick={() => scrollToSection('travels')}
            >
              <span className="text-xl">✈️</span>
              <span>Travels</span>
              <span className={`
                block h-0.5 bg-emerald-400 transition-all duration-300
                ${activeSection === 'travels' ? 'w-full' : 'w-0'}
              `} />
            </button>

            <button
              className={`
                flex items-center gap-2 font-semibold text-lg
                transition-all duration-300 hover:text-emerald-400
                ${activeSection === 'contact' 
                  ? 'text-emerald-400 transform -translate-y-1' 
                  : 'text-white'
                }
              `}
              onClick={() => scrollToSection('contact')}
            >
              <span className="text-xl">📞</span>
              <span>Contact</span>
              <span className={`
                block h-0.5 bg-emerald-400 transition-all duration-300
                ${activeSection === 'contact' ? 'w-full' : 'w-0'}
              `} />
            </button>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4 lg:gap-6">
            {isSignedIn ? (
              <div className="hidden lg:block group relative cursor-pointer">
                <img 
                  src={user} 
                  alt="User Account" 
                  className="w-11 h-11 rounded-full border-2 border-transparent 
                           group-hover:border-emerald-400 transition-all duration-300 
                           group-hover:scale-110"
                />
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                <button 
                  className="px-6 py-2.5 rounded-full border-2 border-emerald-500 
                           text-white font-semibold hover:bg-emerald-500 
                           transition-all duration-300 hover:transform hover:-translate-y-0.5"
                  onClick={() => console.log('Navigate to login')}
                >
                  Login
                </button>
                <button 
                  className="px-6 py-2.5 rounded-full bg-emerald-500 text-white 
                           font-semibold hover:bg-emerald-600 transition-all duration-300 
                           hover:transform hover:-translate-y-0.5 shadow-lg 
                           hover:shadow-emerald-500/30"
                  onClick={() => console.log('Navigate to signup')}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden flex flex-col justify-center items-center w-10 h-10
                       focus:outline-none group"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <span className={`
                block w-6 h-0.5 bg-white rounded-full transition-all duration-300
                ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}
              `} />
              <span className={`
                block w-6 h-0.5 bg-white rounded-full my-1.5 transition-all duration-300
                ${isMobileMenuOpen ? 'opacity-0' : ''}
              `} />
              <span className={`
                block w-6 h-0.5 bg-white rounded-full transition-all duration-300
                ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}
              `} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`
          lg:hidden absolute top-full left-0 w-full
          bg-black/95 backdrop-blur-lg
          transition-all duration-300 overflow-hidden
          ${isMobileMenuOpen 
            ? 'max-h-96 opacity-100 shadow-2xl' 
            : 'max-h-0 opacity-0'
          }
        `}>
          <div className="px-6 py-8 space-y-4">
            <button
              className={`
                flex items-center gap-4 w-full text-left p-4 rounded-xl
                transition-all duration-300
                ${activeSection === 'maps' 
                  ? 'bg-emerald-500/20 text-emerald-400 border-l-4 border-emerald-400' 
                  : 'text-white hover:bg-white/10'
                }
              `}
              onClick={() => scrollToSection('maps')}
            >
              <span className="text-2xl">🗺️</span>
              <span className="text-xl font-semibold">Map</span>
            </button>

            <button
              className={`
                flex items-center gap-4 w-full text-left p-4 rounded-xl
                transition-all duration-300
                ${activeSection === 'travels' 
                  ? 'bg-emerald-500/20 text-emerald-400 border-l-4 border-emerald-400' 
                  : 'text-white hover:bg-white/10'
                }
              `}
              onClick={() => scrollToSection('travels')}
            >
              <span className="text-2xl">✈️</span>
              <span className="text-xl font-semibold">Travels</span>
            </button>

            <button
              className={`
                flex items-center gap-4 w-full text-left p-4 rounded-xl
                transition-all duration-300
                ${activeSection === 'contact' 
                  ? 'bg-emerald-500/20 text-emerald-400 border-l-4 border-emerald-400' 
                  : 'text-white hover:bg-white/10'
                }
              `}
              onClick={() => scrollToSection('contact')}
            >
              <span className="text-2xl">📞</span>
              <span className="text-xl font-semibold">Contact</span>
            </button>

            {!isSignedIn && (
              <div className="pt-6 mt-6 border-t border-gray-700 space-y-3">
                <button 
                  className="w-full py-3.5 rounded-xl border-2 border-emerald-500 
                           text-white font-semibold hover:bg-emerald-500/20 
                           transition-all duration-300"
                  onClick={() => {
                    console.log('Navigate to login');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Login
                </button>
                <button 
                  className="w-full py-3.5 rounded-xl bg-emerald-500 text-white 
                           font-semibold hover:bg-emerald-600 transition-all duration-300"
                  onClick={() => {
                    console.log('Navigate to signup');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </button>
              </div>
            )}

            {isSignedIn && (
              <div className="pt-6 mt-6 border-t border-gray-700">
                <button 
                  className="flex items-center gap-4 w-full text-left p-4 rounded-xl
                           text-white hover:bg-white/10 transition-all duration-300"
                  onClick={() => {
                    console.log('User profile');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <img 
                    src={user} 
                    alt="User Account" 
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">My Profile</p>
                    <p className="text-sm text-gray-400">View account</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind navbar */}
      <div className={isScrolled ? 'h-16 lg:h-20' : 'h-20 lg:h-24'} />
    </>
  );
}

export default Navbar;