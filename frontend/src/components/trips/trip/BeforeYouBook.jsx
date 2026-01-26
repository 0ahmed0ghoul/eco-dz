import React, { useState } from "react";
import { Flag, Plane , Bed, MapPin } from "lucide-react";

const tabs = [
  { label: "Is this trip right for you?", icon: <Flag className="h-4 w-4 mr-1" /> },
  { label: "Visas", icon: <Plane  className="h-4 w-4 mr-1" /> },
  { label: "Accommodation", icon: <Bed className="h-4 w-4 mr-1" /> },
  { label: "Joining point", icon: <MapPin className="h-4 w-4 mr-1" /> },
];

const content = {
  "Is this trip right for you?": [
    "This trip includes time spent travelling in a private vehicle with your group. Extra space can be tight, and conditions may feel a little cramped. It's all part of the adventure and a great way to get to know your fellow travellers. There are a few long days of travel, as you'll be covering a lot of ground. You will, however, make stops at interesting locations to break up the longer drives. Please read the itinerary carefully for travel time estimates.",
    "As a desert country, Morocco can have extreme weather. Please consider the time of the year you wish to travel and your suitability to that season. Refer to the Climate and Seasonal Information section of the Essential Trip Information for more details.",
    "Morocco has a tipping culture and travellers are expected to tip small amounts for most services. Your trip leader and the Money Matters section of the Essential Trip Information can assist you with this.",
  ],
  Visas: ["Visa information coming soon."],
  Accommodation: ["Accommodation details coming soon."],
  "Joining point": ["Joining point details coming soon."],
};

const BeforeYouBook = () => {
  const [activeTab, setActiveTab] = useState("Is this trip right for you?");

  return (
    <section className="bg-white text-gray-800 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Before you book you should know</h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`flex items-center px-3 py-1.5 text-sm rounded-md border ${
                activeTab === tab.label
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          {content[activeTab].map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeYouBook;
