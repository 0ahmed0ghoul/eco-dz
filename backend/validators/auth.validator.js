import { body } from "express-validator";

export const registerValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),

  body("email")
    .isEmail().withMessage("Invalid email"),

  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];
