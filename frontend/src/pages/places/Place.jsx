import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceOverview from "../../components/places/place/Overview";
import TravelDeals from "../../components/places/place/TravelDeals";
import PlaceTrips from "../../components/places/place/trips";
import PlaceHighlights from "../../components/places/place/Highlights";
import ReviewsSection from "../../components/places/place/ReviewsSection";
import Tabs from "../../components/Tabs";
import AnimatedSection from "../../components/AnimatedSection";


const Destination = () => {
  const { category, slug } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const tabs = [
    { label: "Overview", id: "overview" },
    { label: "Deals", id: "deal" },
    { label: "Trips", id: "trips" },
    { label: "Highlights", id: "highlight" },
    { label: "Reviews", id: "review" },
  ];
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setLoading(true);

        const encodedCategory = encodeURIComponent(category);
        const encodedSlug = encodeURIComponent(slug);

        const res = await fetch(
          `http://localhost:5000/api/places/${encodedCategory}/${encodedSlug}`
        );

        if (!res.ok) {
          throw new Error("Place not found");
        }

        const data = await res.json();
        setPlace(data);
      } catch (error) {
        console.error("Error fetching place:", error);
        setPlace(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [category, slug]);

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (!place) {
    return (
      <section className="p-8 text-center">
        <h2 className="text-2xl font-bold">Place not found</h2>
      </section>
    );
  }

  return (
    <section>
      <AnimatedSection>
        <PlaceOverview place={place} />
      </AnimatedSection>
  
      {/* STICKY TABS (NO ANIMATION) */}
      <div className="sticky top-16 z-60 bg-white">
        <Tabs tabs={tabs} />
      </div>
  
      <AnimatedSection delay={0.1}>
        <TravelDeals place={place} />
      </AnimatedSection>
  
      <AnimatedSection delay={0.15}>
        <PlaceTrips place={place} />
      </AnimatedSection>
  
      <AnimatedSection delay={0.2}>
        <PlaceHighlights place={place} />
      </AnimatedSection>
  
      <AnimatedSection delay={0.25}>
        <ReviewsSection placeId={place.id} />
      </AnimatedSection>
    </section>
  );
};

export default Destination;
