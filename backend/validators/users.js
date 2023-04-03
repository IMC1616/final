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
  check("password").optional().notEmpty().isLength({ min: 6, max: 100 }),
  check("mobile").optional().isString().isLength({ min: 10, max: 15 }),
  check("phone").optional().isString().isLength({ min: 10, max: 15 }),
  check("role").exists().isIn(["user", "reader", "admin"]),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const updateUserValidator = [
  check("name").optional().notEmpty().isLength({ min: 3, max: 99 }),
  check("lastName").optional().notEmpty().isLength({ min: 3, max: 99 }),
  check("email").optional().notEmpty().isEmail(),
  check("password").optional().notEmpty().isLength({ min: 6, max: 100 }),
  check("mobile").optional().isString().isLength({ min: 10, max: 15 }),
  check("phone").optional().isString().isLength({ min: 10, max: 15 }),
  check("role").optional().isIn(["user", "reader", "admin"]),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const deleteUserValidator = [
  param("userId").isMongoId().withMessage("ID de usuario no válido."),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = {
  getUsersValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
};
