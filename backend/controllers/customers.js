const User = require("../models/User");
const Property = require("../models/Property");
const Meter = require("../models/Meter");
const Consumption = require("../models/Consumption");
const { matchedData } = require("express-validator");
const { handleHttpError } = require("../utils/handleError");
const generatePassword = require("../utils/generatePassword");
const { encrypt } = require("../utils/handlePassword");
const sendEmail = require("../utils/sendEmail");

const searchCustomers = async (req, res) => {
  const { ci, code, category, status } = req.query;

  try {
    if (!ci && !code && !category && !status) {
      const customers = await User.find({ role: "customer" }).exec();

      return res.status(200).json({
        success: true,
        data: {
          customers,
        },
      });
    }

    let customers = [];

    if (ci) {
      const customerFound = await User.findOne({ ci, role: "customer" });

      if (!customerFound) {
        return res.status(404).json({
          message: "Socio no encontrado con los criterios proporcionados.",
        });
      } else {
        customers.push(customerFound);
      }
    }

    if (code || category || status) {
      let meterConditions = {};

      if (code) meterConditions.code = code;
      if (category) meterConditions.category = category;
      if (status) meterConditions.status = status;

      const meters = await Meter.find(meterConditions);

      if (meters.length === 0) {
        return res.status(404).json({
          message: "Socio no encontrado con los criterios proporcionados.",
        });
      }

      const propertyIds = meters.map((meter) => meter.property);
      const properties = await Property.find({ _id: { $in: propertyIds } });

      const userIds = properties.map((property) => property.user);
      const matchedUsers = await User.find({
        _id: { $in: userIds },
        role: "customer",
      });

      customers = customers.concat(matchedUsers);
    }

    const uniqueCustomersSet = new Set(
      customers.map((customer) => JSON.stringify(customer))
    );
    const uniqueCustomers = Array.from(uniqueCustomersSet).map(
      (customerString) => JSON.parse(customerString)
    );

    return res.status(200).json({
      success: true,
      data: {
        customers: uniqueCustomers,
      },
    });
  } catch (error) {
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
