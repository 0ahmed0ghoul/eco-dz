import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceOverview from "./place/Overview";
import TravelDeals from "./place/TravelDeals";
import PlaceTrips from "./place/trips";
import PlaceHighlights from "./place/Highlights";
import ReviewsSection from "./ReviewsSection";
import axios from "axios";

const Destination = () => {
  const { category, slug } = useParams(); // get category & slug
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Encode category & slug in case they have spaces
    const encodedCategory = encodeURIComponent(category);
    const encodedSlug = encodeURIComponent(slug);

    axios
      .get(`/api/places/${encodedCategory}/${encodedSlug}`)
      .then((res) => setPlace(res.data))
      .catch((err) => {
        console.error(err);
        setPlace(null);
      })
      .finally(() => setLoading(false));
  }, [category, slug]);

  if (loading) return <p className="text-center py-10">Loading...</p>;

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
