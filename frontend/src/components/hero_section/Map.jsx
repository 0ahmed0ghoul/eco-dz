import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { monuments } from "../../data/monuments";


// Default Leaflet Marker
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Categories
const categories = [
  { id: "all", name: "All Monuments",total: 50 , color: "bg-blue-500", gradient: "from-blue-500 to-blue-600" },
  { id: "desert", name: "Desert",total: 25 , color: "bg-amber-500", gradient: "from-amber-500 to-orange-500" },
  { id: "mountain", name: "Mountains",total: 15 , color: "bg-green-500", gradient: "from-green-500 to-emerald-600" },
  { id: "forest", name: "Forests",total: 10 , color: "bg-emerald-500", gradient: "from-emerald-500 to-green-600" },
];
const provinces = [
  {name :"Adrar", num: 2},
  {name :"Chlef", num: 3},
  {name :"Laghouat", num: 2},
  {name :"Oum El Bouaghi", num: 1},
  {name :"Batna", num: 4},
  {name :"Béjaïa", num: 3},
  {name :"Biskra", num: 2},
  {name :"Béchar", num: 2},
  {name :"Blida", num: 3},
  {name :"Bouira", num: 2},
  {name :"Tamanrasset", num: 4},
  {name :"Tébessa", num: 1},
  
];

