import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import placeRoutes from "./routes/place.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(helmet());

/* =======================
   GLOBAL MIDDLEWARE
======================= */

// Parse JSON body
app.use(express.json());

// Enable CORS (React ↔ API)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

/* =======================
   API ROUTES
======================= */

app.use("/api/auth", authRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/user", userRoutes);

/* =======================
   TEST ROUTE
======================= */

app.get("/", (req, res) => {
  res.json({
    message: "Ecotourisme Algeria API is running 🚀"
  });
});

/* =======================
   ERROR HANDLING
======================= */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong",
    error: err.message
  });
});

/* =======================
   SERVER LISTEN
======================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
