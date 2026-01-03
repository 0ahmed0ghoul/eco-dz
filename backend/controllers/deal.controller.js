import pool from "../db.js";

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
        o.id AS organizer_id,
        o.name AS organizer_name,
        o.email AS organizer_email,
        o.phone AS organizer_phone
      FROM place_deals d
      JOIN organizers o ON d.organizer_id = o.id
      ORDER BY d.created_at DESC`
    );

    res.json({ deals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch deals" });
  }
};


export const getDeal = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
        SELECT 
          d.*,
          o.name AS organizer_name,
          o.email AS organizer_email,
          o.phone AS organizer_phone
        FROM place_deals d
        JOIN organizers o ON d.organizer_id = o.id
        WHERE d.id = ? 
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

// export const createDeal = async (req, res) => {
//   try {
//     const organizerId = req.user.id;

//     const {
//       place_id,
//       title,
//       description,
//       discount_percentage,
//       start_date,
//       end_date,
//       image,
//       discounted_price,
//       original_price,
//     } = req.body;

//     const [result] = await pool.query(
//       `
//       INSERT INTO trips
//       (
//         organizer_id,
//         place_id,
//         title,
//         description,
//         discount_percentage,
//         original_price,
//         discounted_price,
//         start_date,
//         end_date,
//         image,
//         status,
//       )
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
//       `,
//       [
//         organizerId,
//         place_id,
//         title,
//         description,
//         discount_percentage,
//         original_price,
//         discounted_price,
//         start_date,
//         end_date,
//         image,
//         status,
//       ]
//     );

//     res.status(201).json({
//       message: "Trip created successfully. Awaiting admin approval.",
//       tripId: result.insertId,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to create trip" });
//   }
// };
