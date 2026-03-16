import pool from "../db.js";

export const createSearch = async (req, res) => {
    const { location, start_date, end_date } = req.body;
    const userId = req.user?.id || null; // optional (guest allowed)
  
    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }
  
    await pool.query(
      `INSERT INTO searches (user_id, location, start_date, end_date)
       VALUES (?, ?, ?, ?)`,
      [userId, location, start_date || null, end_date || null]
    );
  
    res.status(201).json({ message: "Search stored" });
  };

export const saveSearch = async (req, res) => {
  try {
    const userId = req.user?.id || null; // optional auth
    const { location, startDate, endDate } = req.body;

    if (!location)
      return res.status(400).json({ message: "Location required" });

    await pool.execute(
      `INSERT INTO searches (user_id, location, start_date, end_date)
       VALUES (?, ?, ?, ?)`,
      [userId, location, startDate || null, endDate || null]
    );

    res.status(201).json({ message: "Search saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRecentSearches = async (req, res) => {
    const userId = req.user?.id || null;
  
    const [rows] = await pool.query(
      `SELECT DISTINCT location
       FROM searches
       WHERE user_id <=> ?
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId]
    );
  
    res.json(rows.map(r => r.location));
  };
  
  