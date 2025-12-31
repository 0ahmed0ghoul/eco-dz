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
    "Eco-Friendly Tours": [],
    "Sustainable Accommodations": [],
    "Green Transportation Options": [],
  },

  // "Deals" uses dedicated pages
  Deals: {
    "Last Minute Deals": [],
    "Family Packages": [],
    "Adventure Tours": []
  },
};


export const popularSearches = [
  "Desert Safari",
  "Mountain Hiking",
  "Cultural Tours",
  "Eco-Lodges",
];
