import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceOverview from "../../components/places/place/Overview";
import TravelDeals from "../../components/places/place/TravelDeals";
import PlaceTrips from "../../components/places/place/trips";
import PlaceHighlights from "../../components/places/place/Highlights";
import ReviewsSection from "../../components/ReviewsSection";

const Destination = () => {
  const { category, slug } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

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

        // ✅ API RETURNS THE PLACE OBJECT DIRECTLY
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
      <PlaceOverview place={place} />
      <TravelDeals place={place} />
      <PlaceTrips place={place} />
      <PlaceHighlights place={place} />
      <ReviewsSection reviewsData={place.reviewsData} />
    </section>
  );
};

export default Destination;
