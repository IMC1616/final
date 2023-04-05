const express = require("express");
const meterController = require("../controllers/meters");
const {
  createMeterValidator,
  updateMeterValidator,
  deleteMeterValidator,
} = require("../validators/meters");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAuthorized = require("../middlewares/isAuthorized");

const router = express.Router();

// TODO: search by code, or search in general

router.get(
  "/",
  [isAuthenticated, isAuthorized(["reader", "admin"])],
  meterController.getMeters
);

router.post(
  "/",
  [createMeterValidator, isAuthenticated, isAuthorized(["admin"])],
  meterController.createMeter
);

router.put(
  "/:id",
  [updateMeterValidator, isAuthenticated, isAuthorized(["admin"])],
  meterController.updateMeter
);

router.delete(
  "/:id",
  [deleteMeterValidator, isAuthenticated, isAuthorized(["admin"])],
  meterController.deleteMeter
);

module.exports = router;
