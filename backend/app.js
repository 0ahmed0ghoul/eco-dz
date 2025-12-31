import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import ecoToursRoutes from "./routes/ecoTours.routes.js";
import accommodationsRoutes from "./routes/accommodations.routes.js";
import transportRoutes from "./routes/transport.routes.js";
import lastMinuteRoutes from "./routes/lastMinute.routes.js";
import familyPackagesRoutes from "./routes/familyPackages.routes.js";
import adventureToursRoutes from "./routes/adventureTours.routes.js";
import dealDestinationsRoutes from "./routes/dealDestinations.routes.js";
import authRoutes from "./routes/auth.routes.js";
import placeRoutes from "./routes/place.routes.js";
// import tripRoutes from "./routes/trip.routes.js";
import userRoutes from "./routes/user.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import messagingRoutes from "./routes/messaging.routes.js";
import agencyRoutes from "./routes/agency.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import { initializeSocket } from "./socket/socket.js";
import adminRoutes from "./routes/admin.route.js";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(httpServer);

// Recreate __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use(helmet());

/* =======================
   GLOBAL MIDDLEWARE
======================= */

// Parse JSON body with large limit for base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS (React ↔ API)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

/* =======================
   API ROUTES
======================= */
app.use("/api/admin", adminRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/places", placeRoutes);
// app.use("/api/trips", tripRoutes);
app.use("/api/user", userRoutes);
// app.use("/api/trips", tripRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/messaging", messagingRoutes);
app.use("/api/eco-tours", ecoToursRoutes);
app.use("/api/accommodations", accommodationsRoutes);
app.use("/api/green-transport", transportRoutes);
app.use("/api/deals/last-minute", lastMinuteRoutes);
app.use("/api/deals/family", familyPackagesRoutes);
app.use("/api/deals/adventure", adventureToursRoutes);
app.use("/api/deals/destinations", dealDestinationsRoutes);
app.use("/api/agency", agencyRoutes);
app.use("/api/bookings", bookingRoutes);



/* =======================
   TEST ROUTE
======================= */

app.get("/", (req, res) => {
  res.json({
    message: "Ecotourisme Algeria API is running 🚀"
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong",
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket ready for real-time messaging`);
});

