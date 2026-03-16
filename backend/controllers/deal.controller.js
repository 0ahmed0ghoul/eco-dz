import pool from "../db.js";

// Get all deals with organizer info
export const getAllDeals = async (req, res) => {
  try {
    const [deals] = await pool.query(
      `SELECT 
         d.id,
         d.title,
         d.image,
         d.description,
         d.start_date,
         d.end_date,
         d.original_price,
         d.discounted_price,
         d.discount_percentage,
         d.category,
         d.created_at,
         d.place_id,
         u.id AS organizer_id,
         u.username AS organizer_name,
         u.email AS organizer_email,
         u.phone AS organizer_phone,
        u.avatar AS organizer_logo
       FROM place_deals d
       JOIN users u ON d.organizer_id = u.id
       ORDER BY d.created_at DESC`
    );
    


    res.json({ deals });
  } catch (error) {
    console.error("getAllDeals error:", error);
    res.status(500).json({ message: "Failed to fetch deals" });
  }
};

// Get a single deal with organizer info
export const getDeal = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT 
         d.*,
         u.id AS organizer_id,
         u.username AS organizer_name,
         u.email AS organizer_email,
         u.phone AS organizer_phone,
         u.id AS organizer_id,
        u.avatar AS organizer_logo,

         d.image AS deal_image
       FROM place_deals d
       JOIN users u ON d.organizer_id = u.id
       WHERE d.id = ? AND u.role = 'agency'`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Deal not found" });
    }

    // Send response once
    res.json(rows[0]);
  } catch (error) {
    console.error("getDeal error:", error);
    res.status(500).json({ message: "Failed to fetch deal" });
  }
};

