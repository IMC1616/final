const express = require("express");
const consumptionController = require("../controllers/consumptions");
const {
  getConsumptionsValidator,
  createConsumptionValidator,
  updateConsumptionValidator,
  deleteConsumptionValidator,
} = require("../validators/consumptions");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAuthorized = require("../middlewares/isAuthorized");

const router = express.Router();

router.get(
  "/",
  [getConsumptionsValidator, isAuthenticated, isAuthorized(["reader", "admin"])],
  consumptionController.getConsumptions
);

router.post(
  "/",
  [createConsumptionValidator, isAuthenticated, isAuthorized(["admin"])],
  consumptionController.createConsumption
);

router.put(
  "/:id",
  [updateConsumptionValidator, isAuthenticated, isAuthorized(["admin"])],
  consumptionController.updateConsumption
);

router.delete(
  "/:id",
  [deleteConsumptionValidator, isAuthenticated, isAuthorized(["admin"])],
  consumptionController.deleteConsumption
);

module.exports = router;
