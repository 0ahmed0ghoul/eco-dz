import { getAccommodations } from "../data/fileHelpers.js";

export const getAll = async (req, res) => {
  try {
    const accommodations = await getAccommodations();
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching accommodations", error: error.message });
  }
};
