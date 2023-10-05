const { check, param, query } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const getUsersValidator = [
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

const createUserValidator = [
  check("name").exists().notEmpty().isLength({ min: 3, max: 99 }),
  check("lastName").exists().notEmpty().isLength({ min: 3, max: 99 }),
  check("email").exists().notEmpty().isEmail(),
  check("ci").exists().notEmpty(),
  check("password").optional().notEmpty().isLength({ min: 6, max: 100 }),
  check("mobile").optional().isString().isLength({ min: 10, max: 15 }),
  check("phone").optional().isString().isLength({ min: 10, max: 15 }),
  check("role").exists().isIn(["customer", "manifold", "reader", "admin"]),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const updateUserValidator = [
  param("id").isMongoId().withMessage("Invalid user ID."),
  check("name").optional().isLength({ min: 3, max: 99 }),
  check("lastName").optional().isLength({ min: 3, max: 99 }),
  check("email").optional().isEmail(),
  check("ci").optional(),
  check("mobile").optional().isString(),
  check("phone").optional().isString(),
  check("role").optional().isIn(["customer", "manifold", "reader", "admin"]),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const deleteUserValidator = [
  param("id").isMongoId().withMessage("Invalid user ID."),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const getUserDebtsValidator = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage(
      "La fecha de inicio 'startDate' debe estar en formato ISO 8601 (YYYY-MM-DD)."
    ),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage(
      "La fecha de fin 'endDate' debe estar en formato ISO 8601 (YYYY-MM-DD)."
    ),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];
module.exports = {
  getUsersValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getUserDebtsValidator,
};
