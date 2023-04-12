const Category = require("../models/Category");
const { matchedData } = require("express-validator");
const { handleHttpError } = require("../utils/handleError");

const buildQuery = (query) => {
  const queryFields = ["name", "pricePerCubicMeter", "fixedPrice"];
  const queryObj = {};

  queryFields.forEach((field) => {
    if (query[field]) {
      queryObj[field] = { $regex: query[field], $options: "i" };
    }
  });

  return queryObj;
};
const getCategories = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "asc";
    const select = req.query.select || "";
    const query = buildQuery(req.query);

    const queryBuilder = Category.find(query).skip(offset).limit(limit).sort(sort);

    if (select) {
      const fields = select.split(",").join(" ");
      queryBuilder.select(fields);
    }

    const categories = await queryBuilder.exec();

    const totalRecords = await Category.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit);

    res.status(200).json({
      success: true,
      data: {
        categories,
        offset,
        limit,
        sort,
        select,
        query,
        totalPages,
        totalRecords,
      },
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
