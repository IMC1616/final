const express = require("express");
const propertyController = require("../controllers/properties");
const {
  getPropertiesValidator,
  createPropertyValidator,
  updatePropertyValidator,
  deletePropertyValidator,
} = require("../validators/properties");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAuthorized = require("../middlewares/isAuthorized");

const router = express.Router();

router.get(
  "/",
  [getPropertiesValidator, isAuthenticated, isAuthorized(["reader", "admin"])],
  propertyController.getProperties
);

router.get(
  "/:id/meters",
  [isAuthenticated, isAuthorized(["reader", "admin"])],
  propertyController.getPropertyMeters
)

router.post(
  "/",
  [createPropertyValidator, isAuthenticated, isAuthorized(["admin"])],
  propertyController.createProperty
);

router.put(
  "/:id",
  [updatePropertyValidator, isAuthenticated, isAuthorized(["admin"])],
  propertyController.updateProperty
);

router.delete(
  "/:id",
  [deletePropertyValidator, isAuthenticated, isAuthorized(["admin"])],
  propertyController.deleteProperty
);

module.exports = router;