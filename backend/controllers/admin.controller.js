import pool from "../db.js";

/* =======================
   Admin Login
======================= */
export const adminLogin = (req, res) => {
  try {
    const { username, password } = req.body;

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "StrongPass123";

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return res.json({ message: "Login successful" });
    }

    return res.status(401).json({ error: "Invalid credentials" });
  } catch (err) {
    console.error("adminLogin error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* =======================
   Places
======================= */
export const getAllPlaces = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM places ORDER BY id DESC"
    );
    res.json({ places: rows || [] });
  } catch (err) {
    console.error("getAllPlaces error:", err);
    res.status(500).json({ error: "Failed to fetch places" });
  }
};

export const addPlace = async (req, res) => {
  try {
    const { name, location, category } = req.body;

    if (!name || !location || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await pool.query(
      "INSERT INTO places (name, location, category) VALUES (?, ?, ?)",
      [name, location, category]
    );

    res.status(201).json({
      message: "Place added",
      placeId: result.insertId,
    });
  } catch (err) {
    console.error("addPlace error:", err);
    res.status(500).json({ error: "Failed to add place" });
  }
};

export const deletePlace = async (req, res) => {
  try {
    const id = req.params.id;

    const [result] = await pool.query(
      "DELETE FROM places WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.json({ message: "Place deleted" });
  } catch (err) {
    console.error("deletePlace error:", err);
    res.status(500).json({ error: "Failed to delete place" });
  }
};

/* =======================
   Users
======================= */
export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, email, role, verified, created_at FROM users ORDER BY id DESC"
    );

    res.json({ users: rows || [] });
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

/* =======================
   Organizers (FROM USERS)
======================= */
export const getAllOrganizers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE role = 'agency' ORDER BY id DESC"
    );

    res.json({ agencies: rows || [] });
  } catch (err) {
    console.error("getAllOrganizers error:", err);
    res.status(500).json({ error: "Failed to fetch agencys" });
  }
};

export const approveOrganizer = async (req, res) => {
  try {
    const organizerId = req.params.id;

    const [result] = await pool.query(
      "UPDATE users SET verified = 1 WHERE id = ? AND role = 'agency'",
      [organizerId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    res.json({ message: "agency approved" });
  } catch (err) {
    console.error("approveagency error:", err);
    res.status(500).json({ error: "Failed to approve agency" });
  }
};

export const rejectOrganizer = async (req, res) => {
  try {
    const organizerId = req.params.id;

    const [result] = await pool.query(
      "UPDATE users SET verified = -1 WHERE id = ? AND role = 'agency'",
      [organizerId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "agency not found" });
    }

    res.json({ message: "agency rejected" });
  } catch (err) {
    console.error("rejectOrganizer error:", err);
    res.status(500).json({ error: "Failed to reject agency" });
  }
};

/* =======================
   Trips
======================= */
export const getAllTrips = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM trips ORDER BY created_at DESC"
    );
    rows.forEach(trip => {
      trip.image = trip.image ? JSON.parse(trip.image) : [];
    });
    res.json({ trips: rows || [] });
  } catch (err) {
    console.error("getAllTrips error:", err);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
};

export const approveTrip = async (req, res) => {
  try {
    const tripId = req.params.id;

    const [result] = await pool.query(
      "UPDATE trips SET approved = 1 WHERE id = ?",
      [tripId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json({ message: "Trip approved" });
  } catch (err) {
    console.error("approveTrip error:", err);
    res.status(500).json({ error: "Failed to approve trip" });
  }
};

export const rejectTrip = async (req, res) => {
  try {
    const tripId = req.params.id;

    const [result] = await pool.query(
      "UPDATE trips SET approved = -1 WHERE id = ?",
      [tripId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json({ message: "Trip rejected" });
  } catch (err) {
    console.error("rejectTrip error:", err);
    res.status(500).json({ error: "Failed to reject trip" });
  }
};
