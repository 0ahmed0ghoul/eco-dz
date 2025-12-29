const db = require("../db");

exports.getAll = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM adventure_tours");
  res.json(rows);
};
