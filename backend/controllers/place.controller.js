import pool from "../db.js";

// 1️⃣ Get categories
export const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(
      "SELECT category, COUNT(*) AS total FROM places GROUP BY category"
    );
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 2️⃣ Get places by category
export const getPlacesByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const [places] = await pool.query(
      "SELECT id, name, slug, description, image, avg_rating FROM places WHERE category = ?",
      [category]
    );

    res.json(places);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 3️⃣ Get single place
export const getPlaceBySlug = async (req, res) => {
  const { category, slug } = req.params;

  try {
    const [[place]] = await pool.query(
      "SELECT * FROM places WHERE category = ? AND slug = ?",
      [category, slug]
    );

    if (!place) return res.status(404).json({ message: "Not found" });

    const [trips] = await pool.query(
      "SELECT * FROM place_trips WHERE place_id = ?",
      [place.id]
    );

    const [deals] = await pool.query(
      "SELECT * FROM place_deals WHERE place_id = ?",
      [place.id]
    );

    const [highlights] = await pool.query(
      "SELECT * FROM place_highlights WHERE place_id = ?",
      [place.id]
    );

    const [ratings] = await pool.query(
      "SELECT rating FROM place_ratings WHERE place_id = ?",
      [place.id]
    );

    const [comments] = await pool.query(
      `SELECT pc.comment, pc.traveled_date, pc.tour_name, u.name AS reviewer
       FROM place_comments pc
       JOIN users u ON u.id = pc.user_id
       WHERE pc.place_id = ?`,
      [place.id]
    );

    const totalReviews = ratings.length;
    const overallRating =
      totalReviews === 0
        ? 0
        : ratings.reduce((a, b) => a + b.rating, 0) / totalReviews;

    const breakdown = [5, 4, 3, 2, 1].map((star) => ({
      stars: star,
      count: ratings.filter((r) => r.rating === star).length,
    }));

    res.json({
      ...place,
      trips,
      deals,
      highlights,
      reviewsData: {
        totalReviews,
        overallRating,
        breakdown,
        reviews: comments.map((c) => ({
          reviewer: c.reviewer,
          traveled: c.traveled_date,
          tourName: c.tour_name,
          review: c.comment,
        })),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
