const express = require("express");
const reportController = require("../controllers/reports");
const {
  getIncomesValidator,
  getUnpaidValidator,
} = require("../validators/reports");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAuthorized = require("../middlewares/isAuthorized");
const router = express.Router();

router.get(
  "/income",
  [getIncomesValidator, isAuthenticated, isAuthorized(["reader", "admin"])],
  reportController.getIncomes
);

router.get(
  "/unpaid",
  [getUnpaidValidator, isAuthenticated, isAuthorized(["reader", "admin"])],
  reportController.getUnpaid
);

module.exports = router;