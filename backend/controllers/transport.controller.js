import { getTransport } from "../data/fileHelpers.js";

export const getAll = async (req, res) => {
  try {
    const transport = await getTransport();
    res.json(transport);
  } catch (err) {
    console.error("getAll error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


