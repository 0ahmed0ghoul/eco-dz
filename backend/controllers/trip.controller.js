import { db } from "../db.js";

export const getAllTrips = async (req, res) => {
  const [trips] = await db.query(
    `SELECT t.*, p.name AS place_name
     FROM trips t
     JOIN places p ON p.id = t.place_id`
  );

  res.json(trips);
};

export const createTrip = async (req, res) => {
  const {
    place_id,
    title,
    description,
    start_date,
    end_date,
    duration,
    price,
    max_people
  } = req.body;

  await db.query(
    `INSERT INTO trips
     (organizer_id, place_id, title, description, start_date, end_date, duration, price, max_people)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.user.id,
      place_id,
      title,
      description,
      start_date,
      end_date,
      duration,
      price,
      max_people
    ]
  );

  res.status(201).json({ message: "Trip created" });
};

export const sendTripMessage = async (req, res) => {
  const { message } = req.body;

  await db.query(
    "INSERT INTO trip_messages (user_id, trip_id, message) VALUES (?, ?, ?)",
    [req.user.id, req.params.id, message]
  );

  res.json({ message: "Message sent" });
};
