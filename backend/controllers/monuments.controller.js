const db = require("../db");

exports.getAllMonuments = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM monuments");
  res.json(rows);
};
