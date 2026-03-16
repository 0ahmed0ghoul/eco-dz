import pool from "../db.js";


setInterval(() => {
    autoExpireBookings(); // run every 5–10 min
  }, 5 * 60 * 1000);

  export const createBooking = async (req, res) => {
    try {
      const { trip_id, full_name, phone, seats } = req.body;
      const user_id = req.user.id;
  
      // 1️⃣ Get trip capacity
      const [[trip]] = await pool.query(
        "SELECT max_people FROM trips WHERE id = ?",
        [trip_id]
      );
  
      if (!trip) {
        return res.status(404).json({ error: "Trip not found" });
      }
  
      // 2️⃣ Calculate booked seats (CONFIRMED only)
      const [[booked]] = await pool.query(
        `
        SELECT COALESCE(SUM(seats), 0) AS booked_seats
        FROM bookings
        WHERE trip_id = ?
        AND status IN ('CONFIRMED', 'COMPLETED')
        `,
        [trip_id]
      );
  
      const availableSeats = trip.max_people - booked.booked_seats;
  
      if (availableSeats < seats) {
        return res.status(400).json({
          error: "Not enough seats available",
          available_seats: availableSeats
        });
      }
  
      // 3️⃣ Generate attendance code
      const attendance_code = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
  
      // 4️⃣ Expiration (24h)
      const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
      // 5️⃣ Insert booking (PENDING)
      const [result] = await pool.query(
        `
        INSERT INTO bookings
        (trip_id, user_id, full_name, phone, seats, status, attendance_code, expires_at)
        VALUES (?, ?, ?, ?, ?, 'PENDING', ?, ?)
        `,
        [trip_id, user_id, full_name, phone, seats, attendance_code, expires_at]
      );
  
      res.status(201).json({
        message: "Booking created successfully",
        bookingId: result.insertId,
        attendance_code
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };
  
  export const createDealBooking = async (req, res) => {
    try {
      const user_id = req.user.id;
      const { deal_id, full_name, phone, seats } = req.body; // using full_name & seats
  
      if (!deal_id || !full_name || !phone || seats < 1) {
        return res.status(400).json({ error: "Invalid booking data" });
      }
  
      // 1️⃣ Get deal capacity
      const [[deal]] = await pool.query(
        "SELECT max_people FROM place_deals WHERE id = ?",
        [deal_id]
      );
  
      if (!deal) {
        return res.status(404).json({ error: "Deal not found" });
      }
  
      // 2️⃣ Calculate booked seats (CONFIRMED only)
      const [[booked]] = await pool.query(
        `
        SELECT COALESCE(SUM(seats), 0) AS booked_seats
        FROM deals_bookings
        WHERE deal_id = ?
        AND status IN ('CONFIRMED', 'COMPLETED')
        `,
        [deal_id]
      );
  
      const availableSeats = deal.max_people - booked.booked_seats;
  
      if (availableSeats < seats) {
        return res.status(400).json({
          error: "Not enough seats available",
          available_seats: availableSeats,
        });
      }
  
      // 3️⃣ Generate attendance code
      const attendance_code = Math.random().toString(36).substring(2, 8).toUpperCase();
  
      // 4️⃣ Expiration (24h)
      const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
      // 5️⃣ Insert booking (PENDING)
      const [result] = await pool.query(
        `
        INSERT INTO deals_bookings
        (deal_id, user_id, full_name, phone, seats, status, attendance_code, expires_at)
        VALUES (?, ?, ?, ?, ?, 'PENDING', ?, ?)
        `,
        [deal_id, user_id, full_name, phone, seats, attendance_code, expires_at]
      );
  
      res.status(201).json({
        message: "Booking created successfully",
        bookingId: result.insertId,
        attendance_code,
        available_seats: availableSeats - seats,
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };
  
  
  

export const cancelBooking = async (req, res) => {
try {
    const { booking_id } = req.body;
    const user_id = req.user.id;

    // 1️⃣ Get booking
    const [bookings] = await pool.query(
    "SELECT trip_id, seats, status FROM bookings WHERE id = ? AND user_id = ?",
    [booking_id, user_id]
    );

    if (!bookings || bookings.length === 0) {
    return res.status(404).json({ error: "Booking not found" });
    }

    const booking = bookings[0];

    if (booking.status !== "PENDING" && booking.status !== "CONFIRMED") {
    return res.status(400).json({ error: "Cannot cancel this booking" });
    }

    // 2️⃣ Update booking to CANCELLED
    await pool.query(
    "UPDATE bookings SET status = 'CANCELLED' WHERE id = ?",
    [booking_id]
    );

    // 3️⃣ Return seats to trip
    await pool.query(
    "UPDATE trips SET available_seats = available_seats + ? WHERE id = ?",
    [booking.seats, booking.trip_id]
    );

    res.json({ message: "Booking cancelled successfully" });

} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
}
};

export const getUserBookings = async (req, res) => {
try {
    console.log('role :',req.user.role);
    const user_id = req.user.id;
    console.log(req.user);
    const [bookings] = await pool.query(
    `SELECT b.id, b.trip_id, b.full_name, b.phone, b.seats, b.status, b.attendance_code, t.title AS trip_title, t.start_date, t.end_date
        FROM bookings b
        JOIN trips t ON t.id = b.trip_id
        WHERE b.user_id = ?`,
    [user_id]
    );

    res.json({ bookings });

} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
}
};

export const confirmBooking = async (req, res) => {
try {
    const { booking_id } = req.body;
    const agency_id = req.user.id; // logged-in agency
    const agency_role = req.user.role; // must be 'agency'

    if (agency_role !== "agency") {
    return res.status(403).json({ error: "Only agencies can confirm bookings" });
    }

    // 1️⃣ Fetch booking
    const [bookings] = await pool.query(
    "SELECT trip_id, status FROM bookings WHERE id = ?",
    [booking_id]
    );

    if (!bookings || bookings.length === 0) {
    return res.status(404).json({ error: "Booking not found" });
    }

    const booking = bookings[0];

    if (booking.status !== "PENDING") {
    return res.status(400).json({ error: "Only PENDING bookings can be confirmed" });
    }

    // 2️⃣ Confirm booking
    await pool.query(
    "UPDATE bookings SET status = 'CONFIRMED', confirmed_at = NOW() WHERE id = ?",
    [booking_id]
    );

    res.json({ message: "Booking confirmed successfully" });

} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
}
};
  
export const checkInBooking = async (req, res) => {
try {
    const { booking_id } = req.body;
    const agency_id = req.user.id;
    const agency_role = req.user.role;

    if (agency_role !== "agency") {
    return res.status(403).json({ error: "Only agencies can check-in attendees" });
    }

    // 1️⃣ Get booking
    const [bookings] = await pool.query(
    "SELECT trip_id, status FROM bookings WHERE id = ?",
    [booking_id]
    );

    if (!bookings || bookings.length === 0) {
    return res.status(404).json({ error: "Booking not found" });
    }

    const booking = bookings[0];

    if (booking.status !== "CONFIRMED") {
    return res.status(400).json({ error: "Only CONFIRMED bookings can be checked in" });
    }

    // 2️⃣ Check if already checked in
    const [attendance] = await pool.query(
    "SELECT id FROM trip_attendance WHERE booking_id = ?",
    [booking_id]
    );

    if (attendance.length > 0) {
    return res.status(400).json({ error: "Booking already checked in" });
    }

    // 3️⃣ Insert attendance
    await pool.query(
    "INSERT INTO trip_attendance (booking_id, trip_id, validated_by) VALUES (?, ?, ?)",
    [booking_id, booking.trip_id, agency_id]
    );

    res.json({ message: "Check-in successful" });

} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
}
};
  
export const autoExpireBookings = async () => {
    try {
      // 1️⃣ Select expired pending bookings
      const [expiredBookings] = await pool.query(
        "SELECT id, trip_id, seats FROM bookings WHERE status = 'PENDING' AND expires_at <= NOW()"
      );
  
      if (expiredBookings.length === 0) return;
  
      // 2️⃣ Update status to EXPIRED
      const bookingIds = expiredBookings.map(b => b.id);
      await pool.query(
        `UPDATE bookings SET status = 'EXPIRED' WHERE id IN (${bookingIds.join(",")})`
      );
  
      // 3️⃣ Return seats to trips
      for (const b of expiredBookings) {
        await pool.query(
          "UPDATE trips SET available_seats = available_seats + ? WHERE id = ?",
          [b.seats, b.trip_id]
        );
      }
  
      console.log(`Auto-expired ${expiredBookings.length} bookings`);
  
    } catch (err) {
      console.error("Error auto-expiring bookings:", err);
    }
};

export const autoCompleteTrip = async (trip_id) => {
    try {
    await pool.query(`
        UPDATE bookings b
        JOIN trip_attendance ta ON ta.booking_id = b.id
        SET b.status = 'COMPLETED', b.completed_at = NOW()
        WHERE b.trip_id = ? AND b.status = 'CONFIRMED'
    `, [trip_id]);

    console.log(`Trip ${trip_id} completed for all attended bookings`);
    } catch (err) {
    console.error("Error completing trip:", err);
    }
};

export const calculateTripRevenue = async (trip_id, commissionPercentage = 10) => {
    try {
    // 1️⃣ Get completed bookings
    const [bookings] = await pool.query(
        `SELECT seats, price_per_person 
        FROM bookings b 
        JOIN trips t ON t.id = b.trip_id
        WHERE b.trip_id = ? AND b.status = 'COMPLETED'`,
        [trip_id]
    );

    if (bookings.length === 0) return { total: 0, platform: 0, organizer: 0 };

    // 2️⃣ Calculate totals
    let totalAmount = 0;
    for (const b of bookings) {
        totalAmount += b.seats * b.price_per_person;
    }

    const platformCommission = (totalAmount * commissionPercentage) / 100;
    const organizerAmount = totalAmount - platformCommission;

    // 3️⃣ Insert/update revenue table
    await pool.query(`
        INSERT INTO trip_revenue (trip_id, total_amount, platform_commission, organizer_amount, status)
        VALUES (?, ?, ?, ?, 'NOT_PAID')
        ON DUPLICATE KEY UPDATE
        total_amount = VALUES(total_amount),
        platform_commission = VALUES(platform_commission),
        organizer_amount = VALUES(organizer_amount)
    `, [trip_id, totalAmount, platformCommission, organizerAmount]);

    console.log(`Revenue calculated for trip ${trip_id}: $${totalAmount}`);

    return { totalAmount, platformCommission, organizerAmount };

    } catch (err) {
    console.error("Error calculating trip revenue:", err);
    }
};

const checkTripsToComplete = async () => {
    const [trips] = await pool.query(
      "SELECT id FROM trips WHERE end_date <= NOW()"
    );
  
    for (const trip of trips) {
      await autoCompleteTrip(trip.id);
      await calculateTripRevenue(trip.id); // automatically calculate revenue
    }
};

// Run every hour (or as needed)
setInterval(checkTripsToComplete, 60 * 60 * 1000);