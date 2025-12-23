import { db } from "../db.js";

export const getAllPlaces = async (req, res) => {
  const [places] = await db.query("SELECT * FROM places");
  res.json(places);
};

export const ratePlace = async (req, res) => {
  const { rating } = req.body;
  const placeId = req.params.id;
  const userId = req.user.id;

  await db.query(
    `INSERT INTO place_ratings (user_id, place_id, rating)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
    [userId, placeId, rating]
  );

  // update average rating
  await db.query(
    `UPDATE places
     SET avg_rating = (
       SELECT AVG(rating) FROM place_ratings WHERE place_id = ?
     )
     WHERE id = ?`,
    [placeId, placeId]
  );

  res.json({ message: "Rating submitted" });
};

export const commentPlace = async (req, res) => {
  const { comment } = req.body;
  const placeId = req.params.id;

  await db.query(
    "INSERT INTO place_comments (user_id, place_id, comment) VALUES (?, ?, ?)",
    [req.user.id, placeId, comment]
  );

  res.json({ message: "Comment added" });
};

export const favoritePlace = async (req, res) => {
  const placeId = req.params.id;

  await db.query(
    "INSERT IGNORE INTO favorites (user_id, place_id) VALUES (?, ?)",
    [req.user.id, placeId]
  );

  res.json({ message: "Place added to favorites" });
};
