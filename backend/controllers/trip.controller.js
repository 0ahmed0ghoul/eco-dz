import pool from "../db.js";

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
        t.place_id,
        o.id AS organizer_id,
        o.name AS organizer_name,
        o.email AS organizer_email,
        o.phone AS organizer_phone
      FROM trips t
      JOIN organizers o ON t.organizer_id = o.id
      WHERE t.approved = 1
      ORDER BY t.created_at DESC
    `);

    res.status(200).json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch trips" });
  }
};

export const getTrip = async (req, res) => {
    try {
      const { id } = req.params;
  
      const [rows] = await pool.query(
        `
        SELECT 
          t.*,
          o.name AS organizer_name,
          o.email AS organizer_email,
          o.phone AS organizer_phone
        FROM trips t
        JOIN organizers o ON t.organizer_id = o.id
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
        max_people,
      } = req.body;
  
      const [result] = await pool.query(
        `
        INSERT INTO trips
        (
          organizer_id,
          place_id,
          title,
          description,
          start_date,
          end_date,
          duration,
          price,
          max_people,
          approved
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        `,
        [
          organizerId,
          place_id,
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
  