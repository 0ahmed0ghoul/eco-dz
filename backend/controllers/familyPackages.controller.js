<<<<<<< HEAD
import { getFamilyPackages } from "../data/fileHelpers.js";

export const getAll = async (req, res) => {
  try {
    const packages = await getFamilyPackages();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching family packages", error: error.message });
=======
import db from "../db.js";

export const getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM family_packages");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
>>>>>>> 9f30c1c95bd3e6e31521eab5aa07080d5559dec1
  }
};
