const { validationResult } = require("express-validator");

const validateResults = (req, res, next) => {
  try {
    validationResult(req).throw();
    next();
  } catch (err) {
    res.status(400).json({
      success: false,
      error: {
        message: "Validation errors",
        code: 400,
        details: err.array(),
      },
    });
  }
};

module.exports = validateResults;
