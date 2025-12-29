import { getFamilyPackages } from "../data/fileHelpers.js";

export const getAll = async (req, res) => {
  try {
    const packages = await getFamilyPackages();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching family packages", error: error.message });
  }
};
