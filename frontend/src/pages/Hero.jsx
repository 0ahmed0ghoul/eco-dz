import React, { useEffect, useState } from "react";
import Intro from "../components/hero_section/Intro.jsx";
import GalleryImages from "../components/hero_section/GalleryImages.jsx";
import Experiences from "../components/hero_section/Experiences.jsx";
import OurPurpose from "../components/hero_section/OurPurpose.jsx";
import VideoPart from "../components/hero_section/VideoPart.jsx";
import Map from "../components/hero_section/Map.jsx";
import Sponsor from "../components/hero_section/Sponsor.jsx";
import Tabs from "../components/Tabs.jsx";
import AnimatedSection from "../components/AnimatedSection.jsx";

const tabs = [
  { label: "Welcome", id: "intro" },
  { label: "Image Gallery", id: "gallery" },
  { label: "Trips & Deals", id: "trips" },
  { label: "Campaign", id: "apart" }, // Fixed typo: "Compaign" -> "Campaign"
  { label: "Our Collaborative", id: "collab" },
  { label: "Highlights", id: "highlight" },
  { label: "Interactive map", id: "map" },
];

const Hero = () => {
  const [trips, setTrips] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState({
    trips: true,
    deals: true,
  });
  const [error, setError] = useState(null);

  // Get API URL with fallback
  const API_URL =
    import.meta.env.VITE_API_URL || "https://eco-dz-2.onrender.com";

  /* ================= Fetch Trips ================= */
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        console.log("🔍 Fetching trips from:", `${API_URL}/api/trips`);

        const res = await fetch(`${API_URL}/api/trips`, {
          method: "GET",
          // Remove credentials for public endpoints
          // credentials: 'include',  // 👈 COMMENT OUT OR REMOVE
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          // Log the actual error response
          const errorText = await res.text();
          console.error("❌ Trips error response:", errorText);
          throw new Error(`Failed to fetch trips: ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Trips fetched:", data);
        setTrips(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error fetching trips:", err);
        setError(err.message);
      } finally {
        setLoading((prev) => ({ ...prev, trips: false }));
      }
    };

    fetchTrips();
  }, [API_URL]);

  /* ================= Fetch Deals ================= */
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        console.log("🔍 Fetching deals from:", `${API_URL}/api/deals`);

        const res = await fetch(`${API_URL}/api/deals`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(
            `Failed to fetch deals: ${res.status} ${res.statusText}`
          );
        }

        const data = await res.json();
        console.log("✅ Deals fetched:", data);

        // Handle different response structures
        if (data.deals && Array.isArray(data.deals)) {
          setDeals(data.deals);
        } else if (Array.isArray(data)) {
          setDeals(data);
        } else {
          setDeals([]);
          console.warn("Unexpected deals response format:", data);
        }
      } catch (err) {
        console.error("❌ Error fetching deals:", err);
        setError(err.message);
      } finally {
        setLoading((prev) => ({ ...prev, deals: false }));
      }
    };

    fetchDeals();
  }, [API_URL]);

  // Show loading state
  if (loading.trips || loading.deals) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading experiences...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg text-center">
          <h2 className="text-red-600 text-xl font-semibold mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-red-500 mb-4">{error}</p>
          <p className="text-gray-600 text-sm">
            Please try refreshing the page. If the problem persists, contact
            support.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* TOP HERO PART */}
      <section
        className="hero relative flex flex-col min-h-1/2 px-5 bg-white"
        id="intro"
      >
        <Intro />
      </section>

      {/* Sticky Tabs Container */}
      <div className="sticky top-16 z-40 bg-white shadow-sm border-b border-gray-100 mb-12">
        <Tabs tabs={tabs} />
      </div>

      {/* Main Content Sections */}
      <div className="relative bg-white">
        <AnimatedSection variant={1}>
          <div id="gallery">
            <GalleryImages />
          </div>
        </AnimatedSection>

        <AnimatedSection variant={2} delay={0.1}>
          <div id="trips">
            <Experiences
              trips={trips}
              deals={deals}
              // Pass loading state if Experiences component needs it
              loading={loading.trips || loading.deals}
            />
          </div>
        </AnimatedSection>

        <AnimatedSection variant={3} delay={0.15}>
          <div id="apart">
            <OurPurpose />
          </div>
        </AnimatedSection>

        <AnimatedSection variant={1} delay={0.15}>
          <div id="collab">
            <Sponsor />
          </div>
        </AnimatedSection>

        <AnimatedSection variant={2} delay={0.2}>
          <div id="highlight">
            <VideoPart />
          </div>
        </AnimatedSection>

        <AnimatedSection variant={3} delay={0.25}>
          <div id="map">
            <Map />
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Hero;
