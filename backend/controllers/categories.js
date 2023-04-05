const Category = require("../models/Category");
const { matchedData } = require("express-validator");
const { handleHttpError } = require("../utils/handleError");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_CATEGORIES");
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, pricePerCubicMeter, fixedPrice } = matchedData(req);

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
      return handleHttpError(res, "CATEGORY_ALREADY_EXISTS", 400);
    }

    const newCategory = new Category({
      name,
      pricePerCubicMeter,
      fixedPrice,
    });

    const category = await newCategory.save();

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_CREATE_CATEGORY");
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = matchedData(req);

    const category = await Category.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_UPDATE_CATEGORY");
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return handleHttpError(res, "CATEGORY_NOT_EXISTS", 404);
    }

    await category.delete();

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_DELETE_CATEGORY");
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
