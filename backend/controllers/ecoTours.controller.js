import db from "../db.js";

export const getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM eco_tours");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
