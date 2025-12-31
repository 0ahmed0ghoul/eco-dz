import pool from "../db.js";

export const getAll = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM sustainable_accommodations");
  res.json(rows);
};
