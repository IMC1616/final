const Meter = require("../models/Meter");
const Consumption = require("../models/Consumption");
const { matchedData } = require("express-validator");
const { handleHttpError } = require("../utils/handleError");

const buildMeterQuery = (query) => {
  const queryFields = [
    "code",
    "status",
    "property",
    "category",
    "reconnection",
  ];
  const queryObj = {};

  queryFields.forEach((field) => {
    if (query[field]) {
      queryObj[field] = { $regex: query[field], $options: "i" };
    }
  });

  return queryObj;
};

const getMeters = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "asc";
    const select = req.query.select || "";
    const query = buildMeterQuery(req.query);

    const queryBuilder = Meter.find(query)
      .skip(offset)
      .limit(limit)
      .sort(sort)
      .populate(["category", "property", "reconnection"]);

    if (select) {
      const fields = select.split(",").join(" ");
      queryBuilder.select(fields);
    }

    const meters = await queryBuilder.exec();
    res.status(200).json({
      success: true,
      data: meters,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_METERS");
  }
};

const getMeterByCode = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "The 'code' parameter is required to perform the search.",
      });
    }

    const meter = await Meter.findOne({ code }).populate([
      {
        path: "category",
        select: "name pricePerCubicMeter fixedPrice",
      },
      {
        path: "property",
        select: "address",
      },
      {
        path: "reconnection",
        select: "name amount",
      },
    ]);

    if (!meter) {
      return res.status(404).json({
        success: false,
        message: "No meter with that code was found.",
      });
    }

    const consumptions = await Consumption.find({ meter: meter._id }).select(
      "readingDate currentReading consumptionCubicMeters"
    );

    res.status(200).json({
      success: true,
      data: {
        meter,
        consumptions,
      },
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_METER_BY_CODE");
  }
};

const getMeterConsumptions = async (req, res) => {
  const { id } = req.params;

  try {
    const meter = await Meter.findById(id);
    if (!meter) {
      return res
        .status(404)
        .json({ success: false, message: "No se encontró la propiedad." });
    }

    const consumptions = await Consumption.find({ meter: id })
      .sort({ readingDate: -1 })
      .populate("registeredBy");
    return res.status(200).json({ success: true, data: consumptions });
  } catch (err) {
    handleHttpError(res, "ERROR_GET_PROPERTY_METERS");
  }
};

const createMeter = async (req, res) => {
  try {
    const { code, status, property, category, reconnection } = matchedData(req);

    const meterExists = await Meter.findOne({
      code,
      status,
      property,
      category,
      reconnection,
    });

    if (meterExists) {
      return handleHttpError(res, "METER_ALREADY_EXISTS", 400);
    }

    const newMeter = new Meter({
      code,
      status,
      property,
      category,
      reconnection,
      registeredBy: req.user._id,
    });

    const meter = await newMeter.save();

    res.status(201).json({
      success: true,
      data: meter,
    });
  } catch (error) {
    console.log("🚀 ~ createMeter ~ error:", error);
    handleHttpError(res, "ERROR_CREATE_METER");
  }
};

const updateMeter = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = matchedData(req);

    const meter = await Meter.findByIdAndUpdate(
      id,
      { ...updateFields, registeredBy: req.user._id },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      data: meter,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_UPDATE_METER");
  }
};

const deleteMeter = async (req, res) => {
  try {
    const { id } = req.params;

    const meter = await Meter.findById(id);
    if (!meter) {
      return handleHttpError(res, "METER_NOT_EXISTS", 404);
    }

    await meter.delete();

    res.status(200).json({
      success: true,
      data: meter,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_DELETE_METER");
  }
};

module.exports = {
  getMeters,
  getMeterByCode,
  getMeterConsumptions,
  createMeter,
  updateMeter,
  deleteMeter,
};
