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

// Routes
import authRoutes from "./routes/auth.routes.js";
import placeRoutes from "./routes/place.routes.js";
import userRoutes from "./routes/user.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import messagingRoutes from "./routes/messaging.routes.js";
import adminRoutes from "./routes/admin.route.js";
import agencyRoutes from "./routes/agency.route.js";
import tripRoutes from "./routes/trip.routes.js";
import dealRoutes from "./routes/deal.route.js";

// Socket
import { initializeSocket } from "./socket/socket.js";

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

/* =======================
   MIDDLEWARES
======================= */

// Body parser (must be BEFORE routes)
app.use(express.json());

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "http://localhost:5000",
        ],
        connectSrc: [
          "'self'",
          ...allowedOrigins,
          "http://localhost:5000",
        ],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Static files
app.use(
  "/assets",
  express.static(path.join(process.cwd(), "public/assets"))
);

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

app.use("/api/comments", commentsRoutes);
app.use("/api/messaging", messagingRoutes);

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
