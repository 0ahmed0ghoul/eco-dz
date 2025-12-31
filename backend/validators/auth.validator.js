import { body } from "express-validator";


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