export const navLinks = [
  "Places",
  "Ways to Travel",
  "Deals",
  "Map",
  "Quizzes"
];

// Only Places has submenu structure with actual destinations
export const menuData = {
  Places: {
    Desert: [
      { "Tassili n'Ajjer National Park": "tassili-n-ajjer-national-park" },
      { "Hoggar Mountains (Ahaggar)": "hoggar-mountains-ahaggar" },
      { "Mount Tahat": "mount-tahat" },
    ],

    Park: [
      { "Chréa National Park": "chrea-national-park" },
    ],

    Lake: [
      { "Beni Haroun Dam & Lake": "beni-haroun-dam-lake" },
      { "Lac Oubeira": "lac-oubeira" },
    ],

    Cave: [
      { "Zahlane Caves": "zahlane-caves" },
    ],

    Mountain: [
      { "Mount Chelia": "mount-chelia" },
      { "Beni Salah Mountain": "beni-salah-mountain" },
    ],

    Forest: [
      { "Atlas Cedar Forest in Mount Chelia": "atlas-cedar-forest-mount-chelia" },
    ],

    Beach: [
      { "Sidi Fredj Coast": "sidi-fredj-coast" },
    ],

    Waterfall: [
      { "Hammam Meskhoutine": "hammam-meskhoutine" },
    ],

    "All Destinations": [],
  },

  // "Ways to Travel" uses dedicated pages - not the place system
  "Ways to Travel": {
    "Sustainable Accommodations": [
      { "Mountain Lodges": "ways-to-travel-lodges" },
      { "Desert Camps": "ways-to-travel-camps" },
      { "Beach & Coastal Resorts": "ways-to-travel-resorts" },
      { "Browse All Accommodations": "ways-to-travel-accommodations" },
    ],
    "Green Transportation": [
      { "Electric Vehicles": "ways-to-travel-electric" },
      { "Bicycle & E-Bike Tours": "ways-to-travel-bikes" },
      { "Renewable Energy Transport": "ways-to-travel-renewable" },
      { "Browse All Transportation": "ways-to-travel-transport" },
    ],
  },

  // "Deals" uses dedicated pages
  Deals: {
    "Last Minute Deals": [
      { "Weekend Escapes": "deals-weekend" },
      { "Flash Sales": "deals-flash" },
      { "Early Bird Specials": "deals-early" },
      { "Browse All Deals": "deals-all" },
    ],
    "Family Packages": [
      { "Family Desert Tours": "family-desert" },
      { "Mountain Adventure Packs": "family-mountain" },
      { "Beach & Lake Combos": "family-beach" },
      { "Browse Family Packages": "family-all" },
    ],
    "Adventure Tours": [
      { "Extreme Rock Climbs": "adventure-climbing" },
      { "Desert Survival Expeditions": "adventure-desert" },
      { "High Altitude Mountaineering": "adventure-mountain" },
      { "Browse Adventure Tours": "adventure-all" },
    ],
  },
};


export const popularSearches = [
  "Desert Safari",
  "Mountain Hiking",
  "Cultural Tours",
  "Eco-Lodges",
];
