import pool from "../db.js";

export default getAllMonuments = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM monuments");
  res.json(rows);
};
