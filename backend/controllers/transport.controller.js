const db = require("../db");

exports.getAll = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM green_transportation");
  res.json(rows);
};
