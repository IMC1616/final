const User = require("../models/User");
const Property = require("../models/Property");
const Meter = require("../models/Meter");
const Consumption = require("../models/Consumption");
const { matchedData } = require("express-validator");
const { handleHttpError } = require("../utils/handleError");
const generatePassword = require("../utils/generatePassword");
const { encrypt } = require("../utils/handlePassword");
const sendEmail = require("../utils/sendEmail");

const buildQuery = async (query) => {
  const queryFields = ["ci", "meterCode", "category", "meterStatus"];
  const queryObj = { role: "customer" };
  const meterIds = new Set();

  for (const field of queryFields) {
    if (query[field]) {
      switch (field) {
        case "ci":
          queryObj.ci = { $regex: query[field], $options: "i" };
          break;
        case "meterCode":
          const meters = await Meter.find({
            code: { $regex: query[field], $options: "i" },
          }).select("_id");
          meters.forEach((meter) => meterIds.add(meter._id));
          break;
        case "category":
          const categoryMeters = await Meter.find({ category: query[field] }).select("_id");
          categoryMeters.forEach((meter) => meterIds.add(meter._id));
          break;
        case "meterStatus":
          const metersStatus = await Meter.find({ status: query[field] }).select("_id");
          metersStatus.forEach((meter) => meterIds.add(meter._id));
          break;
        default:
          break;
      }
    }
  }

  if (meterIds.size > 0) {
    queryObj["meter"] = { $in: Array.from(meterIds) };
  }

  return queryObj;
};

const searchCustomers = async (req, res) => {
  try {
    const {
      offset = 0,
      limit = 10,
      sort = "asc",
    } = req.query;

    const match = await buildQuery(req.query);
    const customers = await Property.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "meters",
          localField: "_id",
          foreignField: "property",
          as: "meter",
        },
      },
      { $unwind: "$meter" },
      {
        $lookup: {
          from: "categories",
          localField: "meter.category",
          foreignField: "_id",
          as: "meter.category",
        },
      },
      { $unwind: "$meter.category" },
      { $match: match },
      { $skip: parseInt(offset) },
      { $limit: parseInt(limit) },
      { $sort: { "user.name": sort === "asc" ? 1 : -1 } },
    ]);

    const totalRecords = await Property.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "meters",
          localField: "_id",
          foreignField: "property",
          as: "meter",
        },
      },
      { $unwind: "$meter" },
      {
        $lookup: {
          from: "categories",
          localField: "meter.category",
          foreignField: "_id",
          as: "meter.category",
        },
      },
      { $unwind: "$meter.category" },
      { $match: match },
      { $count: "totalRecords" },
    ]);

    const totalPages = Math.ceil(totalRecords[0]?.totalRecords / parseInt(limit)) || 0;
    console.log("🚀 ~ file: customers.js:132 ~ searchCustomers ~ totalPages:", totalPages)

    res.status(200).json({
      success: true,
      data: {
        customers,
        sort,
        limit: parseInt(limit),
        offset: parseInt(offset),
        totalPages,
        totalRecords: totalRecords[0]?.totalRecords || 0,
      },
    });
  } catch (error) {
    console.log("🚀 ~ file: customers.js:88 ~ searchCustomers ~ error:", error);
    handleHttpError(res, "ERROR_GET_CUSTOMERS");
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await User.findById(customerId);

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_CUSTOMER");
  }
};

const getCustomerProperties = async (req, res) => {
  try {
    const { customerId } = req.params;
    console.log("🚀 ~ file: customers.js:161 ~ getCustomerProperties ~ customerId:", customerId)
    const properties = await Property.find({ user: customerId });

    res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_CUSTOMER_PROPERTIES");
  }
};

const getCustomerMeters = async (req, res) => {
  try {
    const { customerId } = req.params;
    const meters = await Meter.find().populate([
      {
        path: "property",
        match: { user: customerId },
      },
      {
        path: "category",
      },
    ]);

    const customerMeters = meters.filter((meter) => meter.property !== null);

    res.status(200).json({
      success: true,
      data: customerMeters,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_CUSTOMER_METERS");
  }
};

const getCustomerConsumptions = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { startDate, endDate } = req.query;

    const properties = await Property.find({ customer: customerId });

    const propertyIds = properties.map((property) => property._id);

    const meters = await Meter.find({ property: { $in: propertyIds } });
    const meterIds = meters.map((meter) => meter._id);

    const query = { meter: { $in: meterIds } };

    if (startDate && endDate) {
      query.readingDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const consumptions = await Consumption.find(query).populate({
      path: "meter",
      select: "status code property",
      // populate: {
      //   path: "property",
      // },
    });

    res.status(200).json({
      success: true,
      data: consumptions,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_CUSTOMER_CONSUMPTIONS");
  }
};

const createCustomer = async (req, res) => {
  try {
    const { name, lastName, ci, email, mobile, phone } = matchedData(req);

    const customerExists = await User.findOne({ email });

    if (customerExists) {
      return handleHttpError(res, "CUSTOMER_ALREADY_EXISTS", 400);
    }

    const password = generatePassword();

    const newUser = new User({
      name,
      lastName,
      ci,
      email,
      mobile,
      phone,
      role: "customer",
      password: await encrypt(password),
    });

    const customer = await newUser.save();

    sendEmail(customer.email, "Your Password", `Your password is: ${password}`);

    res.status(201).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.log("🚀 ~ file: customers.js:251 ~ createCustomer ~ error:", error)
    handleHttpError(res, "ERROR_CREATE_CUSTOMER");
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = matchedData(req);

    const customer = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_UPDATE_CUSTOMER");
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await User.findById(id);
    if (!customer) {
      return handleHttpError(res, "CUSTOMER_NOT_EXISTS", 404);
    }

    await customer.delete();

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_DELETE_CUSTOMER");
  }
};

module.exports = {
  searchCustomers,
  getCustomerById,
  getCustomerProperties,
  getCustomerMeters,
  getCustomerConsumptions,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
