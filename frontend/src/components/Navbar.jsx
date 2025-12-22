import React, { useState, useEffect } from "react";
import { FiSearch, FiUser, FiHeart, FiMail, FiX } from "react-icons/fi";
import logo from "../assets/logos/logo.png";

function Navbar() {
  const [isSignedIn] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Manage recent searches with state
  const [recentSearches, setRecentSearches] = useState([
    "Morocco",
    "Italy",
    "Japan",
  ]);
  const popularSearches = ["Safari", "Beach Holidays", "City Tours"];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown only when clicking outside search container
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-container")) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Delete handler
  const handleDeleteSearch = (item) => {
    setRecentSearches((prev) => prev.filter((search) => search !== item));
  };

  const navLinks = ["Destinations", "Ways to Travel", "Deals", "Map"];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-gray-200 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-white"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          {/* Left side: Logo + Links */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src={logo} alt="EcoDz Logo" className="h-10 lg:h-12" />
              <h2 className="text-2xl lg:text-3xl font-bold text-emerald-600">
                EcoDz
              </h2>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link}
                  className="relative h-16 flex items-center px-2 text-gray-800 font-medium hover:text-emerald-600 transition-colors
                             after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[2px] after:bg-emerald-600 
                             after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-full"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Right side: Search + Icons + Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Search bar */}
            <div className="relative hidden sm:flex flex-col items-start search-container">
              <div className="relative">
                <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder={isSearchFocused ? "Search destinations" : "Search"}
                  onFocus={() => setIsSearchFocused(true)}
                  className={`pl-10 pr-4 py-2 border border-gray-300 rounded-full 
                    focus:outline-none focus:ring-2 focus:ring-emerald-500 
                    transition-all text-gray-800 placeholder-gray-400 bg-white
                    ${isSearchFocused ? "w-64 lg:w-80" : "w-32 lg:w-48"}`}
                />
              </div>

              {/* Dropdown suggestions */}
              {isSearchFocused && (
                <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-md shadow-md p-4 z-50">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">
                    Recent Searches
                  </h4>
                  <ul className="mb-3">
                    {recentSearches.map((item) => (
                      <li
                        key={item}
                        className="flex justify-between items-center text-gray-700 text-sm py-1 hover:text-emerald-600"
                      >
                        <span className="cursor-pointer">{item}</span>
                        <FiX
                          className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer"
                          onMouseDown={() => handleDeleteSearch(item)}
                        />
                      </li>
                    ))}
                    {recentSearches.length === 0 && (
                      <li className="text-gray-400 text-sm italic">
                        No recent searches
                      </li>
                    )}
                  </ul>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">
                    Popular Searches
                  </h4>
                  <ul>
                    {popularSearches.map((item) => (
                      <li
                        key={item}
                        className="text-gray-700 text-sm py-1 hover:text-emerald-600 cursor-pointer"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Icons (hidden on mobile) */}
            <div className="hidden lg:flex items-center gap-3">
              <button className="p-2 rounded-full hover:bg-gray-100 transition">
                <FiHeart className="w-6 h-6 text-gray-700 hover:text-emerald-600" />
              </button>
              {isSignedIn && (
                <button className="p-2 rounded-full hover:bg-gray-100 transition">
                  <FiUser className="w-6 h-6 text-gray-700 hover:text-emerald-600" />
                </button>
              )}
              <button className="p-2 rounded-full hover:bg-gray-100 transition">
                <FiMail className="w-6 h-6 text-gray-700 hover:text-emerald-600" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden flex flex-col justify-center items-center w-10 h-10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span
                className={`block w-6 h-0.5 bg-gray-800 rounded transition-transform duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-gray-800 my-1.5 rounded transition-opacity duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-gray-800 rounded transition-transform duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white shadow-md animate-slide-down">
            <div className="px-4 py-4 space-y-3 flex flex-col">
              {navLinks.map((link) => (
                <button
                  key={link}
                  className="text-gray-800 font-medium py-2 hover:text-emerald-600 text-left"
                >
                  {link}
                </button>
              ))}
              {/* Mobile search */}
              <div className="relative mt-3">
                <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full 
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 
                             text-gray-800 placeholder-gray-400 bg-white w-full"
                />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-16 lg:h-16" />
    </>
  );
}

export default Navbar;