// Custom marker icons
const createCustomIcon = (category) => {
  const colors = {
    desert: '#f59e0b',
    mountain: '#10b981',
    forest: '#047857',
    all: '#3b82f6'
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative animate-pulse">
        <div class="w-6 h-6 rounded-full border-3 border-white shadow-2xl" style="background-color: ${colors[category]};"></div>
        <div class="absolute inset-0 rounded-full animate-ping" style="background-color: ${colors[category]}; opacity: 0.4;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};




function Map() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersLayer = useRef(null);
  const sectionRef = useRef(null);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("all");
  const [hoverMonument, setHoverMonument] = useState(null);
  const [selectedMonument, setSelectedMonument] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);


  // Enhanced monuments data with galleries and additional info
  const enhancedMonuments = monuments.map(monument => ({
    ...monument,
    gallery: [monument.image], // Using the main image as gallery
  }));




  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section entrance
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      // Category buttons animation
      gsap.fromTo(".category-btn",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, delay: 0.3 }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Popup animations
  useEffect(() => {
    if (popupRef.current && selectedMonument) {
      if (isPopupVisible) {
        gsap.fromTo(popupRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
      }
    }
  }, [selectedMonument, isPopupVisible]);

  // INIT MAP
  useEffect(() => {
    if (mapInstance.current) return;
  
    const bounds = [
      [19.0, -8.7],  // SW
      [37.2, 12.0]   // NE
    ];
  
    mapInstance.current = L.map(mapRef.current, {
      zoom: 5,
      center: [28.0339, 1.6596],
      minZoom: 4,
      maxBounds: bounds,  // <--- restrict to Algeria
      zoomControl: false,
    });
  
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(mapInstance.current);
  
    markersLayer.current = L.layerGroup().addTo(mapInstance.current);
  
    loadMarkers("all");
  }, []);

  // LOAD MARKERS BY CATEGORY
  const loadMarkers = (category) => {
    markersLayer.current.clearLayers();

    const filtered = category === "all"
      ? enhancedMonuments
      : enhancedMonuments.filter((m) => m.category === category);

    filtered.forEach((monument) => {
      const marker = L.marker([monument.lat, monument.lng], {
        icon: createCustomIcon(monument.category)
      }).addTo(markersLayer.current);

      let hoverTimeout;

      marker.on("mouseover", () => {
        hoverTimeout = setTimeout(() => {
          setHoverMonument(monument);
        }, 200);
      });

      marker.on("mouseout", () => {
        clearTimeout(hoverTimeout);
        setHoverMonument(null);
      });

      marker.on("click", () => {
        setSelectedMonument(monument);
        setCurrentImageIndex(0);
        setIsPopupVisible(true);
        
        // Marker click animation
        const markerElement = marker.getElement();
        if (markerElement) {
          gsap.fromTo(markerElement,
            { scale: 1 },
            { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 }
          );
        }
      });
    });
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setSelectedMonument(null);
    setIsPopupVisible(false);
    loadMarkers(categoryId);

    // Animate category button
    const button = document.querySelector(`[data-category="${categoryId}"]`);
    if (button) {
      gsap.fromTo(button,
        { scale: 1 },
        { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 }
      );
    }
  };
  
function handleViewMore(monument) {
  navigate(`/monument/${monument.id}`, {
    state: { monument }
  });
}

  const handleClosePopup = () => {
    if (popupRef.current) {
      gsap.to(popupRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setSelectedMonument(null);
          setIsPopupVisible(false);
        }
      });
    } else {
      setSelectedMonument(null);
      setIsPopupVisible(false);
    }
  };

  const nextImage = () => {
    if (selectedMonument.gallery.length > 1) {
      setCurrentImageIndex(prev => 
        prev === selectedMonument.gallery.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedMonument.gallery.length > 1) {
      setCurrentImageIndex(prev => 
        prev === 0 ? selectedMonument.gallery.length - 1 : prev - 1
      );
    }
  };


  return (
    <section
      ref={sectionRef}
      
      id="maps"
      className="relative h-screen w-full overflow-hidden "
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0  animate-pulse"></div>
      
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out"
      ></div>

      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 "></div>

      <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-5xl md:text-6xl font-black mb-4 drop-shadow-2xl bg-linear-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent">
            Algeria's Natural Treasures
          </h1>
          <p className="text-xl text-blue-100/90 font-light drop-shadow-lg">
            Discover breathtaking ecological monuments across Algeria
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)]">
          {/* Sidebar */}
          <div className="lg:w-72 bg-white/10 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              Categories
            </h3>

            <div className="space-y-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  data-category={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`category-btn w-full text-left px-5 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                    activeCategory === cat.id
                      ? `bg-gradient-to-r ${cat.gradient} text-white shadow-2xl scale-105 border border-white/30`
                      : "bg-white/10 text-white/90 hover:bg-white/20 border border-white/10"
                  } backdrop-blur-sm`}
                >
                  <div className="flex items-center justify-between">
                    <span>{cat.name} ({cat.total})</span> 
                    {activeCategory === cat.id && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative">
            <div
              ref={mapRef}
              className="w-full h-full rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm overflow-hidden"
            ></div>

            {/* Hover Tooltip */}
            {hoverMonument && (
              <div className="absolute left-1/2 -translate-x-1/2 top-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-2xl shadow-2xl font-semibold z-50 pointer-events-none backdrop-blur-sm border border-white/20 animate-in fade-in-0 zoom-in-95">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    hoverMonument.category === 'desert' ? 'bg-amber-300' :
                    hoverMonument.category === 'mountain' ? 'bg-green-300' :
                    'bg-emerald-300'
                  }`}></div>
                  {hoverMonument.name}
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-r from-blue-600 to-purple-600 rotate-45"></div>
              </div>
            )}

            {/* Enhanced Click Popup */}
            {selectedMonument && isPopupVisible && (
              <div
                ref={popupRef}
                className="absolute inset-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-6 z-50 pointer-events-auto"
              >
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="text-3xl font-black text-gray-900">
                          {selectedMonument.name}
                        </h2>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${
                          categories.find(c => c.id === selectedMonument.category)?.gradient
                        } shadow-lg`}>
                          {categories.find(c => c.id === selectedMonument.category)?.name}
                        </span>
                      </div>
  
                    </div>
                    <button
                      onClick={handleClosePopup}
                      className="text-gray-400 hover:text-gray-700 transition-all duration-200 hover:scale-110 p-2"
                    >
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Content Grid */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Gallery Section */}
                    <div className="space-y-4">
                      <div className="relative h-64 bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
                        <img
                          src={selectedMonument.gallery[currentImageIndex]}
                          alt={selectedMonument.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        
                        {/* Navigation Arrows - Only show if multiple images */}
                        {selectedMonument.gallery.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-xl transition-all duration-200 hover:scale-110"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-xl transition-all duration-200 hover:scale-110"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </>
                        )}

                        {/* Image Counter - Only show if multiple images */}
                        {selectedMonument.gallery.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {currentImageIndex + 1} / {selectedMonument.gallery.length}
                          </div>
                        )}
                      </div>

                      {/* Thumbnails - Only show if multiple images */}
                      {selectedMonument.gallery.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {selectedMonument.gallery.map((img, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all duration-300 ${
                                index === currentImageIndex 
                                  ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg scale-110' 
                                  : 'border-transparent hover:border-gray-300 hover:scale-105'
                              }`}
                            >
                              <img
                                src={img}
                                alt={`${selectedMonument.name} ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Description Section */}
                    <div className="flex flex-col">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          About This Monument
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                          {selectedMonument.description}
                        </p>
                      </div>
                      
                      <div className="pt-6 border-t border-gray-200">
                        <button
                           onClick={() => handleViewMore(selectedMonument)}
                          className="view-more-btn w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
                        >
                          🗺️ View Travel Details & Booking
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

                    {/* Sidebar */}
            <div className="lg:w-72 bg-white/10 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/20 overflow-scroll">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              Categories
            </h3>

            <div className="space-y-3">
              {provinces.map((prov,index) => (
                <button
                  key={index}
                  data-category={prov.id}
                  onClick={() => handleCategoryClick(prov.id)}
                  className={`category-btn w-full text-left px-5 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                    activeCategory === prov.id
                      ? `bg-gradient-to-r ${prov.gradient} text-white shadow-2xl scale-105 border border-white/30`
                      : "bg-white/10 text-white/90 hover:bg-white/20 border border-white/10"
                  } backdrop-blur-sm`}
                >
                  <div className="flex items-center justify-between">
                    <span>{prov.name} </span>  <span>{prov.num} </span>
                    {activeCategory === prov.id && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for Leaflet markers */}
      <style>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </section>
  );
}

export default Map;