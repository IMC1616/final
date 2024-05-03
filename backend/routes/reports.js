const express = require("express");
const reportController = require("../controllers/reports");
const {
  getIncomesValidator,
  getDatesValidator,
} = require("../validators/reports");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAuthorized = require("../middlewares/isAuthorized");
const router = express.Router();

router.get(
  "/",
  [isAuthenticated, isAuthorized(["reader", "admin"])],
  reportController.getReport
);

router.get(
  "/income",
  [getIncomesValidator, isAuthenticated, isAuthorized(["reader", "admin"])],
  reportController.getIncomes
);

router.get(
  "/unpaid",
  [getDatesValidator, isAuthenticated, isAuthorized(["reader", "admin"])],
  reportController.getUnpaid
);

router.get(
  "/summary",
  [isAuthenticated, isAuthorized(["reader", "admin"])],
  reportController.getSummary
);

router.get(
  "/delinquent-users",
  [getDatesValidator, isAuthenticated, isAuthorized(["reader", "admin"])],
  reportController.getDelinquentUsersReport
);

module.exports = router;
