import pool from "../db.js";

exports.getAll = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM family_packages");
  res.json(rows);
};
