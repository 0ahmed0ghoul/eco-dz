import React from 'react';
import PlaceOverview from './place/Overview';
import TravelDeals from './place/TravelDeals';
import PlaceTrips from './place/trips';
import Highlights from './place/Highlights';
import ReviewsSection from './ReviewsSection';

const Destination = () => {
    return (
        <section>
            <PlaceOverview />
            <TravelDeals />
            <PlaceTrips />
            <Highlights />
            <ReviewsSection />
        </section>
    );
};

export default Destination;