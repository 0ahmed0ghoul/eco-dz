import { getAdventureTours } from "../data/fileHelpers.js";

export const getAll = async (req, res) => {
  try {
    const tours = await getAdventureTours();
    res.json(tours);
  } catch (error) {
    res.status(500).json({ message: "Error fetching adventure tours", error: error.message });
  }
};
