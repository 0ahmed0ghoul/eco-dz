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
<<<<<<< HEAD
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
=======
    "Eco-Friendly Tours": [],
    "Sustainable Accommodations": [],
    "Green Transportation Options": [],
>>>>>>> 9f30c1c95bd3e6e31521eab5aa07080d5559dec1
  },

  // "Deals" uses dedicated pages
  Deals: {
<<<<<<< HEAD
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
=======
    "Last Minute Deals": [],
    "Family Packages": [],
    "Adventure Tours": []
>>>>>>> 9f30c1c95bd3e6e31521eab5aa07080d5559dec1
  },
};


export const popularSearches = [
  "Desert Safari",
  "Mountain Hiking",
  "Cultural Tours",
  "Eco-Lodges",
];
