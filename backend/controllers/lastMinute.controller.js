import pool from "../db.js";

exports.getAll = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM last_minute_deals");
  res.json(rows);
};
