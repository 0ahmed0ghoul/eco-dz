import { getLastMinute } from "../data/fileHelpers.js";

export const getAll = async (req, res) => {
  try {
    const deals = await getLastMinute();
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching last minute deals", error: error.message });
  }
};
