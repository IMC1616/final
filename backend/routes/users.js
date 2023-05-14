const express = require("express");
const userController = require("../controllers/users");
const {
  getUsersValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getUserDebtsValidator,
} = require("../validators/users");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAuthorized = require("../middlewares/isAuthorized");

const router = express.Router();

router.get(
  "/",
  [getUsersValidator, isAuthenticated, isAuthorized(["reader", "admin"])],
  userController.getUsers
);

router.get(
  "/:userId/properties",
  [isAuthenticated],
  userController.getUserProperties
);

router.get("/:userId/meters", [isAuthenticated], userController.getUserMeters);

router.get("/:userId/debts", [getUserDebtsValidator, isAuthenticated], userController.getUserDebts);

router.get("/:userId/consumptions", [isAuthenticated], userController.getUserConsumptions);

router.post(
  "/",
  [createUserValidator, isAuthenticated, isAuthorized(["admin"])],
  userController.createUser
);

router.put(
  "/:id",
  [updateUserValidator, isAuthenticated, isAuthorized(["admin"])],
  userController.updateUser
);

router.delete(
  "/:id",
  [deleteUserValidator, isAuthenticated, isAuthorized(["admin"])],
  userController.deleteUser
);

module.exports = router;
