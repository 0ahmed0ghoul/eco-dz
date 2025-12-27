import { body } from "express-validator";

export const registerValidator = [
  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),

  body("email")
    .isEmail().withMessage("Invalid email"),

  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];


export const loginValidator = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const completeProfileValidator = [
  body("firstName")
    .trim()
    .notEmpty().withMessage("First name is required"),
  body("lastName")
    .trim()
    .notEmpty().withMessage("Last name is required"),
  body("dateOfBirth")
    .isISO8601().withMessage("Invalid date of birth"),
];