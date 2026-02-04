import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Tabs = ({ tabs }) => {
  const [active, setActive] = useState(tabs[0]?.id || "intro");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const tabsContainerRef = useRef(null);
  const activeTabRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    // Update active state immediately
    setActive(id);
    
    // Smooth scroll to section
    const offset = 100; // Slightly more offset for better visibility
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    
    window.scrollTo({ 
      top: y, 
      behavior: "smooth" 
    });
  };

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      // Add small buffer to prevent flickering
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll tabs left/right
  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = 150;
      tabsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Detect active section while scrolling
  useEffect(() => {
    let scrollTimer;
    
    const onScroll = () => {
      // Debounce scroll events for performance
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const offset = 120; // Height of navbar + tabs
        
        // Find which section is currently in view
        for (const tab of tabs) {
          const el = document.getElementById(tab.id);
          if (!el) continue;
          
          const rect = el.getBoundingClientRect();
          const isInView = (
            rect.top <= offset + 50 && 
            rect.bottom >= offset
          );
          
          if (isInView) {
            setActive(tab.id);
            break;
          }
        }
      }, 50);
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimer);
    };
  }, [tabs]);

  // Initialize and handle resize
  useEffect(() => {
    const handleResize = () => {
      checkScrollPosition();
    };

    // Initial check
    checkScrollPosition();
    
    // Listen for resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Update arrows when tabs change or container scrolls
  useEffect(() => {
    const container = tabsContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsScrolling(true);
      checkScrollPosition();
      
      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Set new timeout
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="sticky top-16 z-50 bg-white/95 ">
      {/* Mobile/Tablet version with scroll */}
      <div className="md:hidden w-full px-2 relative">
        {/* Fade gradients - only show when there's content to scroll */}
        <div 
          className={`absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white via-white to-transparent z-20 pointer-events-none transition-opacity duration-300 ${
            showLeftArrow ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        <div 
          className={`absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white via-white to-transparent z-20 pointer-events-none transition-opacity duration-300 ${
            showRightArrow ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Left arrow button */}
        <button
          onClick={() => scrollTabs('left')}
          className={`absolute left-1 top-1/2 -translate-y-1/2 z-30 w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-sm transition-all duration-300 ${
            showLeftArrow ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-90'
          } hover:bg-gray-50 active:scale-95`}
          aria-label="Scroll tabs left"
          disabled={!showLeftArrow}
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        
        {/* Right arrow button */}
        <button
          onClick={() => scrollTabs('right')}
          className={`absolute right-1 top-1/2 -translate-y-1/2 z-30 w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-sm transition-all duration-300 ${
            showRightArrow ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-90'
          } hover:bg-gray-50 active:scale-95`}
          aria-label="Scroll tabs right"
          disabled={!showRightArrow}
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>

        {/* Scrollable tabs container */}
        <div 
          ref={tabsContainerRef}
          className="flex items-center overflow-x-auto py-3 scrollbar-hide px-10"
        >
          <div className="flex items-center space-x-6 px-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                ref={active === tab.id ? activeTabRef : null}
                onClick={() => scrollToSection(tab.id)}
                className="relative px-3 py-2 text-sm font-medium whitespace-nowrap flex-shrink-0 group"
              >
                {/* Tab text */}
                <span className={`relative z-10 transition-colors duration-300 ${
                  active === tab.id 
                    ? "text-gray-900 font-semibold" 
                    : "text-gray-500 group-hover:text-gray-700"
                }`}>
                  {tab.label}
                </span>
                
                {/* Animated line indicator - grows from center */}
                <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-8 h-0.5 overflow-hidden">
                  <div className={`absolute inset-0 bg-emerald-500 transform origin-center transition-all duration-300 ease-out ${
                    active === tab.id 
                      ? 'scale-x-100 opacity-100' 
                      : 'scale-x-0 opacity-0'
                  }`} />
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop version - always fully visible */}
      <div className="hidden md:block w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8 lg:space-x-10 xl:space-x-12 py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className="relative px-4 py-2 text-base lg:text-lg font-medium group"
              >
                {/* Tab text */}
                <span className={`relative z-10 transition-colors duration-300 ${
                  active === tab.id 
                    ? "text-gray-900 font-semibold" 
                    : "text-gray-500 group-hover:text-gray-700"
                }`}>
                  {tab.label}
                </span>
                
                {/* Animated line indicator - grows from center */}
                <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-10 h-0.5 overflow-hidden">
                  <div className={`absolute inset-0 bg-emerald-500 transform origin-center transition-all duration-300 ease-out ${
                    active === tab.id 
                      ? 'scale-x-100 opacity-100' 
                      : 'scale-x-0 opacity-0'
                  }`} />
                </div>
                
                {/* Subtle hover effect */}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;