const Meter = require("../models/Meter");
const { matchedData } = require("express-validator");
const { handleHttpError } = require("../utils/handleError");

const getMeters = async (req, res) => {
  try {
    const meters = await Meter.find().populate(["category", "property"]);
    res.status(200).json({
      success: true,
      data: meters,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_METERS");
  }
};

const createMeter = async (req, res) => {
  try {
    const { code, status, property, category } = matchedData(req);

    const meterExists = await Meter.findOne({
      code,
      status,
      property,
      category,
    });

    if (meterExists) {
      return handleHttpError(res, "METER_ALREADY_EXISTS", 400);
    }

    const newMeter = new Meter({
      code,
      status,
      property,
      category,
    });

    const meter = await newMeter.save();

    res.status(201).json({
      success: true,
      data: meter,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_CREATE_METER");
  }
};

const updateMeter = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = matchedData(req);

    const meter = await Meter.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

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
  createMeter,
  updateMeter,
  deleteMeter,
};
