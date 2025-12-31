import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
export const travellerRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES (?, ?, ?)`,
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: "Traveller registered successfully",
      userId: result.insertId,
      role: "traveller"
    });

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
export const agencyRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      website,
      address,
      description
    } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO organizers
      (name, email, password, phone, website, address, description, verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        name,
        email,
        hashedPassword, // use hashed password here
        phone || null,
        website || null,
        address || null,
        description || null
      ]
    );

    res.status(201).json({
      message: "Agency registered successfully. Pending admin approval.",
      agencyId: result.insertId,
      status: "pending"
    });

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const completeProfile = async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth } = req.body;
    const userId = req.params.id;
    await pool.query(
      "UPDATE users SET firstName = ?, lastName = ?, dateOfBirth = ?, isProfileCompleted = 1 WHERE id = ?",
      [firstName, lastName, dateOfBirth, userId]
    );
    res.json({ message: "Profile completed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const travellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query(
      "SELECT id, password, isProfileCompleted FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: "traveller" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      userId: user.id,
      role: "traveller",
      isProfileCompleted: user.isProfileCompleted,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
export const agencyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [agencies] = await pool.query(
      `SELECT id, password, verified 
       FROM organizers 
       WHERE email = ?`,
      [email]
    );

    if (agencies.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const agency = agencies[0];

    if (agency.verified === 0) {
      return res.status(403).json({
        error: "Your agency account is pending admin approval",
      });
    }

    if (agency.verified === -1) {
      return res.status(403).json({
        error: "Your agency account has been rejected",
      });
    }

    const isMatch = await bcrypt.compare(password, agency.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: agency.id, role: "agency" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      agencyId: agency.id,
      role: "agency",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};



export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [[user]] = await pool.query(
      'SELECT id, username, email, firstName, lastName, dateOfBirth, isProfileCompleted FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};