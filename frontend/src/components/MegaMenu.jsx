import React, { useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { generateSlug } from "../utils/generateSlug";

function MegaMenu({
  activeNavLink,
  menuData,
  selectedCategoryInMegaMenu,
  setSelectedCategoryInMegaMenu,
  setActiveNavLink,
  navLinksRef,
  goToPlace,
  goToAllDestinations,
}) {
  // ✅ ADDED: backend places state
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMegaMenuCategoryClick = async (category) => {
    setSelectedCategoryInMegaMenu(category);

    // ✅ ADDED: fetch from backend
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/places/${category}`);
      const data = await res.json();
      setPlaces(data);
    } catch (err) {
      console.error("Failed to fetch places", err);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMegaMenuItemClick = (item) => {
    goToPlace(item);
    setActiveNavLink(null);
    setSelectedCategoryInMegaMenu(null);
  };

  const handleAllDestinationsClick = () => {
    goToAllDestinations();
    setActiveNavLink(null);
    setSelectedCategoryInMegaMenu(null);
  };

  if (!activeNavLink || !menuData[activeNavLink]) return null;

  return (
    <div
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
                const isAll = category === "All Destinations";

                return (
                  <button
                    key={category}
                    className={`w-full text-left p-2 rounded-md transition-colors ${
                      isAll
                        ? "font-semibold text-emerald-600 hover:bg-emerald-50"
                        : selectedCategoryInMegaMenu === category
                        ? "bg-emerald-50 text-emerald-700 font-medium"
                        : "text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      if (isAll) {
                        handleAllDestinationsClick();
                      } else {
                        handleMegaMenuCategoryClick(category);
                      }
                    }}
                  >
                    <span className="text-sm">{category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right column - Sub-items */}
          <div className="col-span-3">
            {selectedCategoryInMegaMenu ? (
              <>
                <h4 className="text-lg font-semibold text-gray-800 mb-6">
                  {selectedCategoryInMegaMenu}
                </h4>

                <div className="grid grid-cols-2 gap-6">
                  {menuData[activeNavLink][selectedCategoryInMegaMenu]?.map(
                    (item, index) => (
                      <button
                        key={index}
                        className="text-left p-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors group"
                        onClick={() => handleMegaMenuItemClick(item)}
                      >
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span className="text-sm">{item}</span>
                        </div>
                      </button>
                    )
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <FiChevronRight className="w-8 h-8 text-gray-300 rotate-90" />
                </div>
                <p className="text-sm">Select a category to view options</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MegaMenu;
