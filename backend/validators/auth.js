const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const loginValidator = [
  check("email").exists().notEmpty().isEmail(),
  check("password").exists().notEmpty(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { loginValidator };
