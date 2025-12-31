import pool from "../db.js";

// Get agency dashboard
export const getAgencyDashboard = async (req, res) => {
  try {
    const agencyId = req.user.id; // from JWT middleware

    // Get agency info
    const [agencyRows] = await pool.query(
      `SELECT id, name, email, phone, website, address, description, verified
       FROM organizers
       WHERE id = ?`,
      [agencyId]
    );

    if (agencyRows.length === 0) {
      return res.status(404).json({ error: "Agency not found" });
    }

    // Get trips organized by this agency
    const [tripRows] = await pool.query(
      `SELECT id, title, description, start_date, end_date, approved
       FROM trips
       WHERE organizer_id = ?`,
      [agencyId]
    );

    res.json({
      agency: agencyRows[0],
      trips: tripRows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
