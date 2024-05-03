const { check, param, query } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const getReconnectionsValidator = [
  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage(
      "The 'offset' value must be an integer equal to or greater than 0."
    ),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("The 'limit' value must be an integer greater than 0."),
  query("sort")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("The 'sort' value must be 'asc' or 'desc'."),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const createReconnectionValidator = [
  check("name")
    .exists()
    .withMessage("The 'name' field is required.")
    .notEmpty()
    .withMessage("The 'name' field cannot be empty.")
    .isLength({ min: 3, max: 99 })
    .withMessage("The 'name' field must be between 3 and 99 characters."),
  check("amount")
    .optional()
    .notEmpty()
    .withMessage("The 'amount' field cannot be empty.")
    .isNumeric()
    .withMessage("The 'amount' field must be a number."),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const updateReconnectionValidator = [
  check("name")
    .optional()
    .notEmpty()
    .withMessage("The 'name' field cannot be empty.")
    .isLength({ min: 3, max: 99 })
    .withMessage("The 'name' field must be between 3 and 99 characters."),
  check("amount")
    .optional()
    .notEmpty()
    .withMessage("The 'amount' field cannot be empty.")
    .isNumeric()
    .withMessage("The 'amount' field must be a number."),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const deleteReconnectionValidator = [
  param("id").isMongoId().withMessage("Invalid property ID."),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = {
  getReconnectionsValidator,
  createReconnectionValidator,
  updateReconnectionValidator,
  deleteReconnectionValidator,
};
