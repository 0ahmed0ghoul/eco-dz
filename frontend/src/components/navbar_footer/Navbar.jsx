import React, { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiUser,
  FiPhone,
  FiMessageCircle,
  FiMenu,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { navLinks, menuData } from "../../data/menuData";
import MegaMenu from "./MegaMenu";
import Sidebar from "./Sidebar";
import { socket } from "../../socket/socket";
import { jwtDecode } from "jwt-decode";


// Dummy components for modal display
const Section = ({ title, children }) => (
  <div className="mb-4">
    <h3 className="font-semibold mb-2">{title}</h3>
    <div>{children}</div>
  </div>
);
const PlaceCard = () => <div className="p-2 border mb-2">Place Card</div>;
const TripList = () => <div className="p-2 border mb-2">Trip List</div>;
const DealsList = () => <div className="p-2 border mb-2">Deals List</div>;

function Navbar() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarLevel, setSidebarLevel] = useState("main");
  const [selectedMainLink, setSelectedMainLink] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const [activeNavLink, setActiveNavLink] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedSearch, setSelectedSearch] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [selectedCategoryKey, setSelectedCategoryKey] = useState(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(null);

  const navigate = useNavigate();
  const navLinksRef = useRef({});

  // ✅ Check auth status
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");
    setIsSignedIn(!!token);
    setUserRole(role);
  }, []);

// ✅ REAL-TIME unread messages via Socket.IO
useEffect(() => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");
  let userId = null;

  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.id || decoded.userId; // depends on backend
  }
  if (!token || !userId) return;
  // socket.on("connect", () => {
  //   console.log("✅ Socket connected:", socket.id);
  // });
  
  // 🔹 Connect socket
  socket.auth = { token };
  socket.connect();

  // 🔹 Tell backend user is online
  socket.emit("user-online", { userId, role });

  const fetchUnreadMessages = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/messaging/unread-count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) return;
      const data = await res.json();
      setUnreadCount(data.unreadCount ?? 0);
    } catch (err) {
      console.error("Unread fetch error:", err);
    }
  };

  // 🔹 Initial fetch
  fetchUnreadMessages();

  // 🔹 Listen when backend tells inbox changed
  socket.on("conversation-updated", () => {
    fetchUnreadMessages();
  });

  return () => {
    socket.off("conversation-updated");
    socket.disconnect();
  };
}, []);


  // ✅ Fetch recent searches
  useEffect(() => {
    const fetchRecentSearches = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const res = await fetch("http://localhost:5000/api/searches/recent", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setRecentSearches(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (isSearchFocused) fetchRecentSearches();
  }, [isSearchFocused]);

  // SCROLL effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside search
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

  // ESC key closes sidebar
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

  const goToPlace = (categorySlug, placeSlug) => {
    navigate(`/places/${categorySlug}/${placeSlug}`);
    closeSidebar();
  };

  const goToProfile = () => {
    const role = localStorage.getItem("role");
    if (!isSignedIn) return navigate("/login");
    if (role === "agency") navigate("/agency/dashboard");
    else if (role === "traveller") navigate("/user/profile");
    else navigate("/login");
  };

  const goToAllDestinations = () => {
    navigate("/places");
    setActiveNavLink(null);
    setSelectedCategoryKey(null);
    setSelectedCategorySlug(null);
    closeSidebar();
  };
  const goToAllTrips = () => {
    navigate("/trips");
    setActiveNavLink(null);
    setSelectedCategoryKey(null);
    setSelectedCategorySlug(null);
    closeSidebar();
  };
  const goToAllDeals = () => {
    navigate("/deals");
    setActiveNavLink(null);
    setSelectedCategoryKey(null);
    setSelectedCategorySlug(null);
    closeSidebar();
  };

  const handleDeleteSearch = (item) => {
    setRecentSearches((prev) => prev.filter((s) => s !== item));
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

  const handleSearchSubmit = () => {
    if (!searchText.trim()) return;
    setSelectedSearch(searchText.trim());
    setIsSearchFocused(false);
    // optional: save to recent searches here
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

  const goToInbox = () => {
    setUnreadCount(0);
    navigate("/inbox");
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
              <div className="relative w-full">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={
                    isSearchFocused
                      ? "Search ecological destinations"
                      : "Search"
                  }
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchSubmit();
                  }}
                  className={`pl-10 pr-4 py-2.5 border border-gray-300 rounded-full 
                    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                    transition-all duration-300 text-gray-800 placeholder-gray-400 bg-white
                    ${isSearchFocused ? "w-64 lg:w-80 shadow-sm" : "w-32 lg:w-48"}`}
                />
              </div>

              {isSearchFocused && recentSearches.length > 0 && (
                <div className="absolute top-12 w-full bg-white border rounded shadow z-50 p-2">
                  {recentSearches.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                      onClick={() => {
                        setSearchText(item.location);
                        handleSearchSubmit();
                      }}
                    >
                      {item.location}
                      <FiX
                        className="ml-2 text-gray-400 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSearch(item);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {selectedSearch && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                  <div className="bg-white rounded-xl w-full max-w-2xl p-6">
                    <h2 className="text-xl font-bold mb-4">
                      Results for "{selectedSearch}"
                    </h2>

                    <Section title="Destination">
                      <PlaceCard />
                    </Section>
                    <Section title="Trips">
                      <TripList />
                    </Section>
                    <Section title="Deals">
                      <DealsList />
                    </Section>

                    <button
                      onClick={() => setSelectedSearch(null)}
                      className="mt-4 text-sm text-gray-500"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Inbox & Profile */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                className="p-2.5 rounded-full hover:bg-gray-100 transition-colors group relative"
                onClick={goToInbox}
              >
                <FiMessageCircle className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate("/contact")}
                className="p-2.5 rounded-full hover:bg-gray-100 transition-colors relative group"
              >
                <FiPhone className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
              </button>

              <button
                className="p-2.5 rounded-full hover:bg-gray-100 transition-colors group"
                onClick={goToProfile}
              >
                <FiUser className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
              </button>
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
          goToAllTrips={goToAllTrips}
          goToAllDeals={goToAllDeals}
        />
      </nav>

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        sidebarLevel={sidebarLevel}
        selectedMainLink={selectedMainLink}
        selectedCategory={selectedCategory}
        isSignedIn={isSignedIn}
        setIsSignedIn={setIsSignedIn}
        userRole={userRole}
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
        goToAllTrips={goToAllTrips}
        goToAllDeals={goToAllDeals}
      />

      <div className="h-16 lg:h-16" />
    </>
  );
}

export default Navbar;
