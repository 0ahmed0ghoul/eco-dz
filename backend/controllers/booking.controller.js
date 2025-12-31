import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { sendBookingConfirmation, sendBookingNotificationToAgency } from "../services/email.service.js";

// Setup path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to bookings data file
const bookingsFile = path.join(__dirname, "../data/bookings.json");

/**
 * Create a new booking for a trip
 */
export const createBooking = async (req, res) => {
  try {
    const { tripId, participants, fullName, email, phone } = req.body;
    const userId = req.user?.id;

    // Validate inputs
    if (!tripId || !participants || !fullName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (tripId, participants, fullName, email, phone)"
      });
    }

    // Get trips data
    const tripsFile = path.join(__dirname, "../data/trips.json");
    const trips = JSON.parse(fs.readFileSync(tripsFile, "utf-8")) || [];
    const trip = trips.find(t => t.id === tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });
    }

    // Check available seats
    const bookedSeats = trip.currentParticipants || 0;
    const availableSeats = trip.maxParticipants - bookedSeats;

    if (availableSeats < participants) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableSeats} seats available`
      });
    }

    // Create booking object
    const booking = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      tripId,
      tripTitle: trip.title,
      agencyId: trip.agencyId,
      agencyName: trip.agencyName || "Unknown Agency",
      participants: parseInt(participants),
      fullName,
      email,
      phone,
      totalPrice: trip.price * participants,
      tripDates: {
        startDate: trip.startDate,
        endDate: trip.endDate || trip.startDate
      },
      createdAt: new Date().toISOString()
    };

    // Send email confirmation to customer
    await sendBookingConfirmation(email, {
      trip,
      participants,
      fullName,
      phone,
      totalPrice: booking.totalPrice,
      agencyName: trip.agencyName,
      agencyContact: trip.agencyContact || {}
    });

    // Send notification to agency (if agency email exists)
    const agencyEmail = trip.agencyEmail || trip.agencyContact?.email;
    if (agencyEmail) {
      await sendBookingNotificationToAgency(agencyEmail, {
        trip,
        participants,
        fullName,
        email,
        phone,
        totalPrice: booking.totalPrice,
        agencyName: trip.agencyName
      });
    }

    // Load existing bookings
    let bookings = [];
    if (fs.existsSync(bookingsFile)) {
      bookings = JSON.parse(fs.readFileSync(bookingsFile, "utf-8")) || [];
    }

    // Add new booking
    bookings.push(booking);

    // Save updated bookings
    fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2), "utf-8");

    // Update trip's currentParticipants
    trip.currentParticipants = (trip.currentParticipants || 0) + parseInt(participants);
    fs.writeFileSync(tripsFile, JSON.stringify(trips, null, 2), "utf-8");

    return res.status(201).json({
      success: true,
      message: "Booking created successfully and confirmation emails sent",
      booking
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: error.message
    });
  }
};

/**
 * Get user's bookings
 */
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // Load bookings
    let bookings = [];
    if (fs.existsSync(bookingsFile)) {
      bookings = JSON.parse(fs.readFileSync(bookingsFile, "utf-8")) || [];
    }

    // Filter bookings for this user
    const userBookings = bookings.filter(b => b.userId === userId);

    return res.status(200).json({
      success: true,
      bookings: userBookings
    });
  } catch (error) {
    console.error("Error getting user bookings:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving bookings",
      error: error.message
    });
  }
};
