// controllers/admin.controller.js
import pool from '../db.js';

export const adminLogin = (req, res) => {
    const { username, password } = req.body;
  
    // Hardcoded admin credentials (for maximum security, keep them server-side)
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'StrongPass123';
  
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // success
      return res.json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  };

export const getAllPlaces = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM places ORDER BY id DESC');
  res.json({ places: rows });
};

export const getAllUsers = async (req, res) => {
  const [rows] = await pool.query('SELECT id, username, email, created_at FROM users ORDER BY id DESC');
  res.json({ users: rows });
};

export const getAllOrganizers = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM organizers ORDER BY id DESC');
  res.json({ organizers: rows });
}
export const approveOrganizer = async (req, res) => {
  const organizerId = req.params.id;
  await pool.query('UPDATE organizers SET verified = 1 WHERE id = ?', [organizerId]);
  res.json({ message: 'Organizer approved' });
}
export const rejectOrganizer = async (req, res) => {
  const organizerId = req.params.id;
  await pool.query('UPDATE organizers SET verified = -1 WHERE id = ?', [organizerId]);
  res.json({ message: 'Organizer rejected and deleted' });
}


export const getAllTrips = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM trips ORDER BY created_at DESC');
  res.json({ trips: rows });
}



export const approveTrip = async (req, res) => {
  const tripId = req.params.id;
  await pool.query('UPDATE trips SET approved = 1 WHERE id = ?', [tripId]);
  res.json({ message: 'Trip approved' });
};

export const rejectTrip = async (req, res) => {
  const tripId = req.params.id;
  await pool.query('UPDATE trips SET approved = -1 WHERE id = ?', [tripId]);
  res.json({ message: 'Trip rejected' });
}

export const addPlace = async (req, res) => {
  const { name, location, category } = req.body;
  await pool.query('INSERT INTO places (name, location, category) VALUES (?, ?, ?)', [name, location, category]);
  res.json({ message: 'Place added' });
};
export const deletePlace = async (req, res) => {
  const id = req.params.id;
  await pool.query('DELETE FROM places WHERE id = ?', [id]);
  res.json({ message: 'Place deleted' });
};

