import React, { useState, useEffect } from "react";
import { FiSearch, FiUser, FiHeart, FiMail, FiX, FiChevronRight, FiMenu } from "react-icons/fi";
import logo from "../assets/logos/logo.png";

function Navbar() {
  const [isSignedIn] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarLevel, setSidebarLevel] = useState("main");
  const [selectedMainLink, setSelectedMainLink] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(["Morocco", "Italy", "Japan"]);
  const popularSearches = ["Safari", "Beach Holidays", "City Tours"];

  const navLinks = ["Destinations", "Ways to Travel", "Deals", "Map"];

  const menuData = {
    Destinations: {
      Africa: ["Morocco", "Egypt", "Kenya", "South Africa"],
      Asia: ["Japan", "Thailand", "Vietnam"],
      Europe: ["France", "Italy", "Spain"],
    },
    "Ways to Travel": {
      "Group Tours": ["Classic", "18 to 35s", "Family"],
      "Solo Travel": ["Women-only", "Solo-friendly"],
    },
    Deals: {
      "Last Minute": ["Morocco", "Thailand"],
      "Early Bird": ["Italy", "Japan"],
    },
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-container")) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        setIsSidebarOpen(false);
        setSidebarLevel("main");
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, []);

  const handleDeleteSearch = (item) => {
    setRecentSearches((prev) => prev.filter((search) => search !== item));
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setTimeout(() => {
      setSidebarLevel("main");
      setSelectedMainLink(null);
      setSelectedCategory(null);
    }, 300);
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-gray-200 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          {/* Logo + Desktop Links */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer group">
              <img 
                src={logo} 
                alt="EcoDz Logo" 
                className="h-10 lg:h-12 transition-transform group-hover:scale-105 duration-300" 
              />
              <h2 className="text-2xl lg:text-3xl font-bold text-emerald-600">EcoDz</h2>
            </div>

            {/* Desktop navigation links - always visible */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link}
                  className="relative h-16 flex items-center px-3 text-gray-800 font-medium hover:text-emerald-600 transition-colors
                             after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[2px] after:bg-emerald-600 
                             after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-full"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: Search + Icons */}
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:flex flex-col items-start search-container">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={isSearchFocused ? "Search destinations" : "Search"}
                  onFocus={() => setIsSearchFocused(true)}
                  className={`pl-10 pr-4 py-2.5 border border-gray-300 rounded-full 
                    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                    transition-all duration-300 text-gray-800 placeholder-gray-400 bg-white
                    ${isSearchFocused ? "w-64 lg:w-80 shadow-sm" : "w-32 lg:w-48"}`}
                />
              </div>

              {isSearchFocused && (
                <div className="absolute top-12 left-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Recent Searches</h4>
                  <ul className="mb-3">
                    {recentSearches.map((item) => (
                      <li
                        key={item}
                        className="flex justify-between items-center text-gray-700 text-sm py-2 px-2 hover:bg-gray-50 rounded-md"
                      >
                        <span className="cursor-pointer flex items-center gap-2">
                          <FiSearch className="w-3.5 h-3.5 text-gray-400" />
                          {item}
                        </span>
                        <FiX
                          className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer"
                          onClick={() => handleDeleteSearch(item)}
                        />
                      </li>
                    ))}
                    {recentSearches.length === 0 && (
                      <li className="text-gray-400 text-sm italic py-2">No recent searches</li>
                    )}
                  </ul>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Popular Searches</h4>
                  <ul>
                    {popularSearches.map((item) => (
                      <li
                        key={item}
                        className="text-gray-700 text-sm py-2 px-2 hover:bg-gray-50 hover:text-emerald-600 cursor-pointer rounded-md"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors relative group">
                <FiHeart className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
                <span className="absolute -top-0.5 -right-0.5 bg-emerald-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              {isSignedIn && (
                <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors group">
                  <FiUser className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
                </button>
              )}
              <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors group">
                <FiMail className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
              </button>
            </div>

            {/* Sidebar toggle button - visible on all screen sizes */}
            <button
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors group"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu className="w-6 h-6 text-gray-700 group-hover:text-emerald-600 transition-colors" />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar - Fixed 340px width from right (available on all screen sizes) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeSidebar}
          />
          
          {/* Sidebar container - Fixed 340px width from right */}
          <div className="absolute top-0 right-0 w-[340px] h-full bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img src={logo} alt="EcoDz Logo" className="h-8" />
                <h2 className="text-xl font-bold text-emerald-600">EcoDz</h2>
              </div>
              <button
                onClick={closeSidebar}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <FiX className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Search bar */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full 
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 
                           text-gray-800 placeholder-gray-400 bg-white"
                />
              </div>
            </div>

            {/* Sidebar menu content */}
            <div className="relative h-[calc(100vh-132px)] overflow-hidden">
              {/* Main menu */}
              <div
                className={`absolute top-0 left-0 w-full h-full transition-all duration-300 ${
                  sidebarLevel === "main" 
                    ? "translate-x-0 opacity-100" 
                    : sidebarLevel === "category" 
                    ? "-translate-x-full opacity-0" 
                    : "-translate-x-full opacity-0"
                }`}
              >
                <div className="py-2 px-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Navigation Menu
                  </h3>
                  <div className="space-y-1">
                    {Object.keys(menuData).map((link) => (
                      <button
                        key={link}
                        className="w-full flex items-center justify-between p-3 text-gray-800 font-medium hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors group"
                        onClick={() => {
                          setSelectedMainLink(link);
                          setSidebarLevel("category");
                        }}
                      >
                        <span>{link}</span>
                        <FiChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                      </button>
                    ))}
                    <button className="w-full p-3 text-gray-800 font-medium hover:bg-gray-50 hover:text-emerald-600 rounded-lg transition-colors text-left">
                      Map
                    </button>
                  </div>
                </div>
              </div>

              {/* Category menu */}
              <div
                className={`absolute top-0 left-0 w-full h-full transition-all duration-300 ${
                  sidebarLevel === "category" 
                    ? "translate-x-0 opacity-100" 
                    : sidebarLevel === "main"
                    ? "translate-x-full opacity-0"
                    : "-translate-x-full opacity-0"
                }`}
              >
                <div className="py-2 px-6">
                  <button
                    className="flex items-center gap-2 p-3 text-gray-600 hover:text-gray-800 transition-colors"
                    onClick={() => setSidebarLevel("main")}
                  >
                    <FiChevronRight className="w-5 h-5 rotate-180" />
                    <span>Back to Menu</span>
                  </button>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-2">
                    {selectedMainLink}
                  </h3>
                  <div className="space-y-1">
                    {selectedMainLink &&
                      Object.keys(menuData[selectedMainLink]).map((category) => (
                        <button
                          key={category}
                          className="w-full flex items-center justify-between p-3 text-gray-800 font-medium hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors group"
                          onClick={() => {
                            setSelectedCategory(category);
                            setSidebarLevel("item");
                          }}
                        >
                          <span>{category}</span>
                          <FiChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              {/* Item menu */}
              <div
                className={`absolute top-0 left-0 w-full h-full transition-all duration-300 ${
                  sidebarLevel === "item" 
                    ? "translate-x-0 opacity-100" 
                    : "translate-x-full opacity-0"
                }`}
              >
                <div className="py-2 px-6">
                  <button
                    className="flex items-center gap-2 p-3 text-gray-600 hover:text-gray-800 transition-colors"
                    onClick={() => setSidebarLevel("category")}
                  >
                    <FiChevronRight className="w-5 h-5 rotate-180" />
                    <span>Back to {selectedMainLink}</span>
                  </button>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-2">
                    {selectedCategory}
                  </h3>
                  <div className="space-y-1">
                    {selectedMainLink &&
                      selectedCategory &&
                      menuData[selectedMainLink][selectedCategory].map((item) => (
                        <button
                          key={item}
                          className="w-full p-3 text-gray-800 font-medium hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors text-left"
                        >
                          {item}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 p-4 bg-white">
              <div className="flex items-center justify-between px-2">
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FiHeart className="w-5 h-5 text-gray-700" />
                  </button>
                  {isSignedIn && (
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <FiUser className="w-5 h-5 text-gray-700" />
                    </button>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FiMail className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
                <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
                  {isSignedIn ? "Sign Out" : "Sign In"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16 lg:h-16" />
    </>
  );
}

export default Navbar;