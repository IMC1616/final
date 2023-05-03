const { check, param, query } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const getConsumptionsValidator = [
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

const createConsumptionValidator = [
  check("readingDate")
    .custom((value) => {
      const dateObject = new Date(value);
      return !isNaN(dateObject.getTime());
    })
    .withMessage("Reading date must be a valid date"),
  check("previousReading")
    .isNumeric()
    .withMessage("Previous reading must be a number"),
  check("currentReading")
    .isNumeric()
    .withMessage("Current reading must be a number"),
  check("consumptionCubicMeters")
    .isNumeric()
    .withMessage("Consumption in cubic meters must be a number"),
  check("meter").isMongoId().withMessage("Meter must be a valid MongoDB ID"),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];




const updateConsumptionValidator = [
  check("readingDate")
    .optional()
    .custom((value) => {
      const dateObject = new Date(value);
      return !isNaN(dateObject.getTime());
    })
    .withMessage("Reading date must be a valid date"),
  check("previousReading")
    .optional()
    .isNumeric()
    .withMessage("Previous reading must be a number"),
  check("currentReading")
    .optional()
    .isNumeric()
    .withMessage("Current reading must be a number"),
  check("consumptionCubicMeters")
    .optional()
    .isNumeric()
    .withMessage("Consumption in cubic meters must be a number"),
  check("meter")
    .optional()
    .isMongoId()
    .withMessage("Meter must be a valid MongoDB ID"),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const deleteConsumptionValidator = [
  param("id").isMongoId().withMessage("Invalid property ID."),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = {
  getConsumptionsValidator,
  createConsumptionValidator,
  updateConsumptionValidator,
  deleteConsumptionValidator,
};
