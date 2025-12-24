import { body } from "express-validator";

export const createTripValidator = [
  body("place_id")
    .isInt()
    .withMessage("Place ID must be a number"),

  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),

  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),

  body("start_date")
    .isISO8601().withMessage("Start date must be a valid date"),

  body("end_date")
    .isISO8601().withMessage("End date must be a valid date"),

  body("duration")
    .isInt({ min: 1 }).withMessage("Duration must be at least 1"),

  body("price")
    .isFloat({ min: 0 }).withMessage("Price must be a positive number"),

  body("max_people")
    .isInt({ min: 1 }).withMessage("Max people must be at least 1"),
];
