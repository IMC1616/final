const { query, param } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const getInvoicesByMeterValidator = [
  query("meterCode").exists().withMessage("The 'meterCode' is required."),
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("The 'startDate' must be a valid ISO 8601 date."),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("The 'endDate' must be a valid ISO 8601 date."),
  query("pendingOnly")
    .optional()
    .isIn(["true", "false"])
    .withMessage("The 'pendingOnly' value must be 'true' or 'false'."),
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
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const invoiceIdValidator = [
  param("id").isMongoId().withMessage("Invalid property ID."),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const invoiceTypeValidator = [
  param("invoiceType")
    .isIn(["regular", "reconnection"])
    .withMessage("Invalid invoice type."),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = {
  getInvoicesByMeterValidator,
  invoiceIdValidator,
  invoiceTypeValidator,
};
