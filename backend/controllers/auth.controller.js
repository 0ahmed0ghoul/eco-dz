import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    // result.insertId gives the ID of the newly created user
    res.status(201).json({ 
      message: "User registered successfully", 
      userId: result.insertId 
    });

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already exists" });
    }
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
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [[user]] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return token + profile status + user id
    res.json({
      token,
      userId: user.id,
      isProfileCompleted: user.isProfileCompleted
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
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