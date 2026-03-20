/* =======================
   IMPORTS
======================= */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { initializeSocket } from "./socket/socket.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import placeRoutes from "./routes/place.routes.js";
import userRoutes from "./routes/user.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import bookingRoute from "./routes/booking.route.js";

import messagingRoutes from "./routes/messaging.routes.js";
import adminRoutes from "./routes/admin.route.js";
import agencyRoutes from "./routes/agency.route.js";
import tripRoutes from "./routes/trip.routes.js";
import dealRoutes from "./routes/deal.route.js";
import searchesRoutes from "./routes/searches.route.js";

/* =======================
   ENV CONFIG
======================= */
dotenv.config();

/* =======================
   APP & SERVER SETUP
======================= */
const app = express();
const httpServer = http.createServer(app);

/* =======================
   PATH SETUP (ES MODULE)
======================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/avatars", express.static("uploads/avatars"));
app.use("/logos", express.static("uploads/logos"));

/* =======================
   MIDDLEWARES
======================= */

// Body parser (must be BEFORE routes)
app.use(express.json());

// CORS Configuration - FIX
// IMPORTANT: CORS must come BEFORE any routes
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://eco-dz.vercel.app",
  process.env.FRONTEND_URL,
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      origin.includes(".vercel.app") ||
      origin.includes("localhost") ||
      origin === process.env.FRONTEND_URL
    ) {
      console.log("✅ CORS allowed:", origin);
      return callback(null, true);
    }

    console.log("❌ CORS blocked:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ IMPORTANT: reuse SAME config
app.options("*", cors(corsOptions));

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false, // Temporarily disable CSP for testing
  })
);

// Static files
app.use("/assets", express.static(path.join(process.cwd(), "public/assets")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* =======================
   SOCKET.IO
======================= */
initializeSocket(httpServer);

/* =======================
   API ROUTES
======================= */
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/agency", agencyRoutes);

app.use("/api/places", placeRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/deals", dealRoutes);

app.use("/api/searches", searchesRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/messaging", messagingRoutes);
app.use("/api/bookings", bookingRoute);

app.use("/api/admin", adminRoutes);

/* =======================
   HEALTH CHECK
======================= */
app.get("/", (req, res) => {
  res.json({
    message: "Ecotourisme Algeria API is running 🚀",
  });
});

/* =======================
   ERROR HANDLING
======================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong",
    error: err.message,
  });
});

/* =======================
   SERVER START
======================= */
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket ready for real-time messaging`);
});
