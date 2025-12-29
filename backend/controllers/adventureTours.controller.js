import pool from "../db.js";

exports.getAll = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM adventure_tours");
  res.json(rows);
};
