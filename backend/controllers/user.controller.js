import pool from "../db.js";

export const getFavorites = async (req, res) => {
  const [favorites] = await db.query(
    `SELECT p.*
     FROM favorites f
     JOIN places p ON p.id = f.place_id
     WHERE f.user_id = ?`,
    [req.user.id]
  );

  res.json(favorites);
};

export const getRatings = async (req, res) => {
  const [ratings] = await db.query(
    `SELECT p.name, pr.rating
     FROM place_ratings pr
     JOIN places p ON p.id = pr.place_id
     WHERE pr.user_id = ?`,
    [req.user.id]
  );

  res.json(ratings);
};

export const becomeOrganizer = async (req, res) => {
  const { organization_name, phone, description } = req.body;

  await db.query(
    `INSERT INTO organizer_profiles (user_id, organization_name, phone, description)
     VALUES (?, ?, ?, ?)`,
    [req.user.id, organization_name, phone, description]
  );

  await db.query(
    `INSERT IGNORE INTO user_roles (user_id, role_id)
     VALUES (?, (SELECT id FROM roles WHERE name='organizer'))`,
    [req.user.id]
  );

  res.json({ message: "Organizer role added" });
};
