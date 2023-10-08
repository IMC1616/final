const Consumption = require("../models/Consumption");
const { matchedData } = require("express-validator");
const { handleHttpError } = require("../utils/handleError");
const { createInvoicesAndNotifications } = require("../cronJob");

const buildQuery = (query) => {
  const queryFields = [
    "previousReading",
    "currentReading",
    "consumptionCubicMeters",
    "meter",
  ];
  const queryObj = {};

  queryFields.forEach((field) => {
    if (query[field]) {
      if (
        field === "previousReading" ||
        field === "currentReading" ||
        field === "consumptionCubicMeters"
      ) {
        queryObj[field] = parseFloat(query[field]);
      } else {
        queryObj[field] = { $regex: query[field], $options: "i" };
      }
    }
  });

  if (query.startDate && query.endDate) {
    queryObj.readingDate = {
      $gte: new Date(query.startDate),
      $lte: new Date(query.endDate),
    };
  }

  return queryObj;
};

const getConsumptions = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort
      ? { [req.query.sort]: req.query.order || "asc" }
      : { readingDate: "asc" };
    const select = req.query.select || "";
    const query = buildQuery(req.query);

    const queryBuilder = Consumption.find(query)
      .skip(offset)
      .limit(limit)
      .sort(sort)
      .populate("registeredBy", "name lastName email");

    if (select) {
      const fields = select.split(",").join(" ");
      queryBuilder.select(fields);
    }

    const consumptions = await queryBuilder.exec();
    console.log(
      "🚀 ~ file: consumptions.js:61 ~ getConsumptions ~ consumptions:",
      consumptions
    );
    const totalConsumptions = await Consumption.countDocuments(query);
    const totalPages = Math.ceil(totalConsumptions / limit);

    res.status(200).json({
      success: true,
      data: {
        consumptions,
        offset,
        limit,
        sort,
        select,
        query,
        totalPages,
      },
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_CONSUMPTIONS");
  }
};

const createConsumption = async (req, res) => {
  try {
    const {
      readingDate,
      previousReading,
      currentReading,
      consumptionCubicMeters,
      meter,
    } = matchedData(req);

    const parsedReadingDate = new Date(readingDate);

    const startDate = new Date(
      parsedReadingDate.getFullYear(),
      parsedReadingDate.getMonth(),
      1
    );
    const endDate = new Date(
      parsedReadingDate.getFullYear(),
      parsedReadingDate.getMonth() + 1,
      0
    );

    const consumptionExists = await Consumption.findOne({
      meter,
      readingDate: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    if (consumptionExists) {
      return handleHttpError(res, "CONSUMPTION_ALREADY_EXISTS", 400);
    }

    const newConsumption = new Consumption({
      readingDate: parsedReadingDate,
      previousReading,
      currentReading,
      consumptionCubicMeters,
      meter,
      registeredBy: req.user._id,
    });

    const consumption = await newConsumption.save();

    // Llama a la función para crear facturas y notificaciones
    await createInvoicesAndNotifications();

    res.status(201).json({
      success: true,
      data: consumption,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: consumptions.js:127 ~ createConsumption ~ error:",
      error
    );
    handleHttpError(res, "ERROR_CREATE_CONSUMPTION");
  }
};

const updateConsumption = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = matchedData(req);

    const consumption = await Consumption.findByIdAndUpdate(
      id,
      { ...updateFields, registeredBy: req.user._id },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      data: consumption,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_UPDATE_CONSUMPTION");
  }
};

const deleteConsumption = async (req, res) => {
  try {
    const { id } = req.params;

    const consumption = await Consumption.findById(id);
    if (!consumption) {
      return handleHttpError(res, "CONSUMPTION_NOT_EXISTS", 404);
    }

    await consumption.delete();

    res.status(200).json({
      success: true,
      data: consumption,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_DELETE_CONSUMPTION");
  }
};

module.exports = {
  getConsumptions,
  createConsumption,
  updateConsumption,
  deleteConsumption,
};
