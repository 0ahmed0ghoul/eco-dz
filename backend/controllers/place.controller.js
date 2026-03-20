import pool from "../db.js";
import { getIO } from "../socket/socket.js";
// 1️⃣ Get all categories with images (limited to 4 per category)
export const getCategories = async (req, res) => {
  try {
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

      // Parse the JSON string to get the actual URL(s)
      let parsedImages = [];
      try {
        parsedImages = JSON.parse(row.image);
      } catch (e) {
        console.warn("Failed to parse image JSON:", row.image);
      }

      categoriesMap[row.category].images.push(...parsedImages);
    });

    const categories = Object.values(categoriesMap).map((cat) => ({
      category: cat.category,
      total: cat.total,
      images: cat.images.slice(0, 4), // limit to 4 images
    }));

    res.json(categories);
  } catch (err) {
    console.error("getCategories error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2️⃣ Get all places by category
export const getPlacesByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const [places] = await pool.query(
      "SELECT id, name, slug, description, image, avg_rating FROM places WHERE category = ?",
      [category]
    );

    res.json(places || []);
  } catch (err) {
    console.error("getPlacesByCategory error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 3️⃣ Get place details by category & slug
export const getPlaceBySlug = async (req, res) => {
  const { category, slug } = req.params;

  try {
    const [[place]] = await pool.query(
      "SELECT * FROM places WHERE category = ? AND slug = ?",
      [category, slug]
    );

    if (!place) return res.status(404).json({ message: "Place not found" });

    const [trips] = await pool.query("SELECT * FROM trips WHERE place_id = ?", [
      place.id,
    ]);
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
      `SELECT pc.comment, pc.traveled_date, pc.tour_name,
              COALESCE(CONCAT(u.firstName, ' ', u.lastName), u.username) AS reviewer
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
    console.error("getPlaceBySlug error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// 5️⃣ Get likes for a place
export const getPlaceLikes = async (req, res) => {
  const placeId = req.params.id;
  const userId = req.user?.id || null;

  try {
    const [[countRow]] = await pool.query(
      "SELECT COUNT(*) AS count FROM place_ratings WHERE place_id = ?",
      [placeId]
    );

    let likedByUser = false;
    if (userId) {
      const [[existsRow]] = await pool.query(
        "SELECT EXISTS(SELECT 1 FROM place_ratings WHERE user_id = ? AND place_id = ?) AS liked",
        [userId, placeId]
      );
      likedByUser = !!existsRow.liked;
    }

    res.json({ count: countRow.count, likedByUser });
  } catch (err) {
    console.error("getPlaceLikes error:", err);
    res.status(500).json({ message: "Failed to load likes" });
  }
};

// 6️⃣ Toggle like
export const toggleLike = async (req, res) => {
  const userId = req.user.id;
  const placeId = req.params.id;

  try {
    const [deleteResult] = await pool.query(
      "DELETE FROM place_ratings WHERE user_id = ? AND place_id = ?",
      [userId, placeId]
    );

    let liked = false;
    if (deleteResult.affectedRows === 0) {
      await pool.query(
        "INSERT INTO place_ratings (user_id, place_id, rating) VALUES (?, ?, 1)",
        [userId, placeId]
      );
      liked = true;
    }

    const [[countRow]] = await pool.query(
      "SELECT COUNT(*) AS count FROM place_ratings WHERE place_id = ?",
      [placeId]
    );
    res.json({ liked, count: countRow.count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Toggle like failed" });
  }
};

// 7️⃣ Rate place
export const ratePlace = async (req, res) => {
  const userId = req.user.id;
  const placeId = req.params.id;
  const { rating } = req.body;

  if (rating < 1 || rating > 5)
    return res.status(400).json({ message: "Invalid rating" });

  try {
    await pool.query(
      `INSERT INTO place_ratings (user_id, place_id, rating)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = ?`,
      [userId, placeId, rating, rating]
    );

    res.json({ message: "Rating saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Rating failed" });
  }
};

// 8️⃣ Get place reviews
export const getPlaceReviews = async (req, res) => {
  const placeId = req.params.id;

  try {
    const [reviews] = await pool.query(
      `SELECT 
          pr.id, 
          pr.review, 
          pr.rating, 
          pr.created_at,
          CONCAT(u.firstName, ' ', u.lastName) AS reviewer, 
          u.avatar AS reviewer_logo,
          IFNULL(GROUP_CONCAT(pri.image SEPARATOR ','), '') AS images
       FROM place_reviews pr
       JOIN users u ON pr.user_id = u.id
       LEFT JOIN place_review_images pri ON pr.id = pri.review_id
       WHERE pr.place_id = ?
       GROUP BY pr.id
       ORDER BY pr.created_at DESC`,
      [placeId]
    );

    // Convert the GROUP_CONCAT string into an array
    const formattedReviews = reviews.map((r) => ({
      ...r,
      images: r.images ? r.images.split(",") : [],
    }));

    res.json(formattedReviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load reviews" });
  }
};


export const addPlaceReview = async (req, res) => {
  const userId = req.user.id;
  const placeId = req.params.id;
  const { review, rating } = req.body;

  try {
    // 1️⃣ Insert review into DB
    const [result] = await pool.query(
      `INSERT INTO place_reviews (user_id, place_id, review, rating)
       VALUES (?, ?, ?, ?)`,
      [userId, placeId, review, rating]
    );

    const reviewId = result.insertId;

    // 2️⃣ Insert images if provided
    if (req.files && req.files.length > 0) {
      const imagesData = req.files.map(file => [reviewId, file.filename]);

      await pool.query(
        `INSERT INTO place_review_images (review_id, image) VALUES ?`,
        [imagesData]
      );
    }

    // 3️⃣ Fetch the created review with reviewer info - FIXED QUERY
    const [[newReview]] = await pool.query(
      `SELECT 
        pr.id,
        pr.review,
        pr.rating,
        pr.created_at,
        CONCAT(u.firstName, ' ', u.lastName) AS reviewer,
        u.avatar AS reviewer_logo,
        u.id as reviewer_id  -- This line is critical for real-time updates
      FROM place_reviews pr
      JOIN users u ON pr.user_id = u.id
      WHERE pr.id = ?`,
      [reviewId]
    );

    // Fetch images
    const [images] = await pool.query(
      `SELECT image FROM place_review_images WHERE review_id = ?`,
      [reviewId]
    );
    newReview.images = images.map(i => i.image);

    // Add debug logging
    console.log("📢 Emitting socket event for new review:", {
      placeId,
      reviewId: newReview.id,
      reviewer: newReview.reviewer,
      reviewer_id: newReview.reviewer_id,
      socketRoom: `review-place-${placeId}`
    });

    // 4️⃣ Emit real-time socket event to the place room
    const io = getIO();
    
    // Get the room to debug
    const room = io.sockets.adapter.rooms.get(`review-place-${placeId}`);
    console.log(`👥 Users in room review-place-${placeId}:`, room ? room.size : 0);
    
    // Emit the event
    io.to(`review-place-${placeId}`).emit("new-review-added", {
      placeId: parseInt(placeId), // Ensure it's a number
      review: {
        id: newReview.id,
        reviewer_id: newReview.reviewer_id || userId, // Use from query or fallback
        reviewer: newReview.reviewer,
        reviewer_logo: newReview.reviewer_logo,
        review: newReview.review,
        rating: newReview.rating,
        created_at: newReview.created_at,
        images: newReview.images || [],
        likes: 0,
        dislikes: 0,
        replies: [],
      },
    });

    // 5️⃣ Respond to the request - also include reviewer_id in response
    res.status(201).json({
      success: true,
      review: {
        ...newReview,
        reviewer_id: newReview.reviewer_id || userId, // Include in response
        likes: 0,
        dislikes: 0,
        replies: [],
      },
    });
  } catch (err) {
    console.error("addPlaceReview error:", err);
    res.status(500).json({ message: "Failed to add review" });
  }
};



// 4️⃣ Get all places
export const getAllPlaces = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM places");
    res.json(rows || []);
  } catch (error) {
    console.error("getAllPlaces error:", error);
    res.status(500).json({ message: error.message });
  }
};