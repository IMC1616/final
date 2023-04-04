const express = require("express");
const categoryController = require("../controllers/categories");
const {
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../validators/categories");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAuthorized = require("../middlewares/isAuthorized");

const router = express.Router();

router.get(
  "/",
  [isAuthenticated, isAuthorized(["reader", "admin"])],
  categoryController.getCategories
);

router.post(
  "/",
  [createCategoryValidator, isAuthenticated, isAuthorized(["admin"])],
  categoryController.createCategory
);

router.put(
  "/:id",
  [updateCategoryValidator, isAuthenticated, isAuthorized(["admin"])],
  categoryController.updateCategory
);

router.delete(
  "/:id",
  [deleteCategoryValidator, isAuthenticated, isAuthorized(["admin"])],
  categoryController.deleteCategory
);

module.exports = router;
