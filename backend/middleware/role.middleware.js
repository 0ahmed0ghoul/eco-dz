import pool from "../db.js";

export const isOrganizer = async (req, res, next) => {
  const [roles] = await db.query(
    `SELECT r.name
     FROM user_roles ur
     JOIN roles r ON r.id = ur.role_id
     WHERE ur.user_id = ?`,
    [req.user.id]
  );

  const isOrganizer = roles.some(r => r.name === "organizer");

  if (!isOrganizer) {
    return res.status(403).json({ message: "Organizer role required" });
  }

  next();
};
