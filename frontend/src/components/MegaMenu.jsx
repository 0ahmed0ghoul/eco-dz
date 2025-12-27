import React, {useState} from "react";
import {FiChevronRight,FiGlobe,} from "react-icons/fi";

function MegaMenu({
  activeNavLink,
  menuData,
  setActiveNavLink,
  navLinksRef,
  goToPlace,
  goToAllDestinations,
}) {
  const [selectedCategoryKey, setSelectedCategoryKey] = useState(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(null);

  const handleMegaMenuCategoryClick = (category) => {
    setSelectedCategoryKey(category);
    setSelectedCategorySlug(category); 
  };
  

  const handleMegaMenuItemClick = ({  slug }) => {
    if (!selectedCategorySlug || !slug) return;
    goToPlace(selectedCategorySlug, slug);
    setActiveNavLink(null);
    setSelectedCategoryKey(null);
    setSelectedCategorySlug(null);
  };

  const handleAllDestinationsClick = () => {
    goToAllDestinations();
    setActiveNavLink(null);
  };

  if (!activeNavLink || !menuData[activeNavLink]) return null;

  return (
    <div
      className="mega-menu-container absolute left-0 bg-white w-[800px] border border-gray-200 shadow-xl z-40"
      style={{
        top: "100%",
        left: navLinksRef.current[activeNavLink]?.offsetLeft || 0,
      }}
    >
      {/* Top section header */}
      <div className="px-8 py-6 border-b border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900">Destinations</h3>
      </div>

      <div className="grid grid-cols-12">
        {/* Left column - Categories (1/3 width) */}
        <div className="col-span-4 border-r border-gray-100">
          <div className="px-8 py-6">
            <div className="space-y-1">
              {activeNavLink &&
                Object.keys(menuData[activeNavLink]).map((category) => {
                  const isAll = category === "All Destinations";
                  const isActive = selectedCategoryKey === category;

                  return (
                    <button
                      key={category}
                      className={`w-full text-left py-3 px-4 rounded transition-all flex items-center justify-between
                ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-semibold border-l-4 border-emerald-500"
                    : "text-gray-700 hover:bg-gray-50"
                }
              `}
                      onClick={() => {
                        if (isAll) {
                          handleAllDestinationsClick();
                        } else {
                          handleMegaMenuCategoryClick(category);
                        }
                      }}
                    >
                      <span className="text-sm font-medium">{category}</span>

                      {isActive && !isAll && (
                        <FiChevronRight className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Right column - Countries (2/3 width) */}
        <div className="col-span-8">
          <div className="px-8 py-6">
          {selectedCategoryKey ? (
              <>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {selectedCategoryKey}
                  </h4>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {menuData[activeNavLink][selectedCategoryKey]?.map(
                    (item, index) => {
                      const title = Object.keys(item)[0];

                      const slug = item[title];

                      console.log(title, slug);
                      return (
                        <button
                          key={slug || index}
                          className="text-left py-2 text-gray-700 hover:text-emerald-600 hover:font-medium transition-colors"
                          onClick={() =>
                            handleMegaMenuItemClick({ title, slug })
                          }
                        >
                          <span className="text-sm">{title}</span>
                        </button>
                      );
                    }
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center py-12">
                <div className="text-center">
                  <FiGlobe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">
                    Select a region to view destinations
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MegaMenu;
