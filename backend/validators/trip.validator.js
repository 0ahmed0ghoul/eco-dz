import { body } from "express-validator";

export const createTripValidator = [
  body("place_id")
    .isInt({ min: 1 })
    .withMessage("Place ID must be a valid number"),

  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Title must be between 3 and 150 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

  body("start_date")
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  body("end_date")
    .isISO8601()
    .withMessage("End date must be a valid date")
    .custom((endDate, { req }) => {
      if (new Date(endDate) < new Date(req.body.start_date)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),

  body("duration")
    .isInt({ min: 1 })
    .withMessage("Duration must be at least 1 day"),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number")
    .custom(value => {
      if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        throw new Error("Price must have at most 2 decimal places");
      }
      return true;
    }),

  body("max_people")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Max people must be at least 1"),
];
