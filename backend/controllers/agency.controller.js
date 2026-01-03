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

export const getAgencyDashboardTrips = async (req, res) => {
  try {
    const agencyId = req.user.id;

    const [trips] = await pool.query(
      `SELECT * FROM trips WHERE organizer_id = ? ORDER BY created_at DESC`,
      [agencyId]
    );

    const [agencyRows] = await pool.query(
      `SELECT id, name, email, phone, website, address, description
       FROM organizers
       WHERE id = ?`,
      [agencyId]
    );

    const agency = agencyRows[0] || null;

    res.json({ trips, agency });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch trips" });
  }
};
export const getAgencyDashboardDeals = async (req, res) => {
  try {
    const agencyId = req.user.id;

    const [deals] = await pool.query(
      `SELECT *
       FROM place_deals
       WHERE organizer_id = ?
       ORDER BY created_at DESC`,
      [agencyId]
    );

    res.json({ deals }); // <-- wrap in object
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch deals" });
  }
};

export const getAgencyDashboardhighlights = async (req, res) => {
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

    res.json({highlights});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch highlights" });
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
      duration,
      price,
      max_people,
    } = req.body;

    if (!place_id || !title || !start_date || !end_date || !duration || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await pool.query(
      `INSERT INTO trips
      (organizer_id, place_id, title, description, start_date, end_date, duration, price, max_people)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        agencyId,
        place_id,
        title,
        description,
        start_date,
        end_date,
        duration,
        price,
        max_people || null,
      ]
    );

    res.status(201).json({
      message: "Trip created successfully",
      tripId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create trip" });
  }
};
export const addAgencyDashboardDeals = async (req, res) => {
  try {
    const agencyId = req.user.id;
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

    if (!title || !discount_percentage || !start_date || !end_date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await pool.query(
      `INSERT INTO place_deals
       (organizer_id, title, description, discount_percentage, original_price, discounted_price,
        start_date, end_date, image, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        agencyId,
        title,
        description,
        discount_percentage,
        original_price || null,
        discounted_price || null,
        start_date,
        end_date,
        image || null,
        status || "active",
      ]
    );

    res.status(201).json({
      message: "Deal created successfully",
      dealId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create deal" });
  }
};
export const addAgencyDashboardhighlights = async (req, res) => {
  try {
    const {
      place_id,
      title,
      description,
      image,
      button_text,
    } = req.body;

    if (!place_id || !title) {
      return res.status(400).json({ message: "Place and title are required" });
    }

    const [result] = await pool.query(
      `INSERT INTO place_highlights
       (place_id, title, description, image, button_text)
       VALUES (?, ?, ?, ?, ?)`,
      [place_id, title, description, image, button_text]
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

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Trip not found or not authorized" });
    }

    res.json({ message: "Trip updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update trip" });
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

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Deal not found or not authorized" });
    }

    res.json({ message: "Deal updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update deal" });
  }
};
export const updateAgencyhighlights = async (req, res) => {
  try {
    const highlightId = req.params.id;
    const { title, description, image, button_text } = req.body;

    const [result] = await pool.query(
      `UPDATE place_highlights
       SET title = ?, description = ?, image = ?, button_text = ?
       WHERE id = ?`,
      [title, description, image, button_text, highlightId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Highlight not found" });
    }

    res.json({ message: "Highlight updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update highlight" });
  }
};



export const deleteAgencyTrip = async (req, res) => {
  try {
    const agencyId = req.user.id;
    const tripId = req.params.id;

    const [result] = await pool.query(
      `DELETE FROM trips
       WHERE id = ? AND organizer_id = ?`,
      [tripId, agencyId]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Trip not found or not authorized" });
    }

    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete trip" });
  }
};
export const deleteAgencyDeal = async (req, res) => {
  try {
    const agencyId = req.user.id;
    const dealId = req.params.id;

    const [result] = await pool.query(
      `DELETE FROM place_deals
       WHERE id = ? AND organizer_id = ?`,
      [dealId, agencyId]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Deal not found or not authorized" });
    }

    res.json({ message: "Deal deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete deal" });
  }
};
export const deleteAgencyhighlights = async (req, res) => {
  try {
    const highlightId = req.params.id;

    const [result] = await pool.query(
      `DELETE FROM place_highlights WHERE id = ?`,
      [highlightId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Highlight not found" });
    }

    res.json({ message: "Highlight deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete highlight" });
  }
};
