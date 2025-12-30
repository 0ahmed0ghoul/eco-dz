import React from "react";
import {
  FiSearch,
  FiUser,
  FiPhone,
  FiMail,
  FiX,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { navLinks, menuData } from "../data/menuData";
import { generateSlug } from "../utils/generateSlug";

function Sidebar({
  isSidebarOpen,
  sidebarLevel,
  selectedMainLink,
  selectedCategory,
  isSignedIn,
  setIsSignedIn, // ✅ correctly received from Navbar
  closeSidebar,
  setSidebarLevel,
  setSelectedMainLink,
  setSelectedCategory,
  goToPlace,
  goToAllDestinations,
  handleSidebarMapClick,
  activeNavLink,
  setActiveNavLink,
}) {
  const navigate = useNavigate();

  const handleMainLinkClick = (link) => {
    if (link === "Map") {
      handleSidebarMapClick();
      return;
    }
    setSelectedMainLink(link);
    setSidebarLevel("category");
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSidebarLevel("item");
  };

  const handleItemClick = (item) => {
    if (!item) return;
    const title = Object.keys(item)[0];
    const placeSlug = item[title];
    const categorySlug = generateSlug(selectedCategory);
    goToPlace(categorySlug, placeSlug);
    closeSidebar();
    setActiveNavLink(null);
  };

  const handleBackToMain = () => {
    setSidebarLevel("main");
    setSelectedMainLink(null);
    setSelectedCategory(null);
  };

  const handleBackToCategory = () => {
    setSidebarLevel("category");
    setSelectedCategory(null);
  };

  const handleAllDestinationsClick = () => {
    goToAllDestinations();
    closeSidebar();
  };

  if (!isSidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-100">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeSidebar}
      />

      <div className="absolute top-0 right-0 w-340px h-full bg-white shadow-xl">
        {/* Header */}

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logos/logo.png"
              alt="EcoDz Logo"
              className="h-8"
            />
            <h2 className="text-xl font-bold text-emerald-600">EcoDz</h2>
          </div>
          <button
            onClick={closeSidebar}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="border-t border-gray-100 p-4 bg-black/5">
          <div className="flex items-center justify-between px-2">
            <div className="flex gap-2">
              {/* Inbox / Mail */}
              <button
                onClick={() => navigate(isSignedIn ? "/user/inbox" : "/login")}
                className="p-2.5 rounded-full hover:bg-gray-100 transition-colors relative group"
              >
                <FiMail className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
              </button>

              {/* Sign In / Sign Out */}
              {!isSignedIn && (
                <button
                  onClick={() => navigate("/login")}
                  className="p-2.5 rounded-full hover:bg-gray-100 transition-colors group"
                >
                  <FiUser className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search */}
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

        {/* Menu content */}
        <div className="relative h-[calc(100vh-132px)] overflow-hidden">
          {/* Main menu */}
          <div
            className={`absolute top-0 left-0 w-full h-full transition-all duration-300 ${
              sidebarLevel === "main"
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
            }`}
          >
            <div className="py-2 px-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Navigation Menu
              </h3>
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link}
                    className="w-full text-left p-3 text-gray-800 font-medium hover:bg-gray-50 hover:text-emerald-600 rounded-lg transition-colors"
                    onClick={() => handleMainLinkClick(link)}
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category menu */}
          <div
            className={`absolute top-0 left-0 w-full h-full transition-all duration-300 ${
              sidebarLevel === "category"
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            <div className="py-2 px-6">
              <button
                className="flex items-center gap-2 p-3 text-gray-600 hover:text-gray-800 transition-colors mb-2"
                onClick={handleBackToMain}
              >
                <FiChevronRight className="w-5 h-5 rotate-180" />
                <span>Back to Menu</span>
              </button>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                {selectedMainLink}
              </h3>
              <div className="space-y-1">
                {selectedMainLink &&
                  menuData[selectedMainLink] &&
                  Object.keys(menuData[selectedMainLink]).map((category) => (
                    <button
                      key={category}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        category === "All Destinations"
                          ? "font-semibold text-emerald-600 hover:bg-emerald-50"
                          : "text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                      }`}
                      onClick={() =>
                        category === "All Destinations"
                          ? handleAllDestinationsClick()
                          : handleCategoryClick(category)
                      }
                    >
                      <span className="text-sm">{category}</span>
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
                className="flex items-center gap-2 p-3 text-gray-600 hover:text-gray-800 transition-colors mb-2"
                onClick={handleBackToCategory}
              >
                <FiChevronRight className="w-5 h-5 rotate-180" />
                <span>Back to {selectedMainLink}</span>
              </button>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                {selectedCategory}
              </h3>
              <div className="space-y-1">
                {selectedMainLink &&
                  selectedCategory &&
                  menuData[selectedMainLink][selectedCategory]?.map(
                    (item, index) => (
                      <button
                        key={Object.values(item)[0] || index} // unique
                        className="w-full p-3 text-gray-800 font-medium hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors text-left"
                        onClick={() => handleItemClick(item)}
                      >
                        {Object.keys(item)[0]}
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
              <button
                onClick={() => navigate(isSignedIn ? "/user/inbox" : "/login")}
                className="p-2.5 rounded-full hover:bg-gray-100 transition-colors relative group"
              >
                <FiMail className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
              </button>

              <button
                onClick={() => navigate("/contact")}
                className="p-2.5 rounded-full hover:bg-gray-100 transition-colors relative group"
              >
                <FiPhone className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
              </button>
            </div>

            {isSignedIn && (
              <button
                onClick={() => {
                  localStorage.removeItem("authToken");
                  setIsSignedIn(false);
                  navigate("/login");
                }}
                className="p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-700 font-medium"
              >
                Sign Out
              </button>
            ) }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
