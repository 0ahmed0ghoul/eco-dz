import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const header = req.headers.authorization;
  
  if (!header) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }
  
  // Check for demo tokens
  if (token.includes("demo")) {
    const userId = token.includes("agency") ? "demo-agency" : "demo-user";
    const username = token.includes("agency") ? "Demo Agency" : "Demo User";
    req.user = {
      id: userId,
      username: username,
      email: token.includes("agency") ? "agency@demo.com" : "demo@demo.com",
      role: token.includes("agency") ? "agency" : "user"
    };
    return next();
  }

  // Check for simple user tokens (from localStorage login)
  if (token.startsWith("user-")) {
    const parts = token.split("-");
    if (parts.length >= 2) {
      const userId = parts.slice(1, -1).join("-"); // Handle IDs with dashes
      const email = parts[parts.length - 1];
      req.user = {
        id: userId,
        email: email,
        role: "user"
      };
      return next();
    }
  }

  // Try JWT verification for real tokens
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || "user"
    };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
