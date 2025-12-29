const db = require("../db");

exports.getAll = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM last_minute_deals");
  res.json(rows);
};
