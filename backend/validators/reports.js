const { check, param, query } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const getIncomesValidator = [
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

const getUnpaidValidator = [
  query("startDate")
    .isISO8601()
    .withMessage(
      "La fecha de inicio 'startDate' debe estar en formato ISO 8601 (YYYY-MM-DD)."
    ),
  query("endDate")
    .isISO8601()
    .withMessage(
      "La fecha de fin 'endDate' debe estar en formato ISO 8601 (YYYY-MM-DD)."
    ),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];


module.exports = {
  getIncomesValidator,
  getUnpaidValidator,
};
