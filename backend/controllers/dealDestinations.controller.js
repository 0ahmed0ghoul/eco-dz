import { getDealDestinations } from "../data/fileHelpers.js";

export const getAll = async (req, res) => {
  try {
    const deals = await getDealDestinations();
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching deal destinations", error: error.message });
  }
};
