import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

export const registerUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role,
      phone,
      website,
      address,
      description,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "traveller") {
      const [result] = await pool.query(
        `INSERT INTO users (username, email, password, role)
         VALUES (?, ?, ?, 'traveller')`,
        [username, email, hashedPassword]
      );
    
      const token = jwt.sign(
        { id: result.insertId, role: "traveller" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
    
      return res.status(201).json({
        message: "Traveller registered successfully",
        userId: result.insertId,
        role: "traveller",
        token, 
      });
    }

    if (role === "agency") {
      const [result] = await pool.query(
        `INSERT INTO users
         (username, email, password, phone, website, address, description, role, verified)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'agency', 0)`,
        [
          username,
          email,
          hashedPassword,
          phone || null,
          website || null,
          address || null,
          description || null,
        ]
      );
    
      const token = jwt.sign(
        { id: result.insertId, role: "agency" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
    
      return res.status(201).json({
        message: "Agency registered successfully. Pending admin approval.",
        userId: result.insertId,
        role: "agency",
        status: "pending",
        token, // ✅ ADD THIS
      });
    }

    return res.status(400).json({ error: "Invalid role" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const completeProfile = async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth } = req.body;
    const userId = req.user.id;


    // Build query
    let query = `UPDATE users SET firstName = ?, lastName = ?, dateOfBirth = ?, isProfileCompleted = 1`;
    const params = [firstName, lastName, dateOfBirth];

    // Handle avatar
    if (req.file) {
      query += `, avatar = ?`;
      params.push(req.file.filename);
    }

    query += ` WHERE id = ?`;
    params.push(userId);

    await pool.query(query, params);

    res.json({ message: "Profile completed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const agencyCompleteProfile = async (req, res) => {
  try {
    const { username, phone, website, address, description } = req.body;
    const userId = req.user.id;

    const avatar = req.file ? req.file.filename : null;

    await pool.query(
      `UPDATE users
       SET username = ?, phone = ?, website = ?, address = ?, description = ?, avatar = ?, isProfileCompleted = 1
       WHERE id = ?`,
      [username, phone, website, address, description, avatar, userId]
    );

    res.json({ message: "Agency profile completed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const travellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query(
      `SELECT id, password, isProfileCompleted, role
       FROM users 
       WHERE email = ? AND role = "traveller"`,
      [email]
    );

    if (!users.length) {
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

    const [users] = await pool.query(
      `SELECT id, password, verified, isProfileCompleted 
       FROM users 
       WHERE email = ? AND role = "agency"`,
      [email]
    );

    if (!users.length) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    if (user.verified === 0)
      return res.status(403).json({ error: "Pending admin approval" });
    if (user.verified === -1)
      return res.status(403).json({ error: "Your account was rejected" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, role: "agency" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      agencyId: user.id,
      role: "agency",
      isProfileCompleted: user.isProfileCompleted,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const [[user]] = await pool.query(
      `SELECT id, username, email, firstName, lastName, dateOfBirth, isProfileCompleted, role, verified , avatar
       FROM users WHERE id = ?`,
      [userId]
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    const role =user.role || "traveller";

    res.json({ user: { ...user, role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const [[user]] = await pool.query(
      `SELECT id, username, email, firstName, lastName, dateOfBirth, isProfileCompleted, role, verified , avatar
       FROM users WHERE id = ?`,
      [userId]
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user: { ...user } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
