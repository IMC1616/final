const { check, param, query } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const getPropertiesValidator = [
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

const createPropertyValidator = [
  check("address").exists().notEmpty().withMessage("Address is required."),
  check("city").exists().notEmpty().withMessage("City is required."),
  check("user")
    .exists()
    .notEmpty()
    .isMongoId()
    .withMessage("User ID is required and must be a valid MongoDB ID."),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const updatePropertyValidator = [
  param("id").isMongoId().withMessage("Invalid property ID."),
  check("address").optional().notEmpty().withMessage("Address is required."),
  check("city").optional().notEmpty().withMessage("City is required."),
  check("user")
    .optional()
    .notEmpty()
    .isMongoId()
    .withMessage("User ID is required and must be a valid MongoDB ID."),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const deletePropertyValidator = [
  param("id").isMongoId().withMessage("Invalid property ID."),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = {
  getPropertiesValidator,
  createPropertyValidator,
  updatePropertyValidator,
  deletePropertyValidator,
};
