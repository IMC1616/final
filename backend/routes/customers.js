const express = require("express");
const customerController = require("../controllers/customers");
const {
  searchCustomersValidator,
  createCustomerValidator,
  updateCustomerValidator,
  deleteCustomerValidator,
} = require("../validators/customers");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAuthorized = require("../middlewares/isAuthorized");

const router = express.Router();

router.get(
  "/",
  [
    searchCustomersValidator,
    isAuthenticated,
    isAuthorized(["reader", "admin"]),
  ],
  customerController.searchCustomers
);

router.get(
  "/:customerId/properties",
  [isAuthenticated],
  customerController.getCustomerProperties
);

router.get(
  "/:customerId/meters",
  [isAuthenticated],
  customerController.getCustomerMeters
);

router.get(
  "/:customerId/consumptions",
  [isAuthenticated],
  customerController.getCustomerConsumptions
);

router.post(
  "/",
  [createCustomerValidator, isAuthenticated, isAuthorized(["admin"])],
  customerController.createCustomer
);

router.put(
  "/:id",
  [updateCustomerValidator, isAuthenticated, isAuthorized(["admin"])],
  customerController.updateCustomer
);

router.delete(
  "/:id",
  [deleteCustomerValidator, isAuthenticated, isAuthorized(["admin"])],
  customerController.deleteCustomer
);

module.exports = router;
