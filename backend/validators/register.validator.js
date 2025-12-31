import { body } from "express-validator";

/* Traveller */
export const travellerRegisterValidator = [
  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),

  body("email")
    .isEmail().withMessage("Invalid email"),

  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

/* Agency */
export const agencyRegisterValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Agency name is required"),

  body("email")
    .isEmail().withMessage("Invalid email"),

  body("phone")
    .optional()
    .isLength({ min: 8 }).withMessage("Invalid phone number"),

  body("website")
    .optional()
    .isURL().withMessage("Invalid website URL"),

  body("address")
    .optional()
    .isLength({ min: 5 }).withMessage("Address is too short"),

  body("description")
    .optional()
    .isLength({ min: 10 }).withMessage("Description is too short"),
];
