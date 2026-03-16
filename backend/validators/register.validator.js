import { body } from "express-validator";

export const registerValidator = [
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["traveller", "agency"])
    .withMessage("Role must be either traveller or agency"),

  // Common fields
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),

  body("email")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  // Agency-specific optional fields
  body("phone")
    .if(body("role").equals("agency"))
    .optional()
    .isLength({ min: 8 })
    .withMessage("Invalid phone number"),

  body("website")
    .if(body("role").equals("agency"))
    .optional()
    .isURL()
    .withMessage("Invalid website URL"),

  body("address")
    .if(body("role").equals("agency"))
    .optional()
    .isLength({ min: 5 })
    .withMessage("Address is too short"),

  body("description")
    .if(body("role").equals("agency"))
    .optional()
    .isLength({ min: 10 })
    .withMessage("Description is too short"),
];
