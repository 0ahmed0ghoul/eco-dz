<<<<<<< HEAD
import { getTransport } from "../data/fileHelpers.js";

export const getAll = async (req, res) => {
  try {
    const transport = await getTransport();
    res.json(transport);
  } catch (err) {
    console.error("getAll error:", err);
    res.status(500).json({ message: "Server error" });
=======
import db from "../db.js";

export const getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM green_transportation");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
>>>>>>> 9f30c1c95bd3e6e31521eab5aa07080d5559dec1
  }
};


