import { body } from "express-validator";

export const ratePlaceValidator = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
];

export const commentPlaceValidator = [
  body("comment")
    .trim()
    .notEmpty().withMessage("Comment cannot be empty")
    .isLength({ max: 500 }).withMessage("Comment too long"),
];
