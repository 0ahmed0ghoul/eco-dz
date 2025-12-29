import pool from "../db.js";

export default getAll = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM green_transportation");
  res.json(rows);
};


