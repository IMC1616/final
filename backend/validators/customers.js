const { check, param, query } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const searchCustomersValidator = [
  query("ci")
    .optional()
    .isString()
    .withMessage("El valor de 'ci' debe ser una cadena de caracteres."),
  query("code")
    .optional()
    .isString()
    .withMessage("El valor de 'code' debe ser una cadena de caracteres."),
  query("category")
    .optional()
    .isString()
    .withMessage("El valor de 'category' debe ser una cadena de caracteres."),
  query("status")
    .optional()
    .isString()
    .withMessage("El valor de 'status' debe ser una cadena de caracteres."),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const createCustomerValidator = [
  check("name").exists().notEmpty().isLength({ min: 3, max: 99 }),
  check("lastName").exists().notEmpty().isLength({ min: 3, max: 99 }),
  check("email").exists().notEmpty().isEmail(),
  check("ci").exists().notEmpty(),
  check("password").optional().notEmpty().isLength({ min: 6, max: 100 }),
  check("mobile").optional().isString().isLength({ min: 10, max: 15 }),
  check("phone").optional().isString().isLength({ min: 10, max: 15 }),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const updateCustomerValidator = [
  param("id").isMongoId().withMessage("Invalid user ID."),
  check("name").optional().notEmpty().isLength({ min: 3, max: 99 }),
  check("lastName").optional().notEmpty().isLength({ min: 3, max: 99 }),
  check("email").optional().notEmpty().isEmail(),
  check("ci").exists().notEmpty(),
  check("mobile").optional().isString(),
  check("phone").optional().isString(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const deleteCustomerValidator = [
  param("id").isMongoId().withMessage("Invalid user ID."),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = {
  searchCustomersValidator,
  createCustomerValidator,
  updateCustomerValidator,
  deleteCustomerValidator,
};
