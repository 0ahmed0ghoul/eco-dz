// import { trips } from "../data/trips.js";

// export const getAllTrips = async (req, res) => {
//   res.json(trips);
// };

// export const createTrip = async (req, res) => {
//   const {
//     place_id,
//     title,
//     description,
//     start_date,
//     end_date,
//     duration,
//     price,
//     max_people
//   } = req.body;

//   const newTrip = {
//     id: trips.length + 1,
//     place_id,
//     title,
//     description,
//     start_date,
//     end_date,
//     duration,
//     price,
//     max_people,
//     current_participants: 0,
//     organizer_id: req.user.id,
//     organizer_name: req.user.name,
//     activities: [],
//     difficulty: "Moderate",
//     included: ["Guide", "Meals", "Transportation"]
//   };

//   trips.push(newTrip);

//   res.status(201).json({ message: "Trip created", trip: newTrip });
// };

// export const sendTripMessage = async (req, res) => {
//   const { message } = req.body;
//   const tripId = req.params.id;

//   const trip = trips.find(t => t.id === parseInt(tripId));
//   if (!trip) {
//     return res.status(404).json({ message: "Trip not found" });
//   }

//   res.json({ message: "Message sent to organizer", tripId });
// };
