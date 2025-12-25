import React, { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiUser,
  FiHeart,
  FiMail,
  FiX,
  FiChevronRight,
  FiMenu,
} from "react-icons/fi";
import logo from "../assets/logos/logo.png";

function Navbar() {
  const [isSignedIn] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarLevel, setSidebarLevel] = useState("main");
  const [selectedMainLink, setSelectedMainLink] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    "Tassili n'Ajjer",
    "Hoggar Mountains",
    "Kabylia Region",
  ]);
  const [activeNavLink, setActiveNavLink] = useState(null);
  const [selectedCategoryInMegaMenu, setSelectedCategoryInMegaMenu] =
    useState(null);

  const popularSearches = [
    "Desert Safari",
    "Mountain Hiking",
    "Cultural Tours",
    "Eco-Lodges",
  ];
  const megaMenuRef = useRef(null);
  const navLinksRef = useRef({});

  const navLinks = [
    "Destinations",
    "Ways to Travel",
    "Themes",
    "Deals & Offers",
    "Eco-Initiatives",
    "Map",
  ];

  const menuData = {
    Destinations: {
      "Northern Algeria": [
        "Algiers & Coast",
        "Kabylia Region",
        "Tlemcen & West",
        "Constantine & East",
      ],
      "Saharan Algeria": [
        "Tassili n'Ajjer",
        "Hoggar Mountains",
        "Grand Erg Oriental",
        "M'zab Valley",
      ],
      "National Parks": [
        "Chréa National Park",
        "Tassili N'Ajjer Park",
        "Hoggar National Park",
        "El Kala National Park",
      ],
      "Eco-Regions": [
        "Atlas Mountains",
        "Saharan Oases",
        "Mediterranean Coast",
        "High Plateaus",
      ],
      "All Destinations": ["Explore All Destinations"],
    },
    "Ways to Travel": {
      "Eco-Tours": [
        "Guided Nature Walks",
        "Sustainable Safari",
        "Cultural Immersion",
        "Photography Tours",
      ],
      "Adventure Travel": [
        "Desert Trekking",
        "Mountain Hiking",
        "Rock Climbing",
        "Camel Expeditions",
      ],
      "Group Experiences": [
        "Eco-Volunteering",
        "Cultural Exchange",
        "Family Eco-Trips",
        "Student Expeditions",
      ],
      "Solo Travel": [
        "Women-Friendly Tours",
        "Self-Guided Trails",
        "Eco-Retreats",
        "Digital Detox",
      ],
    },
    Themes: {
      "Eco-Activities": [
        "Bird Watching",
        "Botanical Tours",
        "Wildlife Tracking",
        "Stargazing",
      ],
      "Cultural Immersion": [
        "Berber Heritage",
        "Traditional Crafts",
        "Local Cuisine",
        "Nomadic Lifestyle",
      ],
      "Sustainable Travel": [
        "Eco-Lodges",
        "Community Tourism",
        "Conservation Projects",
        "Carbon-Neutral Trips",
      ],
      "Special Interests": [
        "Geology & Fossils",
        "Archaeology Tours",
        "Desert Astronomy",
        "Sustainable Farming",
        "Water Conservation",
        "Renewable Energy",
        "Indigenous Knowledge",
        "Climate Resilience",
      ],
    },
    "Deals & Offers": {
      "Seasonal Offers": [
        "Spring Bloom Tours",
        "Summer Desert Escape",
        "Autumn Harvest",
        "Winter Sun",
      ],
      "Early Bird": [
        "Advance Booking Discount",
        "Group Savings",
        "Long-Stay Offers",
        "Package Deals",
      ],
      "Last Minute": [
        "Weekend Getaways",
        "Flash Sales",
        "Cancellation Spots",
        "Short Notice",
      ],
      "Special Packages": [
        "Honeymoon Eco-Retreat",
        "Family Adventure",
        "Senior Tours",
        "Photography Workshops",
      ],
    },
    "Eco-Initiatives": {
      Conservation: [
        "Wildlife Protection",
        "Reforestation",
        "Water Management",
        "Desert Preservation",
      ],
      Community: [
        "Local Employment",
        "Cultural Preservation",
        "Fair Trade",
        "Skill Development",
      ],
      Education: [
        "Eco-Workshops",
        "School Programs",
        "Visitor Awareness",
        "Research Support",
      ],
      Sustainability: [
        "Waste Management",
        "Renewable Energy",
        "Water Conservation",
        "Sustainable Architecture",
      ],
    },
  };

  const goToTravels = () => {
    window.location.href = "/travels";
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
      // Close mega menu when clicking outside
      if (
        activeNavLink &&
        !e.target.closest(".mega-menu-container") &&
        !e.target.closest(".nav-link-button")
      ) {
        setActiveNavLink(null);
        setSelectedCategoryInMegaMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeNavLink]);

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        setIsSidebarOpen(false);
        setSidebarLevel("main");
        setActiveNavLink(null);
        setSelectedCategoryInMegaMenu(null);
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

  const handleNavLinkClick = (link, event) => {
    if (window.innerWidth >= 1024) {
      // Only on desktop
      // Handle Map link separately - scroll to map section
      if (link === "Map") {
        scrollToMap();
        setActiveNavLink(null);
        setSelectedCategoryInMegaMenu(null);
        return;
      }

      // Toggle: if clicking the same link, close it; otherwise open new one
      if (activeNavLink === link) {
        setActiveNavLink(null);
        setSelectedCategoryInMegaMenu(null);
      } else {
        setActiveNavLink(link);
        // Reset selected category when opening a new main link
        setSelectedCategoryInMegaMenu(null);
      }
    } else {
      // On mobile, handle Map click in sidebar
      if (link === "Map") {
        scrollToMap();
        closeSidebar();
      }
    }
  };

  const scrollToMap = () => {
    const mapSection = document.getElementById("map-section");
    if (mapSection) {
      setIsSidebarOpen(false);

      const navbarHeight = 64;
      const offsetTop = mapSection.offsetTop - navbarHeight;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  const handleMegaMenuCategoryClick = (category) => {
    setSelectedCategoryInMegaMenu(category);
  };

  const handleMegaMenuItemClick = () => {
    setActiveNavLink(null);
    setSelectedCategoryInMegaMenu(null);
  };

  const handleSidebarMapClick = () => {
    scrollToMap();
    closeSidebar();
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
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => (window.location.href = "/")}
            >
              <img
                src={logo}
                alt="EcoDz Logo"
                className="h-10 lg:h-12 transition-transform group-hover:scale-105 duration-300"
              />
              <h2 className="text-2xl lg:text-3xl font-bold text-emerald-600">
                EcoDz
              </h2>
            </div>

            {/* Desktop navigation links - always visible */}
            <div className="hidden lg:flex items-center gap-6 relative">
              {navLinks.map((link) => (
                <button
                  key={link}
                  ref={(el) => (navLinksRef.current[link] = el)}
className="nav-link-button relative h-16 flex items-center px-4 font-medium
text-gray-800 hover:text-emerald-600 transition-colors cursor-pointer
whitespace-nowrap"
                  onClick={(e) => handleNavLinkClick(link, e)}
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
                  placeholder={
                    isSearchFocused
                      ? "Search ecological destinations"
                      : "Search"
                  }
                  onFocus={() => setIsSearchFocused(true)}
                  className={`pl-10 pr-4 py-2.5 border border-gray-300 rounded-full 
                    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                    transition-all duration-300 text-gray-800 placeholder-gray-400 bg-white
                    ${
                      isSearchFocused
                        ? "w-64 lg:w-80 shadow-sm"
                        : "w-32 lg:w-48"
                    }`}
                />
              </div>

              {isSearchFocused && (
                <div className="absolute top-12 left-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">
                    Recent Searches
                  </h4>
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
                      <li className="text-gray-400 text-sm italic py-2">
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

        {/* Mega Menu Popup */}
        {activeNavLink && menuData[activeNavLink] && (
          <div
            ref={megaMenuRef}
            className="mega-menu-container absolute left-0 right-0 bg-white w-[600px] border-t border-gray-200 shadow-xl z-40"
            style={{
              top: "100%",
              left: navLinksRef.current[activeNavLink]?.offsetLeft || 0,
            }}
          >
            <div className="max-w-7xl mx-auto px-8 py-8">
              <div className="grid grid-cols-4 gap-8">
                {/* Left column - Main categories */}
                <div className="col-span-1">
                  <div className="space-y-3">
                    {Object.keys(menuData[activeNavLink]).map((category) => {
                      const isAll = category === "__ALL__";

                      return (
                        <button
                          key={category}
                          className={`w-full text-left p-2 rounded-md transition-colors
        ${
          isAll
            ? "font-semibold text-emerald-600 hover:bg-emerald-50"
            : selectedCategoryInMegaMenu === category
            ? "bg-emerald-50 text-emerald-700 font-medium"
            : "text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
        }`}
                          onClick={() => {
                            if (isAll) {
                              goToTravels(); // 👉 redirect
                              setActiveNavLink(null);
                              setSelectedCategoryInMegaMenu(null);
                            } else {
                              handleMegaMenuCategoryClick(category);
                            }
                          }}
                        >
                          <div className="flex items-center">
                            <span className="text-sm">
                              {isAll ? "All Destinations" : category}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right column - Sub-items of selected category */}
                <div className="col-span-3">
                  {selectedCategoryInMegaMenu ? (
                    <>
                      <h4 className="text-lg font-semibold text-gray-800 mb-6">
                        {selectedCategoryInMegaMenu}
                      </h4>
                      <div className="grid grid-cols-2 gap-6">
                        {menuData[activeNavLink][
                          selectedCategoryInMegaMenu
                        ].map((item, index) => (
                          <button
                            key={index}
                            className="text-left p-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors group"
                            onClick={handleMegaMenuItemClick}
                          >
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <span className="text-sm">{item}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <FiChevronRight className="w-8 h-8 text-gray-300 rotate-90" />
                      </div>
                      <p className="text-sm">
                        Select a category to view options
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
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
                  placeholder="Search ecological destinations..."
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
                          setActiveNavLink(null);
                          setSelectedCategoryInMegaMenu(null);
                        }}
                      >
                        <span>{link}</span>
                        <FiChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                      </button>
                    ))}
                    <button
                      className="w-full p-3 text-gray-800 font-medium hover:bg-gray-50 hover:text-emerald-600 rounded-lg transition-colors text-left"
                      onClick={handleSidebarMapClick}
                    >
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
                      Object.keys(menuData[selectedMainLink]).map(
                        (category) => (
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
                        )
                      )}
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
                      menuData[selectedMainLink][selectedCategory].map(
                        (item) => (
                          <button
                            key={item}
                            className="w-full p-3 text-gray-800 font-medium hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors text-left"
                            onClick={() => {
                              setActiveNavLink(null);
                              setSelectedCategoryInMegaMenu(null);
                            }}
                          >
                            {item}
                          </button>
                        )
                      )}
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
