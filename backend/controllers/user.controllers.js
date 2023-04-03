const User = require("../models/User");
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
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

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
      },
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_USERS");
  }
};

const createUser = async (req, res) => {
  try {
    const { name, lastName, email, mobile, phone, role } = matchedData(req);

    const userExists = await User.findOne({ email });

    if (userExists) {
      return handleHttpError(res, "USER_ALREADY_EXISTS", 400);
    }

    const password = generatePassword();

    const newUser = new User({
      name,
      lastName,
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

module.exports = { getUsers, createUser, updateUser, deleteUser };
