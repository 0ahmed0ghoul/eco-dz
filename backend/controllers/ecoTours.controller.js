<<<<<<< HEAD
import { getEcoTours } from "../data/fileHelpers.js";

export const getAll = async (req, res) => {
  try {
    const ecoTours = await getEcoTours();
    res.json(ecoTours);
  } catch (error) {
    res.status(500).json({ message: "Error fetching eco tours", error: error.message });
=======
import db from "../db.js";

export const getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM eco_tours");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
>>>>>>> 9f30c1c95bd3e6e31521eab5aa07080d5559dec1
  }
};
