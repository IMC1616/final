const User = require("../models/User");
const Property = require("../models/Property");
const Meter = require("../models/Meter");
const Consumption = require("../models/Consumption");
const Invoice = require("../models/Invoice");
const { matchedData } = require("express-validator");
const { handleHttpError } = require("../utils/handleError");
const generatePassword = require("../utils/generatePassword");
const { encrypt } = require("../utils/handlePassword");
const sendEmail = require("../utils/sendEmail");

const buildQuery = (query) => {
  const queryFields = ["name", "lastName", "email", "mobile", "phone", "role"];
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

const getUsers = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "asc";
    const select = req.query.select || "";
    const query = buildQuery(req.query);

    const queryBuilder = User.find(query).skip(offset).limit(limit).sort(sort);

    if (select) {
      const fields = select.split(",").join(" ");
      queryBuilder.select(fields);
    }

    const users = await queryBuilder.exec();
    const totalRecords = await User.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit);

    res.status(200).json({
      success: true,
      data: {
        users,
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
    handleHttpError(res, "ERROR_GET_USERS");
  }
};

const getUserProperties = async (req, res) => {
  try {
    const { userId } = req.params;
    const properties = await Property.find({ user: userId });

    res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_USER_PROPERTIES");
  }
};

const getUserMeters = async (req, res) => {
  try {
    const { userId } = req.params;
    const meters = await Meter.find().populate([
      {
        path: "property",
        match: { user: userId },
      },
      {
        path: "category",
      },
    ]);

    const userMeters = meters.filter((meter) => meter.property !== null);

    res.status(200).json({
      success: true,
      data: userMeters,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_USER_METERS");
  }
};

const getUserDebts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    let unpaidInvoices;
    if (startDate && endDate) {
      unpaidInvoices = await Invoice.find({
        user: userId,
        invoiceDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        },
        paymentStatus: 'pending'
      }).populate('user');
    } else {
      unpaidInvoices = await Invoice.find({
        user: userId,
        paymentStatus: 'pending'
      }).populate('user');
    }

    const userDebts = unpaidInvoices.reduce((acc, invoice) => {
      if (!acc) {
        acc = {
          userInfo: invoice.user,
          totalDebt: 0,
          monthlyDetails: {}
        };
      }

      acc.totalDebt += invoice.totalAmount;

      const invoiceMonth = invoice.invoiceDate.getMonth() + 1;
      if (!acc.monthlyDetails[invoiceMonth]) {
        acc.monthlyDetails[invoiceMonth] = 0;
      }
      acc.monthlyDetails[invoiceMonth] += invoice.totalAmount;

      return acc;
    }, null);

    if (!userDebts) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron facturas impagas para el usuario especificado'
      });
    }

    res.status(200).json({
      success: true,
      data: userDebts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Hubo un error al obtener los informes de impagos'
    });
  }
};

const getUserConsumptions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    const properties = await Property.find({ user: userId });

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
    handleHttpError(res, "ERROR_GET_USER_CONSUMPTIONS");
  }
};

const createUser = async (req, res) => {
  try {
    const { name, lastName, ci, email, mobile, phone, role } = matchedData(req);

    const userExists = await User.findOne({ email });

    if (userExists) {
      return handleHttpError(res, "USER_ALREADY_EXISTS", 400);
    }

    const password = generatePassword();

    const newUser = new User({
      name,
      lastName,
      ci,
      email,
      mobile,
      phone,
      role,
      password: await encrypt(password),
    });

    const user = await newUser.save();

    sendEmail(user.email, "Your Password", `Your password is: ${password}`);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_CREATE_USER");
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = matchedData(req);

    const user = await User.findByIdAndUpdate(id, updateFields, { new: true });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_UPDATE_USER");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return handleHttpError(res, "USER_NOT_EXISTS", 404);
    }

    await user.delete();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_DELETE_USER");
  }
};

module.exports = {
  getUsers,
  getUserProperties,
  getUserMeters,
  getUserDebts,
  getUserConsumptions,
  createUser,
  updateUser,
  deleteUser,
};
