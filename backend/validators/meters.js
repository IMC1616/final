const { check, param } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const createMeterValidator = [
  check("code")
    .exists()
    .notEmpty()
    .isLength({ min: 3, max: 99 })
    .withMessage("The code must have between 3 and 99 characters."),
  check("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("The State must be 'Active' or 'Inactive'."),
  check("property")
    .exists()
    .notEmpty()
    .isMongoId()
    .withMessage("The property must be a valid ID of Mongodb."),
  check("category")
    .exists()
    .notEmpty()
    .isMongoId()
    .withMessage("The category must be a valid ID of Mongodb."),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const updateMeterValidator = [
  param("id").isMongoId().withMessage("The meter ID is not valid."),
  check("code")
    .optional()
    .notEmpty()
    .isLength({ min: 3, max: 99 })
    .withMessage("The code must have between 3 and 99 characters."),
  check("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("The State must be 'Active' or 'Inactive'."),
  check("property")
    .optional()
    .notEmpty()
    .isMongoId()
    .withMessage("The property must be a valid ID of Mongodb."),
  check("category")
    .optional()
    .notEmpty()
    .isMongoId()
    .withMessage("The category must be a valid ID of Mongodb."),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const deleteMeterValidator = [
  param("id").isMongoId().withMessage("Invalid property ID."),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = {
  createMeterValidator,
  updateMeterValidator,
  deleteMeterValidator,
};
