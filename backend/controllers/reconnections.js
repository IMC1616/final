const Reconnection = require("../models/Reconnection");
const { matchedData } = require("express-validator");
const { handleHttpError } = require("../utils/handleError");

const buildQuery = (query) => {
  const queryFields = ["name", "amount"];
  const queryObj = {};

  queryFields.forEach((field) => {
    if (query[field]) {
      queryObj[field] = { $regex: query[field], $options: "i" };
    }
  });

  return queryObj;
};
const getReconnections = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "asc";
    const select = req.query.select || "";
    const query = buildQuery(req.query);

    const queryBuilder = Reconnection.find(query)
      .skip(offset)
      .limit(limit)
      .sort(sort);

    if (select) {
      const fields = select.split(",").join(" ");
      queryBuilder.select(fields);
    }

    const reconnections = await queryBuilder.exec();

    const totalRecords = await Reconnection.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit);

    res.status(200).json({
      success: true,
      data: {
        reconnections,
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
    handleHttpError(res, "ERROR_GET_RECONNECTIONS");
  }
};

const createReconnection = async (req, res) => {
  try {
    const { name, amount } = matchedData(req);

    const reconnectionExists = await Reconnection.findOne({ name });

    if (reconnectionExists) {
      return handleHttpError(res, "RECONNECTION_ALREADY_EXISTS", 400);
    }

    const newReconnection = new Reconnection({
      name,
      amount,
    });

    const reconnection = await newReconnection.save();

    res.status(201).json({
      success: true,
      data: reconnection,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_CREATE_RECONNECTION");
  }
};

const updateReconnection = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = matchedData(req);

    const reconnection = await Reconnection.findByIdAndUpdate(
      id,
      updateFields,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      data: reconnection,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_UPDATE_RECONNECTION");
  }
};

const deleteReconnection = async (req, res) => {
  try {
    const { id } = req.params;

    const reconnection = await Reconnection.findById(id);
    if (!reconnection) {
      return handleHttpError(res, "RECONNECTION_NOT_EXISTS", 404);
    }

    await reconnection.delete();

    res.status(200).json({
      success: true,
      data: reconnection,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_DELETE_RECONNECTION");
  }
};

module.exports = {
  getReconnections,
  createReconnection,
  updateReconnection,
  deleteReconnection,
};
