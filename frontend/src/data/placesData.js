export const placesData = [
    {
      id: 1,
      name: "Tassili n'Ajjer",
      slug: "tassili-n-ajjer",
      description: "A beautiful desert national park in Algeria.",
      location: "Southeastern Algeria",
      images: ["/images/tassili1.jpg", "/images/tassili2.jpg"],
      
      // Deals for this place
      deals: [
        {
          id: 1,
          trip: "Tassili Desert Adventure",
          route: "Algiers → Djanet → Tassili",
          date: "2026-01-10",
          days: 7,
          price: { original: 1200, discounted: 999 },
        },
        {
          id: 2,
          trip: "Tassili Cultural Tour",
          route: "Djanet → In Guezzam → Tassili",
          date: "2026-02-15",
          days: 5,
          price: { original: 800, discounted: 650 },
        },
      ],
  
      // Trips for this place
      trips: [
        { id: 1, title: "Tassili Full Exploration", days: 9, price: 2048 },
        { id: 2, title: "Tassili Quick Tour", days: 5, price: 1299 },
      ],
  
      // Highlights for this place
      highlights: [
        {
          id: 1,
          title: "Rock Art Sites",
          description:
            "Explore the prehistoric rock paintings and carvings scattered across the park.",
          image: "/images/tassili_highlight1.jpg",
        },
        {
          id: 2,
          title: "Desert Landscapes",
          description:
            "Experience stunning dunes, sandstone formations, and the unique desert wildlife.",
          image: "/images/tassili_highlight2.jpg",
        },
      ],
  
      // Reviews for this place (from place_ratings + place_comments)
      reviews: [
        {
          id: 1,
          reviewer: "Ahmed G.",
          rating: 5,
          traveled: "January 2025",
          tourName: "Tassili Desert Adventure",
          review:
            "Amazing experience! The rock art sites were breathtaking and our guide was excellent.",
        },
        {
          id: 2,
          reviewer: "Leila M.",
          rating: 4,
          traveled: "March 2025",
          tourName: "Tassili Quick Tour",
          review: "Beautiful landscapes, but the trip felt a bit rushed.",
        },
      ],
    },
  
    {
      id: 2,
      name: "Hoggar Mountains",
      slug: "hoggar-mountains",
      description: "Mountain range in the south of Algeria.",
      location: "Southern Algeria",
      images: ["/images/hoggar1.jpg"],
  
      deals: [
        {
          id: 1,
          trip: "Hoggar Trekking Adventure",
          route: "Tamanrasset → Assekrem → Hoggar",
          date: "2026-03-20",
          days: 6,
          price: { original: 950, discounted: 799 },
        },
      ],
  
      trips: [
        { id: 1, title: "Hoggar Mountains Exploration", days: 8, price: 1500 },
      ],
  
      highlights: [
        {
          id: 1,
          title: "Assekrem Sunset",
          description:
            "Witness breathtaking sunsets atop the Hoggar mountains.",
          image: "/images/hoggar_highlight1.jpg",
        },
      ],
  
      reviews: [
        {
          id: 1,
          reviewer: "Karim B.",
          rating: 5,
          traveled: "February 2025",
          tourName: "Hoggar Trekking Adventure",
          review: "Incredible trekking experience! The mountains are majestic.",
        },
      ],
    },
  ];
  