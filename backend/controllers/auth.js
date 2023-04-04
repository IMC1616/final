const User = require("../models/User");
const { matchedData } = require("express-validator");
const { compare } = require("../utils/handlePassword");
const { signToken } = require("../utils/handleJwt");
const { handleHttpError } = require("../utils/handleError");

const login = async (req, res) => {
  try {
    const { email, password } = matchedData(req);
    const user = await User.findOne({ email }).select("+password");

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

    const user = await User.findById(_id);

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

// TODO: const logout = async (req, res) => {}
// TODO: const sendResetPasswordLink = async (req, res) => {}
// TODO: const resetPassword = async (req, res) => {}

module.exports = { login, refreshAccessToken };
