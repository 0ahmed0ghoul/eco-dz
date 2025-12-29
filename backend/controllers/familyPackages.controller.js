const db = require("../db");

exports.getAll = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM family_packages");
  res.json(rows);
};
