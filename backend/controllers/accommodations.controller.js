const db = require("../db");

exports.getAll = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM sustainable_accommodations");
  res.json(rows);
};
