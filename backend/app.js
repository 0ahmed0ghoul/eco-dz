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

// CORS Configuration - Allow all Vercel preview deployments
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://eco-dz.vercel.app",
  "https://www.eco-dz.vercel.app",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }
      
      // Check if origin is in allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      
      // Allow all Vercel preview deployments (contains .vercel.app)
      if (origin.includes('.vercel.app')) {
        console.log('✅ Allowed Vercel preview:', origin);
        return callback(null, true);
      }
      
      // For local development
      if (origin.includes('localhost')) {
        return callback(null, true);
      }
      
      // If none of the above match, block
      console.log('❌ Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    optionsSuccessStatus: 200,
  })
);

// Add pre-flight OPTIONS handling for all routes
app.options('*', cors());

// Security headers - Update helmet to work with CORS
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://eco-dz-2.onrender.com/",
        ],
        connectSrc: [
          "'self'",
          "https://eco-dz-2.onrender.com",
          "wss://eco-dz-2.onrender.com",
          "https://*.vercel.app", // Allow all Vercel domains
        ],
      },
    },
  })
);

// Static files
app.use(
  "/assets",
  express.static(path.join(process.cwd(), "public/assets"))
);
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
