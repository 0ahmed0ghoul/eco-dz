import pool from "../db.js";
import path from "path";
import fs from "fs";



export const getAgencyDashboard = async (req, res) => {
  try {
    const agencyId = req.user.id;

    const [agencyRows] = await pool.query(
      `SELECT id, username AS name, email, phone, website, address, description, avatar, verified
       FROM users
       WHERE id = ? AND role = "agency"`,
      [agencyId]
    );

    if (!agencyRows.length) {
      return res.status(404).json({ error: "Agency not found" });
    }

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

export const getAgency = async (req, res) => {
  try {
    const agencyId = req.params.id;

    const [agencyRows] = await pool.query(
      `SELECT id, username AS name, email, phone, website, address, description, avatar, verified
       FROM users
       WHERE id = ? AND role = "agency"`,
      [agencyId]
    );

    if (!agencyRows.length) {
      return res.status(404).json({ error: "Agency not found" });
    }


    res.json({
      agency: agencyRows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
export const getAgencyTrips = async (req, res) => {
  try {
    const agencyId = req.params.id;

    const [trips] = await pool.query(
      `SELECT * FROM trips WHERE organizer_id = ? ORDER BY created_at DESC`,
      [agencyId]
    );
    trips.forEach(trip => {
      trip.image = trip.image ? JSON.parse(trip.image) : [];
    });
    res.json({ trips });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch trips" });
  }
};
export const getAgencyDeals = async (req, res) => {
  try {
    const agencyId = req.params.id;

    const [deals] = await pool.query(
      `SELECT * FROM place_deals
       WHERE organizer_id = ?
       ORDER BY created_at DESC`,
      [agencyId]
    );

    res.json({ deals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch deals" });
  }
};



export const getAgencyProfile = async (req, res) => {
  try {
    const agencyId = req.user.id;

    const [agencyRows] = await pool.query(
      `SELECT id, username AS name, email, phone, website, address, description, avatar, role
       FROM users
       WHERE id = ? AND role = "agency"`,
      [agencyId]
    );

    if (!agencyRows.length) {
      return res.status(404).json({ error: "Agency not found" });
    }

    const agency = agencyRows[0];
    // Prepend full URL if logo exists
    agency.logo = agency.logo
      ? `${req.protocol}://${req.get("host")}/assets/reviews/${agency.logo}`
      : null;

    res.json({ agency });
  } catch (err) {
    console.error("getAgencyProfile error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const getAgencyDashboardTrips = async (req, res) => {
  try {
    const agencyId = req.user.id;

    const [trips] = await pool.query(
      `SELECT * FROM trips WHERE organizer_id = ? ORDER BY created_at DESC`,
      [agencyId]
    );

    const [agencyRows] = await pool.query(
      `SELECT id, username AS name, email, phone, website, address, description, logo
       FROM users
       WHERE id = ? AND role = "agency"`,
      [agencyId]
    );

    const agency = agencyRows[0] || null;
    trips.forEach(trip => {
      trip.image = trip.image ? JSON.parse(trip.image) : [];
    });
    res.json({ trips, agency });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch trips" });
  }
};
export const addAgencyDashboardTrips = async (req, res) => {
  try {
    const agencyId = req.user.id;

    const {
      place_id,
      title,
      description,
      start_date,
      end_date,
      category,
      duration,
      price,
      max_people,
    } = req.body;

    if (!place_id || !title || !start_date || !end_date || !duration || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ DEFINE images FIRST
    const images = (req.files || []).map(
      (file) => `/uploads/trips/${file.filename}`
    );
    const [result] = await pool.query(
      `INSERT INTO trips
       (organizer_id, place_id, category, title, description, start_date, end_date, duration, price, max_people, image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        agencyId,
        place_id,
        category,
        title,
        description,
        start_date,
        end_date,
        duration,
        price,
        max_people,
        JSON.stringify(images),
      ]
    );

    res.status(201).json({
      message: "Trip created successfully",
      tripId: result.insertId,
      images,
    });

  } catch (error) {
    console.error("Create trip error:", error);
    res.status(500).json({ message: "Failed to create trip" });
  }
};

export const updateAgencyTrip = async (req, res) => {
  try {
    const agencyId = req.user.id;
    const tripId = req.params.id;
    const {
      title,
      description,
      start_date,
      end_date,
      duration,
      price,
      max_people,
    } = req.body;

    const [result] = await pool.query(
      `UPDATE trips
       SET title = ?, description = ?, start_date = ?, end_date = ?, duration = ?, price = ?, max_people = ?
       WHERE id = ? AND organizer_id = ?`,
      [
        title,
        description,
        start_date,
        end_date,
        duration,
        price,
        max_people,
        tripId,
        agencyId,
      ]
    );

    if (result.affectedRows === 0)
      return res
        .status(403)
        .json({ message: "Trip not found or not authorized" });

    res.json({ message: "Trip updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update trip" });
  }
};
export const getAgencyTripById = async (req, res) => {
  try {
    const agencyId = req.user.id;
    const tripId = req.params.id;

    const [rows] = await pool.query(
      `SELECT t.*, p.name AS place_name
       FROM trips t
       JOIN places p ON t.place_id = p.id
       WHERE t.id = ? AND t.organizer_id = ?`,
      [tripId, agencyId]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Trip not found" });

    const trip = rows[0];

    // For simplicity, assume images are stored in "uploads/trips/" folder with filenames in DB
    // Adjust if you have a separate images table
    const imageFolder = path.join("uploads", "trips");
    const images = fs.existsSync(imageFolder)
      ? fs
          .readdirSync(imageFolder)
          .filter((f) => f.includes(`trip_${tripId}_`))
          .map((f) => `/uploads/trips/${f}`)
      : [];

    res.json({ ...trip, images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch trip" });
  }
};
export const deleteAgencyTrip = async (req, res) => {
  try {
    const agencyId = req.user.id;
    const tripId = req.params.id;

    const [result] = await pool.query(
      `DELETE FROM trips WHERE id = ? AND organizer_id = ?`,
      [tripId, agencyId]
    );

    if (result.affectedRows === 0)
      return res
        .status(403)
        .json({ message: "Trip not found or not authorized" });

    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete trip" });
  }
};

export const getAgencyDashboardDeals = async (req, res) => {
  console.log("hna");

  try {
    const agencyId = req.user.id;
    console.log('----------------------------------------------------------------');
    const [deals] = await pool.query(
      `SELECT * FROM place_deals
       WHERE organizer_id = ?
       ORDER BY created_at DESC`,
      [agencyId]
    );

    res.json({ deals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch deals" });
  }
};
export const addAgencyDashboardDeals = async (req, res) => {
  try {
    const agencyId = req.user.id;

    const {
      trip_id, // ✅ NEW
      place_id,
      title,
      description,
      discount_percentage,
      original_price,
      discounted_price,
      start_date,
      end_date,
      status,
      max_people,
      category,
    } = req.body;

    const image =
      req.files && req.files.length > 0 ? req.files[0].filename : null;

    if (
      !place_id ||
      !title ||
      !discount_percentage ||
      !discounted_price ||
      !start_date ||
      !end_date
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // ✅ Insert deal
      const [result] = await conn.query(
        `INSERT INTO place_deals
         (
           organizer_id,
           place_id,
           title,
           description,
           discount_percentage,
           original_price,
           discounted_price,
           max_people,
           start_date,
           end_date,
           status,
           category,
           image
         )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          agencyId,
          place_id,
          title,
          description || null,
          discount_percentage,
          original_price || null,
          discounted_price,
          max_people,
          start_date,
          end_date,
          status || "active",
          category || null,
          image,
        ]
      );

      // ✅ Delete trip ONLY if trip_id exists
      if (trip_id) {
        await conn.query(
          `DELETE FROM trips WHERE id = ? AND organizer_id = ?`,
          [trip_id, agencyId]
        );
      }

      await conn.commit();
      conn.release();

      res.status(201).json({
        message: "Deal created successfully",
        dealId: result.insertId,
      });
    } catch (err) {
      await conn.rollback();
      conn.release();
      throw err;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create deal" });
  }
};

export const updateAgencyDeal = async (req, res) => {
  try {
    const agencyId = req.user.id;
    const dealId = req.params.id;
    const {
      title,
      description,
      discount_percentage,
      original_price,
      discounted_price,
      start_date,
      end_date,
      image,
      status,
    } = req.body;

    const [result] = await pool.query(
      `UPDATE place_deals
       SET title = ?, description = ?, discount_percentage = ?, original_price = ?, discounted_price = ?,
           start_date = ?, end_date = ?, image = ?, status = ?
       WHERE id = ? AND organizer_id = ?`,
      [
        title,
        description,
        discount_percentage,
        original_price,
        discounted_price,
        start_date,
        end_date,
        image,
        status,
        dealId,
        agencyId,
      ]
    );

    if (result.affectedRows === 0)
      return res
        .status(403)
        .json({ message: "Deal not found or not authorized" });

    res.json({ message: "Deal updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update deal" });
  }
};
export const deleteAgencyDeal = async (req, res) => {
  try {
    const agencyId = req.user.id;
    const dealId = req.params.id;

    const [result] = await pool.query(
      `DELETE FROM place_deals WHERE id = ? AND organizer_id = ?`,
      [dealId, agencyId]
    );

    if (result.affectedRows === 0)
      return res
        .status(403)
        .json({ message: "Deal not found or not authorized" });

    res.json({ message: "Deal deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete deal" });
  }
};

export const addAgencyDashboardHighlights = async (req, res) => {
  try {
    const agencyId = req.user.id;
    const { place_id, title, description, button_text } = req.body;
    const images = req.files?.map(f => f.filename) || [];

    if (!place_id || !title) {
      return res.status(400).json({ message: "Place and title are required" });
    }

    const [result] = await pool.query(
      `INSERT INTO place_highlights
       (organizer_id, place_id, title, description, image, button_text)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        agencyId,
        place_id,
        title,
        description || null,
        images,
        button_text || null,
      ]
    );

    res.status(201).json({
      message: "Highlight created successfully",
      highlightId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create highlight" });
  }
};
export const getAgencyDashboardHighlights = async (req, res) => {
  try {
    const agencyId = req.user.id;

    const [highlights] = await pool.query(
      `SELECT h.*
       FROM place_highlights h
       JOIN places p ON h.place_id = p.id
       WHERE h.organizer_id = ?
       ORDER BY h.created_at DESC`,
      [agencyId]
    );

    res.json({ highlights });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch highlights" });
  }
};
export const updateAgencyHighlight = async (req, res) => {
  try {
    const highlightId = req.params.id;
    const agencyId = req.user.id; // From JWT
    const { title, description, image, button_text } = req.body;

    const [result] = await pool.query(
      `UPDATE place_highlights
       SET title = ?, description = ?, image = ?, button_text = ?
       WHERE id = ? AND organizer_id = ?`,
      [title, description, image, button_text, highlightId, agencyId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Highlight not found or not authorized" });
    }

    res.json({ message: "Highlight updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update highlight" });
  }
};
export const deleteAgencyHighlight = async (req, res) => {
  try {
    const highlightId = req.params.id;
    const agencyId = req.user.id; // From JWT

    const [result] = await pool.query(
      `DELETE FROM place_highlights
       WHERE id = ? AND organizer_id = ?`,
      [highlightId, agencyId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Highlight not found or not authorized" });
    }

    res.json({ message: "Highlight deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete highlight" });
  }
};
