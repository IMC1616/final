const Property = require("../models/Property");
const { matchedData } = require("express-validator");
const { handleHttpError } = require("../utils/handleError");

const buildQuery = (query) => {
  const queryFields = ["address", "city"];
  const queryObj = {};

  queryFields.forEach((field) => {
    if (query[field]) {
      if (field === "role") {
        queryObj[field] = query[field];
      } else {
        queryObj[field] = { $regex: query[field], $options: "i" };
      }
    }
  });

  return queryObj;
};

const getProperties = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "asc";
    const select = req.query.select || "";
    const query = buildQuery(req.query);

    const queryBuilder = Property.find(query)
      .populate("user", "name lastName email")
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: sort === "asc" ? 1 : -1 });

    if (select) {
      const fields = select.split(",").join(" ");
      queryBuilder.select(fields);
    }

    const properties = await queryBuilder.exec();
    const totalProperties = await Property.countDocuments(query);
    const totalPages = Math.ceil(totalProperties / limit);

    res.status(200).json({
      success: true,
      data: {
        properties,
        offset,
        limit,
        sort,
        select,
        query,
        totalPages,
      },
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_PROPERTIES");
  }
};

const createProperty = async (req, res) => {
  try {
    const { address, city, user } = matchedData(req);

    const propertyExists = await Property.findOne({ address, city, user });

    if (propertyExists) {
      return handleHttpError(res, "PROPERTY_ALREADY_EXISTS", 400);
    }

    const newProperty = new Property({
      address,
      city,
      user,
    });

    const property = await newProperty.save();

    res.status(201).json({
      success: true,
      data: property,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_CREATE_PROPERTY");
  }
};

const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = matchedData(req);

    const property = await Property.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_UPDATE_PROPERTY");
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);
    if (!property) {
      return handleHttpError(res, "PROPERTY_NOT_EXISTS", 404);
    }

    await property.delete();

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_DELETE_PROPERTY");
  }
};

module.exports = {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
};
