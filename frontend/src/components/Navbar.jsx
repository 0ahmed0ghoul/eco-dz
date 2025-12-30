import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiUser, FiHeart, FiMail, FiX, FiMenu, FiPhone } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { navLinks, menuData, popularSearches } from "../data/menuData";
import MegaMenu from "./MegaMenu";
import Sidebar from "./Sidebar";

function Navbar() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarLevel, setSidebarLevel] = useState("main");
  const [selectedMainLink, setSelectedMainLink] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation(); // ✅ Get current route
  const isHomePage = location.pathname === "/"; // ✅ Check if home page
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    "Tassili n'Ajjer",
    "Hoggar Mountains",
    "Kabylia Region",
  ]);
  const [activeNavLink, setActiveNavLink] = useState(null);

  // ✅ NEW: separate state for MegaMenu category key and slug
  const [selectedCategoryKey, setSelectedCategoryKey] = useState(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(null);

  const navigate = useNavigate();
  const navLinksRef = useRef({});

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // or "authToken" depending on your app
    setIsSignedIn(!!token);
  }, []);

  const goToPlace = (categorySlug, placeSlug) => {
    navigate(`/places/${categorySlug}/${placeSlug}`);
    closeSidebar();
  };

  const goToAllDestinations = () => {
    navigate("/places");
    setActiveNavLink(null);
    setSelectedCategoryKey(null);
    setSelectedCategorySlug(null);
    closeSidebar();
  };

  /* =========================
     SCROLL / UI LOGIC
  ========================= */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-container")) setIsSearchFocused(false);

      if (
        activeNavLink &&
        !e.target.closest(".mega-menu-container") &&
        !e.target.closest(".nav-link-button")
      ) {
        setActiveNavLink(null);
        setSelectedCategoryKey(null);
        setSelectedCategorySlug(null);
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
        setSelectedCategoryKey(null);
        setSelectedCategorySlug(null);
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

  const handleNavLinkClick = (link) => {
    if (window.innerWidth >= 1024) {
      if (link === "Map") return scrollToMap();
      if (link === "Quizzes") return navigate("/quiz");

      if (activeNavLink === link) {
        setActiveNavLink(null);
        setSelectedCategoryKey(null);
        setSelectedCategorySlug(null);
      } else {
        setActiveNavLink(link);
        setSelectedCategoryKey(null);
        setSelectedCategorySlug(null);
      }
    } else {
      if (link === "Map") scrollToMap();
      if (link === "Quizzes") navigate("/quiz");
    }
  };

  const scrollToMap = () => {
    const mapSection = document.getElementById("maps");
    if (!mapSection) return;
    const navbarHeight = 64;
    window.scrollTo({
      top: mapSection.offsetTop - navbarHeight,
      behavior: "smooth",
    });
    closeSidebar();
  };

  const handleSidebarMapClick = () => scrollToMap();

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-gray-200 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => (window.location.href = "/")}
            >
              <img
                src="/assets/logos/logo.png"
                alt="EcoDz Logo"
                className="h-10 lg:h-12 transition-transform group-hover:scale-105 duration-300"
              />
              <h2 className="text-2xl lg:text-3xl font-bold text-emerald-600">
                EcoDz
              </h2>
            </div>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-6 relative">
              {navLinks.map((link) => {
                // ✅ Only show "Map" if on home page
                if (link === "Map" && !isHomePage) return null;

                return (
                  <button
                    key={link}
                    ref={(el) => (navLinksRef.current[link] = el)}
                    className="nav-link-button relative h-16 flex items-center px-4 font-medium text-gray-800 hover:text-emerald-600 transition-colors cursor-pointer whitespace-nowrap"
                    onClick={() => handleNavLinkClick(link)}
                  >
                    {link}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search + Icons */}
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
                    {recentSearches.length > 0 ? (
                      recentSearches.map((item) => (
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
                      ))
                    ) : (
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
              <button
                onClick={() => navigate(isSignedIn ? "/user/inbox" : "/login")}
                className="p-2.5 rounded-full hover:bg-gray-100 transition-colors relative group"
              >
                <FiMail className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  2
                </span>
              </button>
              <button
                onClick={() => navigate(isSignedIn ? "/contact" : "/Contact")}
                className="p-2.5 rounded-full hover:bg-gray-100 transition-colors relative group"
              >
                <FiPhone className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  2
                </span>
              </button>
              {isSignedIn ? (
                <button
                  onClick={() => {
                    localStorage.removeItem("authToken");
                    setIsSignedIn(false);
                    navigate("/login");
                  }}
                  className="p-2.5 rounded-full hover:bg-gray-100 transition-colors group"
                >
                  <span className="text-sm font-medium text-gray-700">
                    Sign Out
                  </span>
                </button>
              ) : (
                <button
                  className="p-2.5 rounded-full hover:bg-gray-100 transition-colors group"
                  onClick={() => navigate("/login")}
                >
                  <FiUser className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
                </button>
              )}

            </div>

            {/* Sidebar toggle */}
            <button
              className="flex lg:hidden items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors group"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu className="w-6 h-6 text-gray-700 group-hover:text-emerald-600 transition-colors" />
            </button>
          </div>
        </div>

        <MegaMenu
          activeNavLink={activeNavLink}
          menuData={menuData}
          selectedCategoryKey={selectedCategoryKey}
          selectedCategorySlug={selectedCategorySlug}
          setSelectedCategoryKey={setSelectedCategoryKey}
          setSelectedCategorySlug={setSelectedCategorySlug}
          setActiveNavLink={setActiveNavLink}
          navLinksRef={navLinksRef}
          goToPlace={goToPlace}
          goToAllDestinations={goToAllDestinations}
        />
      </nav>

      <Sidebar
  isSidebarOpen={isSidebarOpen}
  sidebarLevel={sidebarLevel}
  selectedMainLink={selectedMainLink}
  selectedCategory={selectedCategory}
  isSignedIn={isSignedIn}              // ✅ pass the actual value
  setIsSignedIn={setIsSignedIn}        // ✅ pass the setter
  menuData={menuData}
  closeSidebar={closeSidebar}
  setSidebarLevel={setSidebarLevel}
  setSelectedMainLink={setSelectedMainLink}
  setSelectedCategory={setSelectedCategory}
  goToPlace={goToPlace}
  handleSidebarMapClick={handleSidebarMapClick}
  activeNavLink={activeNavLink}
  setActiveNavLink={setActiveNavLink}
  goToAllDestinations={goToAllDestinations}
/>

      <div className="h-16 lg:h-16" />
    </>
  );
}

export default Navbar;
