import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url"; // ✅ you must import this

import authRoutes from "./routes/auth.routes.js";
import placeRoutes from "./routes/place.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

// Recreate __dirname in ES module scope
 const __filename = fileURLToPath(import.meta.url); 
 const __dirname = path.dirname(__filename);
 app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(helmet());

/* =======================
   GLOBAL MIDDLEWARE
======================= */

// Parse JSON body
app.use(express.json());

// Enable CORS (React ↔ API)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

/* =======================
   API ROUTES
======================= */

app.use("/api/auth", authRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/eco-tours", require("./routes/ecoTours.routes"));
app.use("/api/accommodations", require("./routes/accommodations.routes"));
app.use("/api/green-transport", require("./routes/transport.routes"));
app.use("/api/deals/last-minute", require("./routes/lastMinute.routes"));
app.use("/api/deals/family", require("./routes/familyPackages.routes"));
app.use("/api/deals/adventure", require("./routes/adventureTours.routes"));
app.use("/api/deals/destinations", require("./routes/dealDestinations.routes"));
app.use("/api/monuments", require("./routes/monuments.routes"));


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
