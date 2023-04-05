const { check, param } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const createCategoryValidator = [
  check("name")
    .exists()
    .withMessage("The 'name' field is required.")
    .notEmpty()
    .withMessage("The 'name' field cannot be empty.")
    .isLength({ min: 3, max: 99 })
    .withMessage("The 'name' field must be between 3 and 99 characters."),
  check("pricePerCubicMeter")
    .optional()
    .notEmpty()
    .withMessage("The 'pricePerCubicMeter' field cannot be empty.")
    .isNumeric()
    .withMessage("The 'pricePerCubicMeter' field must be a number."),
  check("fixedPrice")
    .optional()
    .notEmpty()
    .withMessage("The 'fixedPrice' field cannot be empty.")
    .isNumeric()
    .withMessage("The 'fixedPrice' field must be a number."),
  check("pricePerCubicMeter").custom((value, { req }) => {
    if (value && req.body.fixedPrice) {
      throw new Error(
        "You must set only one of the fields 'pricePerCubicMeter' or 'fixedPrice'"
      );
    } else if (!value && !req.body.fixedPrice) {
      throw new Error(
        "You must set one of the fields 'pricePerCubicMeter' or 'fixedPrice'"
      );
    }
    return true;
  }),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const updateCategoryValidator = [
  check("name")
    .optional()
    .notEmpty()
    .withMessage("The 'name' field cannot be empty.")
    .isLength({ min: 3, max: 99 })
    .withMessage("The 'name' field must be between 3 and 99 characters."),
  check("pricePerCubicMeter")
    .optional()
    .notEmpty()
    .withMessage("The 'pricePerCubicMeter' field cannot be empty.")
    .isNumeric()
    .withMessage("The 'pricePerCubicMeter' field must be a number."),
  check("fixedPrice")
    .optional()
    .notEmpty()
    .withMessage("The 'fixedPrice' field cannot be empty.")
    .isNumeric()
    .withMessage("The 'fixedPrice' field must be a number."),
  check("pricePerCubicMeter").custom((value, { req }) => {
    if (value && req.body.fixedPrice) {
      throw new Error(
        "You must set only one of the fields 'pricePerCubicMeter' or 'fixedPrice'"
      );
    } else if (!value && !req.body.fixedPrice) {
      throw new Error(
        "You must set one of the fields 'pricePerCubicMeter' or 'fixedPrice'"
      );
    }
    return true;
  }),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const deleteCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid property ID."),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};
