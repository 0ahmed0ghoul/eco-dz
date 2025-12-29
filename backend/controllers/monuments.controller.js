import pool from "../db.js";

export const getAllMonuments = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM monuments");
  res.json(rows);
};
