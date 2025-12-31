<<<<<<< HEAD
import { getLastMinute } from "../data/fileHelpers.js";

export const getAll = async (req, res) => {
  try {
    const deals = await getLastMinute();
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching last minute deals", error: error.message });
=======
import db from "../db.js";

export const getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM last_minute_deals");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
>>>>>>> 9f30c1c95bd3e6e31521eab5aa07080d5559dec1
  }
};
