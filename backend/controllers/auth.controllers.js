const User = require("../models/User");
const { matchedData } = require("express-validator");
const { compare } = require("../utils/handlePassword");
const { signToken } = require("../utils/handleJwt");
const { handleHttpError } = require("../utils/handleError");

const login = async (req, res) => {
  try {
    const { email, password } = matchedData(req);
    const user = await User.findOne({ email });

    if (!user) {
      handleHttpError(res, "USER_NOT_EXISTS", 404);
      return;
    }

    const hashedPassword = user.get("password");
    const validPassword = await compare(password, hashedPassword);
    if (!validPassword) {
      return handleHttpError(res, "INVALID_PASSWORD", 404);
    }

    user.set("password", undefined, { strict: false });

    const token = await signToken(user);

    res.status(200).json({
      success: true,
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    handleHttpError(res, "ERROR_LOGIN_USER");
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { _id } = req.user;

    // Get user by id
    const user = await User.findById(_id);
    user.set("password", undefined, { strict: false });

    // Generate a new JWT
    const token = await signToken(user);

    res.status(200).json({
      success: true,
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    handleHttpError(res, "ERROR_REFRESH_ACCESS_TOKEN");
  }
};

module.exports = { login, refreshAccessToken };
