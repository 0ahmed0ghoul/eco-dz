import { getEcoTours } from "../data/fileHelpers.js";

export const getAll = async (req, res) => {
  try {
    const ecoTours = await getEcoTours();
    res.json(ecoTours);
  } catch (error) {
    res.status(500).json({ message: "Error fetching eco tours", error: error.message });
  }
};
