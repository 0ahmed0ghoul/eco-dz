import pool from "../db.js";

/**
 * 1️⃣ Get categories
 * Returns:
 * - category
 * - total places
 * - images[] (gallery)
 */
export const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(
      `SELECT 
        category,
        COUNT(*) as total,
        GROUP_CONCAT(image) as images
      FROM places
      GROUP BY category`
    );

    const result = categories.map((cat) => ({
      category: cat.category,
      total: cat.total,
      images: cat.images ? cat.images.split(",").slice(0, 4) : [],
    }));

    res.json(result);
  } catch (err) {
    console.error("getCategories error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2️⃣ Get places by category
export const getPlacesByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const [places] = await pool.query(
      `SELECT 
        id,
        name,
        slug,
        description,
        image,
        avg_rating
      FROM places
      WHERE category = ?`,
      [category]
    );

    res.json(places);
  } catch (err) {
    console.error("getPlacesByCategory error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPlaceBySlug = async (req, res) => {
  const { category, slug } = req.params;

  try {
    const [places] = await pool.query(
      `SELECT * FROM places WHERE category = ? AND slug = ?`,
      [category, slug]
    );

    if (places.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    const place = places[0];

    // Generate mock review data
    const mockRatings = [
      { rating: 5 },
      { rating: 5 },
      { rating: 4 },
      { rating: 4 },
      { rating: 4 },
    ];

    const totalReviews = mockRatings.length;
    const overallRating =
      totalReviews === 0
        ? 0
        : mockRatings.reduce((a, b) => a + b.rating, 0) / totalReviews;

    const breakdown = [5, 4, 3, 2, 1].map((star) => ({
      stars: star,
      count: mockRatings.filter((r) => r.rating === star).length,
    }));

    const mockComments = [
      {
        reviewer: "Ahmed Hassan",
        traveled: "2024-11-15",
        tourName: "Mountain Adventure",
        review: "Amazing experience! The views were breathtaking and the guides were very knowledgeable.",
      },
      {
        reviewer: "Fatima Smith",
        traveled: "2024-10-20",
        tourName: "Nature Trek",
        review: "Great tour with wonderful scenery. Highly recommend this destination!",
      },
    ];

    res.json({
      ...place,
      trips: place.trips ? (typeof place.trips === 'string' ? JSON.parse(place.trips) : place.trips) : [],
      deals: place.deals ? (typeof place.deals === 'string' ? JSON.parse(place.deals) : place.deals) : [],
      highlights: place.highlights ? (typeof place.highlights === 'string' ? JSON.parse(place.highlights) : place.highlights) : [],
      reviewsData: {
        totalReviews,
        overallRating,
        breakdown,
        reviews: mockComments,
      },
    });
  } catch (err) {
    console.error("getPlaceBySlug error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
