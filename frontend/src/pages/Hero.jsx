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
  { label: "Compaign", id: "apart" },
  { label: "Our Collaborative", id: "collab" },

  { label: "Highlights", id: "highlight" },
  { label: "Interactive map", id: "map" },
];

const Hero = () => {
  const [trips, setTrips] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= Fetch Trips ================= */
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/trips");
        if (!res.ok) throw new Error("Failed to fetch trips");
        const data = await res.json();
        setTrips(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  /* ================= Fetch Deals ================= */
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/deals");
        const data = await res.json();
        setDeals(data.deals || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  if (error) {
    return (
      <div className="p-8 text-red-600 text-center font-medium">{error}</div>
    );
  }

  return (
    <div className="w-full"> {/* ADD THIS WRAPPER */}
      {/* TOP HERO PART */}
      <section className="hero relative flex flex-col min-h-1/2 px-5 bg-white" id="intro">
        <Intro />
      </section>

      {/* Sticky Tabs Container */}
      <div className="sticky top-16 z-40 bg-white shadow-sm border-b border-gray-100 mb-12">
        <Tabs tabs={tabs} />
      </div>

      {/* Main Content Sections */}
      <div className="relative  bg-white ">
        <AnimatedSection variant={1}>
          <div id="gallery">
            <GalleryImages />
          </div>
        </AnimatedSection>

        <AnimatedSection variant={2} delay={0.1}>
          <div id="trips">
            <Experiences trips={trips} deals={deals} />
          </div>
        </AnimatedSection>

        <AnimatedSection variant={3} delay={0.15}>
          <div id="apart">
            <OurPurpose />
          </div>
        </AnimatedSection>
        <AnimatedSection variant={1} delay={0.15}>
          <div id="apart">
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