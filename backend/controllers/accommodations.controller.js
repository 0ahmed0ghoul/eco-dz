<<<<<<< HEAD
import { getAccommodations } from "../data/fileHelpers.js";

export const getAll = async (req, res) => {
  try {
    const accommodations = await getAccommodations();
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching accommodations", error: error.message });
  }
=======
import pool from "../db.js";

export const getAll = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM sustainable_accommodations");
  res.json(rows);
>>>>>>> 9f30c1c95bd3e6e31521eab5aa07080d5559dec1
};
