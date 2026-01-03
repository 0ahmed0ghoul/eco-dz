import pool from "../db.js";

export const getCategories = async (req, res) => {
  try {
    // Get only what we need
    const [rows] = await pool.query(`
      SELECT category, image
      FROM places
      WHERE image IS NOT NULL
    `);

    const categoriesMap = {};

    rows.forEach((row) => {
      if (!categoriesMap[row.category]) {
        categoriesMap[row.category] = {
          category: row.category,
          total: 0,
          images: [],
        };
      }

      categoriesMap[row.category].total += 1;

      // Push image (limit later)
      categoriesMap[row.category].images.push(row.image);
    });

    // Convert object → array + limit images per category
    const categories = Object.values(categoriesMap).map((cat) => ({
      category: cat.category,
      total: cat.total,
      images: cat.images.slice(0, 4), // 👈 limit gallery images
    }));

    res.json(categories);
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
      "SELECT id, name, slug, description, image, avg_rating FROM places WHERE category = ?",
      [category]
    );

    res.json(places);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getPlaceBySlug = async (req, res) => {
  const { category, slug } = req.params;

  try {
    const [[place]] = await pool.query(
      `
      SELECT *
      FROM places
      WHERE category = ? AND slug = ?
      `,
      [category, slug]
    );

    if (!place) {
      return res.status(404).json({ message: "Not found" });
    }

    const [trips] = await pool.query(
      "SELECT * FROM trips WHERE place_id = ?",
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
      `
      SELECT 
        pc.comment,
        pc.traveled_date,
        pc.tour_name,
        COALESCE(
          CONCAT(u.firstName, ' ', u.lastName),
          u.username
        ) AS reviewer
      FROM place_comments pc
      JOIN users u ON u.id = pc.user_id
      WHERE pc.place_id = ?
      `,
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
    console.error("getPlaceBySlug error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getAllPlacess = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM places");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlaceLikes = async (req, res) => {
  const placeId = req.params.id;
  const userId = req.user?.id || null;

  try {
    // 1️⃣ Count total likes
    const [[countRow]] = await pool.query(
      "SELECT COUNT(*) AS count FROM place_ratings WHERE place_id = ?",
      [placeId]
    );

    let likedByUser = false;

    // 2️⃣ Check if user liked (fast & safe)
    if (userId) {
      const [[existsRow]] = await pool.query(
        `
        SELECT EXISTS(
          SELECT 1
          FROM place_ratings
          WHERE user_id = ? AND place_id = ?
        ) AS liked
        `,
        [userId, placeId]
      );

      likedByUser = !!existsRow.liked;
    }

    res.json({
      count: countRow.count,
      likedByUser,
    });
  } catch (err) {
    console.error("getPlaceLikes error:", err);
    res.status(500).json({ message: "Failed to load likes" });
  }
};


export const toggleLike = async (req, res) => {
  const userId = req.user.id;
  const placeId = req.params.id;

  try {
    // Try to delete first (UNLIKE)
    const [deleteResult] = await pool.query(
      "DELETE FROM place_ratings WHERE user_id = ? AND place_id = ?",
      [userId, placeId]
    );

    let liked;

    if (deleteResult.affectedRows === 0) {
      // No row deleted → LIKE
      await pool.query(
        "INSERT INTO place_ratings (user_id, place_id, rating) VALUES (?, ?, 1)",
        [userId, placeId]
      );
      liked = true;
    } else {
      liked = false;
    }

    const [[countRow]] = await pool.query(
      "SELECT COUNT(*) AS count FROM place_ratings WHERE place_id = ?",
      [placeId]
    );

    res.json({
      liked,
      count: countRow.count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Toggle like failed" });
  }
};

export const ratePlace = async (req, res) => {
  const userId = req.user.id;
  const placeId = req.params.id;
  const { rating } = req.body; // 1–5

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Invalid rating" });
  }

  try {
    await pool.query(
      `INSERT INTO place_ratings (user_id, place_id, rating)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = ?`,
      [userId, placeId, rating, rating]
    );

    res.json({ message: "Rating saved" });
  } catch (err) {
    res.status(500).json({ message: "Rating failed" });
  }
};


export const getPlaceReviews = async (req, res) => {
  const placeId = req.params.id;

  try {
    const [reviews] = await pool.query(
      `SELECT pr.id, pr.review, pr.rating, pr.image, pr.created_at,
              CONCAT(u.firstName, ' ', u.lastName) AS reviewer
       FROM place_reviews pr
       JOIN users u ON pr.user_id = u.id
       WHERE pr.place_id = ?
       ORDER BY pr.created_at DESC`,
      [placeId]
    );

    res.json(reviews || []); // always return an array
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load reviews" });
  }
};
export const addPlaceReview = async (req, res) => {
  const userId = req.user.id;
  const placeId = req.params.id;
  const { review, rating } = req.body;
  console.log(req.file);
  let image = null;
  if (req.file) {
    // URL the frontend can use
    image = `/assets/reviews/${req.file.filename}`;
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO place_reviews (user_id, place_id, review, rating, image) VALUES (?, ?, ?, ?, ?)",
      [userId, placeId, review, rating, image]
    );

    // Return the new review
    const [[newReview]] = await pool.query(
      `SELECT pr.id, pr.review, pr.rating, pr.image, pr.created_at,
              CONCAT(u.firstName, ' ', u.lastName) AS reviewer
       FROM place_reviews pr
       JOIN users u ON pr.user_id = u.id
       WHERE pr.id = ?`,
      [result.insertId]
    );

    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add review" });
  }
};



