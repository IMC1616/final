const express = require("express");
const reconnectionController = require("../controllers/reconnections");
const {
  getReconnectionsValidator,
  createReconnectionValidator,
  updateReconnectionValidator,
  deleteReconnectionValidator,
} = require("../validators/reconnection");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAuthorized = require("../middlewares/isAuthorized");

const router = express.Router();

router.get(
  "/",
  [
    getReconnectionsValidator,
    isAuthenticated,
    isAuthorized(["reader", "admin"]),
  ],
  reconnectionController.getReconnections
);

router.post(
  "/",
  [createReconnectionValidator, isAuthenticated, isAuthorized(["admin"])],
  reconnectionController.createReconnection
);

router.put(
  "/:id",
  [updateReconnectionValidator, isAuthenticated, isAuthorized(["admin"])],
  reconnectionController.updateReconnection
);

router.delete(
  "/:id",
  [deleteReconnectionValidator, isAuthenticated, isAuthorized(["admin"])],
  reconnectionController.deleteReconnection
);

module.exports = router;
