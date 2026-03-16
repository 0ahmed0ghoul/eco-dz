import pool from "../db.js";

// ========================
// Get all trips
// ========================
export const getAllTrips = async (req, res) => {
  try {
    const [trips] = await pool.query(`
      SELECT 
        t.id,
        t.title,
        t.description,
        t.start_date,
        t.end_date,
        t.duration,
        t.price,
        t.category,
        t.max_people,
        t.created_at,
        t.image,
        t.place_id,
        u.id AS organizer_id,
        u.username AS organizer_name,
        u.email AS organizer_email,
        u.phone AS organizer_phone,
        u.avatar AS organizer_logo
      FROM trips t
      JOIN users u ON t.organizer_id = u.id
      WHERE t.approved = 1
      ORDER BY t.created_at DESC
    `);
    res.status(200).json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch trips" });
  }
};

// ========================
// Get single trip
// ========================
export const getTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT 
        t.*,
        u.username AS organizer_name,
        u.email AS organizer_email,
        u.phone AS organizer_phone,
        u.avatar AS organizer_logo,
        u.id AS organizer_id,
        p.name AS place_name,
        p.image AS place_image
      FROM trips t
      JOIN users u ON t.organizer_id = u.id
      JOIN places p ON t.place_id = p.id
      WHERE t.id = ? AND t.approved = 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch trip" });
  }
};

// ========================
// Create a trip
// ========================
export const createTrip = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const {
      place_id,
      title,
      description,
      start_date,
      end_date,
      duration,
      price,
      category,
      max_people,
    } = req.body;

    const [result] = await pool.query(
      `
      INSERT INTO trips
      (
        organizer_id,
        place_id,
        category,
        title,
        description,
        start_date,
        end_date,
        duration,
        price,
        max_people,
        approved
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      `,
      [
        organizerId,
        place_id,
        category,
        title,
        description,
        start_date,
        end_date,
        duration,
        price,
        max_people,
      ]
    );

    res.status(201).json({
      message: "Trip created successfully. Awaiting admin approval.",
      tripId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create trip" });
  }
};
