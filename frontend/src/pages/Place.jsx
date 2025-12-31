import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceOverview from "../components/place/Overview";
import TravelDeals from "../components/place/TravelDeals";
import PlaceTrips from "../components/place/trips";
import PlaceHighlights from "../components/place/Highlights";
import ReviewsSection from "../components/ReviewsSection";
import Comments from "../components/Comments";

// Fetch and display deals/packages/tours as destination
const DealsDisplay = ({ category, type = "deals" }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    let url;
    switch(type) {
      case "deals":
        url = "http://localhost:5000/api/deals/last-minute";
        break;
      case "family":
        url = "http://localhost:5000/api/deals/family";
        break;
      case "adventure":
        url = "http://localhost:5000/api/deals/adventure";
        break;
      case "ways-to-travel":
        // Determine if accommodations or transport
        if (category.startsWith('ways-to-travel-accommodations') || category.startsWith('ways-to-travel-lodges')) {
          url = "http://localhost:5000/api/deals/accommodations";
        } else {
          url = "http://localhost:5000/api/deals/transport";
        }
        break;
      default:
        url = "http://localhost:5000/api/deals/last-minute";
    }
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        let filtered = data;
        
        if (type === "deals") {
          const categoryMap = {
            "deals-flash": "Flash Sale",
            "deals-weekend": "Weekend Escape",
            "deals-early": "Early Bird Special",
            "deals-all": null
          };
          const dealType = categoryMap[category];
          filtered = dealType ? data.filter(d => d.type === dealType) : data;
        } else if (type === "family") {
          const categoryMap = {
            "family-desert": "Family Desert Tours",
            "family-mountain": "Mountain Adventure Packs",
            "family-beach": "Beach & Lake Combos",
            "family-all": null
          };
          const familyType = categoryMap[category];
          filtered = familyType ? data.filter(d => d.type === familyType) : data;
        } else if (type === "adventure") {
          const categoryMap = {
            "adventure-climbing": "Extreme Rock Climbs",
            "adventure-desert": "Desert Survival Expeditions",
            "adventure-mountain": "High Altitude Mountaineering",
            "adventure-all": null
          };
          const adventureType = categoryMap[category];
          filtered = adventureType ? data.filter(d => d.type === adventureType) : data;
        } else if (type === "ways-to-travel") {
          const categoryMap = {
            "ways-to-travel-lodges": "Mountain Lodges",
            "ways-to-travel-camps": "Desert Camps",
            "ways-to-travel-resorts": "Beach & Coastal Resorts",
            "ways-to-travel-accommodations": null,
            "ways-to-travel-electric": "Electric Vehicles",
            "ways-to-travel-bikes": "Human-Powered",
            "ways-to-travel-renewable": "Renewable Energy",
            "ways-to-travel-transport": null,
            "ways-to-travel-all": null
          };
          const waysType = categoryMap[category];
          filtered = waysType ? data.filter(d => d.category === waysType) : data;
        }
        
        setItems(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching items:", err);
        setLoading(false);
      });
  }, [category, type]);

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  // Get title based on category
  const getTitleByCategory = () => {
    if (type === "deals") {
      switch(category) {
        case 'deals-flash': return 'Flash Sales';
        case 'deals-weekend': return 'Weekend Escapes';
        case 'deals-early': return 'Early Bird Specials';
        case 'deals-all': return 'Browse All Deals';
        default: return 'Special Deals';
      }
    } else if (type === "family") {
      switch(category) {
        case 'family-desert': return 'Family Desert Tours';
        case 'family-mountain': return 'Mountain Adventure Packs';
        case 'family-beach': return 'Beach & Lake Combos';
        case 'family-all': return 'Browse Family Packages';
        default: return 'Family Packages';
      }
    } else if (type === "adventure") {
      switch(category) {
        case 'adventure-climbing': return 'Extreme Rock Climbs';
        case 'adventure-desert': return 'Desert Survival Expeditions';
        case 'adventure-mountain': return 'High Altitude Mountaineering';
        case 'adventure-all': return 'Browse Adventure Tours';
        default: return 'Adventure Tours';
      }
    } else if (type === "ways-to-travel") {
      switch(category) {
        case 'ways-to-travel-lodges': return 'Mountain Lodges';
        case 'ways-to-travel-camps': return 'Desert Camps';
        case 'ways-to-travel-resorts': return 'Beach & Coastal Resorts';
        case 'ways-to-travel-accommodations': return 'Browse Accommodations';
        case 'ways-to-travel-electric': return 'Electric Vehicles';
        case 'ways-to-travel-bikes': return 'Bicycle & E-Bike Tours';
        case 'ways-to-travel-renewable': return 'Renewable Energy Transport';
        case 'ways-to-travel-transport': return 'Browse Transportation';
        case 'ways-to-travel-all': return 'Explore Ways to Travel';
        default: return 'Ways to Travel';
      }
    }
  };

  return (
    <section className="p-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-2 text-gray-900">{getTitleByCategory()}</h2>
        <p className="text-gray-600 mb-8">
          {type === "deals" 
            ? "Discover amazing eco-friendly travel deals and save big on your next adventure"
            : type === "family"
            ? "Create unforgettable family memories with our specially curated packages"
            : type === "adventure"
            ? "Experience thrilling expeditions for adventure seekers and experienced explorers"
            : "Sustainable accommodations and eco-friendly transportation for your travels"}
        </p>
        
        {items.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No items available in this category.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                {item.image && (
                  <img src={item.image} alt={item.name} className="h-48 w-full object-cover hover:scale-105 transition-transform duration-300" />
                )}
                <div className="p-4">
                  <div className="mb-2 inline-block bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {item.type}
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="space-y-1 text-xs text-gray-600 mb-4">
                    <p><strong>📍 Location:</strong> {item.destination}</p>
                    {type === "deals" ? (
                      <>
                        <p><strong>💰 Price:</strong> ${item.price_per_day}/day</p>
                        <p><strong>👥 Capacity:</strong> {item.capacity} people</p>
                      </>
                    ) : type === "family" ? (
                      <>
                        <p><strong>💰 Price:</strong> ${item.price} total</p>
                        <p><strong>⏱️ Duration:</strong> {item.duration} days</p>
                        <p><strong>👥 Group Size:</strong> {item.groupSize}</p>
                      </>
                    ) : type === "adventure" ? (
                      <>
                        <p><strong>💰 Price:</strong> ${item.price} total</p>
                        <p><strong>⏱️ Duration:</strong> {item.duration} days</p>
                        <p><strong>🎯 Difficulty:</strong> {item.difficulty}</p>
                        <p><strong>👥 Group Size:</strong> {item.group_size} people</p>
                      </>
                    ) : (
                      <>
                        {item.price_per_night ? (
                          <>
                            <p><strong>💰 Price:</strong> ${item.price_per_night}/night</p>
                            <p><strong>🛏️ Rooms:</strong> {item.rooms}</p>
                            <p><strong>🌱 Sustainability:</strong> {item.sustainability}</p>
                          </>
                        ) : (
                          <>
                            <p><strong>💰 Capacity:</strong> {item.capacity} people</p>
                            <p><strong>📏 Range:</strong> {item.range || item.distance}</p>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <p className="text-emerald-600 text-sm font-semibold">
                      {type === "deals" ? `✓ ${item.co2_savings}` : type === "family" ? "✓ Family Friendly" : type === "adventure" ? "✓ Expert Guided" : "✓ Eco-Friendly"}
                    </p>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-semibold">
                      {type === "ways-to-travel" ? "Book/Reserve" : "Book Now"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Fake data for fallback
const generateMockPlace = (category, slug) => {
  const mockPlaces = {
    "tour-tassili-adventure": {
      id: 101,
      name: "Tassili Adventure Tour",
      slug: "tour-tassili-adventure",
      category: "eco-friendly-tours",
      destination: "Illizi – Algeria",
      lat: 25.3,
      lng: 8.2,
      image: "/assets/destinations/Tassili.avif",
      description: "Explore the stunning Tassili n'Ajjer National Park with its prehistoric rock art and unique landscapes.",
      physicalRating: 4,
      avg_rating: 4.9,
      trips: [
        { id: 1, name: "Rock Art Expedition", duration: "7 days", price: 850 },
        { id: 2, name: "Photography Tour", duration: "5 days", price: 650 },
      ],
      deals: [
        { id: 1, name: "Early Bird Discount", discount: "15%" },
        { id: 2, name: "Group Package", discount: "20%" },
      ],
      highlights: ["Prehistoric rock art", "Sandstone formations", "UNESCO Heritage"],
      reviewsData: {
        totalReviews: 145,
        overallRating: 4.8,
        breakdown: [
          { stars: 5, count: 100 },
          { stars: 4, count: 35 },
          { stars: 3, count: 8 },
          { stars: 2, count: 2 },
          { stars: 1, count: 0 },
        ],
        reviews: [
          { reviewer: "Ahmed Hassan", traveled: "2024-11-15", tourName: "Rock Art Expedition", review: "Amazing experience! The views were breathtaking and the guides were very knowledgeable." },
          { reviewer: "Fatima Smith", traveled: "2024-10-20", tourName: "Photography Tour", review: "Great tour with wonderful scenery. Highly recommend!" },
        ]
      }
    },
    "tour-ahaggar-expedition": {
      id: 102,
      name: "Ahaggar Mountains Expedition",
      slug: "tour-ahaggar-expedition",
      category: "eco-friendly-tours",
      destination: "Tamanrasset – Algeria",
      lat: 23.29,
      lng: 5.53,
      image: "/assets/destinations/Alhaggar.jpg",
      description: "Discover the dramatic peaks and vast deserts of the Ahaggar Mountains with experienced guides.",
      physicalRating: 5,
      avg_rating: 4.7,
      trips: [
        { id: 3, name: "Desert Trek", duration: "8 days", price: 1200 },
        { id: 4, name: "Camel Expedition", duration: "10 days", price: 1500 },
      ],
      deals: [
        { id: 3, name: "Winter Special", discount: "25%" },
      ],
      highlights: ["Volcanic landscape", "Tuareg culture", "Desert trekking"],
      reviewsData: {
        totalReviews: 98,
        overallRating: 4.7,
        breakdown: [
          { stars: 5, count: 70 },
          { stars: 4, count: 20 },
          { stars: 3, count: 6 },
          { stars: 2, count: 2 },
          { stars: 1, count: 0 },
        ],
        reviews: [
          { reviewer: "Mohammed Ali", traveled: "2024-12-01", tourName: "Desert Trek", review: "Unforgettable journey through the desert!" },
          { reviewer: "Layla Ben", traveled: "2024-11-25", tourName: "Camel Expedition", review: "Incredible experience with authentic Tuareg guides." },
        ]
      }
    },
    "tour-mount-chelia-hiking": {
      id: 103,
      name: "Mount Chelia Hiking Challenge",
      slug: "tour-mount-chelia-hiking",
      category: "eco-friendly-tours",
      destination: "Khenchela – Algeria",
      lat: 35.43,
      lng: 7.15,
      image: "/assets/destinations/Chelia_2.jpg",
      description: "Climb the highest peak in the Aurès Mountains and enjoy breathtaking panoramic views.",
      physicalRating: 5,
      avg_rating: 4.6,
      trips: [
        { id: 5, name: "Summit Challenge", duration: "4 days", price: 450 },
        { id: 6, name: "Family Hike", duration: "3 days", price: 350 },
      ],
      deals: [
        { id: 4, name: "Group Discount", discount: "18%" },
      ],
      highlights: ["Highest peak", "Cedar forests", "Panoramic views"],
      reviewsData: {
        totalReviews: 76,
        overallRating: 4.6,
        breakdown: [
          { stars: 5, count: 55 },
          { stars: 4, count: 16 },
          { stars: 3, count: 4 },
          { stars: 2, count: 1 },
          { stars: 1, count: 0 },
        ],
        reviews: [
          { reviewer: "Karim Ben", traveled: "2024-10-10", tourName: "Summit Challenge", review: "Epic hike with stunning views at the top!" },
          { reviewer: "Aisha Mohamed", traveled: "2024-09-28", tourName: "Family Hike", review: "Perfect family adventure, guides were very helpful." },
        ]
      }
    }
  };

  return mockPlaces[slug] || {
    id: Math.random(),
    name: slug.replace(/-/g, " ").toUpperCase(),
    slug: slug,
    category: category,
    destination: "Algeria",
    lat: 28.0,
    lng: 2.0,
    image: "/assets/destinations/Tassili.avif",
    description: "Experience the beauty and culture of Algeria with our eco-friendly tours.",
    physicalRating: 3,
    avg_rating: 4.5,
    trips: [
      { id: 1, name: "Standard Tour", duration: "5 days", price: 599 },
      { id: 2, name: "Premium Tour", duration: "7 days", price: 899 },
    ],
    deals: [
      { id: 1, name: "Early Bird", discount: "10%" },
      { id: 2, name: "Group Package", discount: "15%" },
    ],
    highlights: ["Beautiful scenery", "Expert guides", "Comfortable accommodation"],
    reviewsData: {
      totalReviews: 50,
      overallRating: 4.5,
      breakdown: [
        { stars: 5, count: 35 },
        { stars: 4, count: 12 },
        { stars: 3, count: 3 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
      ],
      reviews: [
        { reviewer: "User One", traveled: "2024-12-15", tourName: "Standard Tour", review: "Great experience!" },
        { reviewer: "User Two", traveled: "2024-12-10", tourName: "Premium Tour", review: "Highly recommended!" },
      ]
    }
  };
};

const Destination = () => {
  const { category, slug } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlace = async () => {
      // If this is a deals category, don't try to fetch place data
      if (category.startsWith('deals-')) {
        setLoading(false);
        return;
      }

      // Validate slug - if it's 'undefined' or empty, it's an invalid route
      if (!slug || slug === 'undefined') {
        setPlace(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const encodedCategory = encodeURIComponent(category);
        const encodedSlug = encodeURIComponent(slug);

        const res = await fetch(
          `http://localhost:5000/api/places/${encodedCategory}/${encodedSlug}`
        );

        if (!res.ok) {
          // Use mock data as fallback
          const mockData = generateMockPlace(category, slug);
          setPlace(mockData);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setPlace(data);
      } catch (error) {
        console.error("Error fetching place:", error);
        // Use mock data as fallback
        const mockData = generateMockPlace(category, slug);
        setPlace(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [category, slug]);

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  // Check if this is a deals, family packages, adventure tours, or ways-to-travel category
  const isDealCategory = category && category.startsWith('deals-');
  const isFamilyCategory = category && category.startsWith('family-');
  const isAdventureCategory = category && category.startsWith('adventure-');
  const isWaysToTravelCategory = category && category.startsWith('ways-to-travel-');

  if (isDealCategory) {
    return <DealsDisplay category={category} type="deals" />;
  }

  if (isFamilyCategory) {
    return <DealsDisplay category={category} type="family" />;
  }

  if (isAdventureCategory) {
    return <DealsDisplay category={category} type="adventure" />;
  }

  if (isWaysToTravelCategory) {
    return <DealsDisplay category={category} type="ways-to-travel" />;
  }

  if (!place) {
    return (
      <section className="p-8 text-center">
        <h2 className="text-2xl font-bold">Place not found</h2>
        <p className="mt-2 text-gray-600">
          <button 
            onClick={() => window.history.back()}
            className="text-blue-600 hover:underline"
          >
            Go back
          </button>
        </p>
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
      <div className="p-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <Comments 
            destinationId={place.id.toString()} 
            destinationType="place" 
          />
        </div>
      </div>
    </section>
  );
};

export default Destination;
