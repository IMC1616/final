const express = require("express");
const meterController = require("../controllers/meters");
const {
  getMetersValidator,
  createMeterValidator,
  updateMeterValidator,
  deleteMeterValidator,
} = require("../validators/meters");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAuthorized = require("../middlewares/isAuthorized");

const router = express.Router();

router.get(
  "/",
  [getMetersValidator, isAuthenticated, isAuthorized(["reader", "admin"])],
  meterController.getMeters
);

router.get(
  "/code/:code",
  [getMetersValidator, isAuthenticated],
  meterController.getMeterByCode
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
