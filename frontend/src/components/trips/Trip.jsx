import React from 'react';
import TripOverview from './trip/Overview';
import WhyLoveThisTrip from './trip/WhyLoveThisTrip';
import TripItinerary from './trip/Itinerary';
import Inclusions from './trip/Inclusions';
import BeforeYouBook from './trip/BeforeYouBook';
import DatesAndPrices from './trip/DatesAndPrices';
import ImportantNotes from './trip/ImportantNotes';

const Trip = () => {
    return (
        <section id='trip'>
            <TripOverview />
            <WhyLoveThisTrip />
            <TripItinerary />
            <Inclusions />
            <BeforeYouBook />
            <DatesAndPrices />
            <ImportantNotes />
        </section>
    );
};

export default Trip;