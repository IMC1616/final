const express = require("express");
const invoiceController = require("../controllers/invoices");
const {
  getInvoicesByMeterValidator,
  invoiceIdValidator,
  invoiceTypeValidator,
} = require("../validators/invoices");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAuthorized = require("../middlewares/isAuthorized");

const router = express.Router();

router.get(
  "/",
  [
    getInvoicesByMeterValidator,
    isAuthenticated,
    isAuthorized(["reader", "admin"]),
  ],
  invoiceController.getInvoicesByMeter
);

router.get(
  "/:id",
  [invoiceIdValidator, isAuthenticated, isAuthorized(["reader", "admin"])],
  invoiceController.getInvoiceById
);

router.put(
  "/:id/:invoiceType/pay/",
  [
    invoiceIdValidator,
    invoiceTypeValidator,
    isAuthenticated,
    isAuthorized(["reader", "admin"]),
  ],
  invoiceController.payInvoice
);

module.exports = router;
