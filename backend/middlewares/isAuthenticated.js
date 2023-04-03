const User = require("../models/User");
const { verifyToken } = require("../utils/handleJwt");
const { handleHttpError } = require("../utils/handleError");

const isAuthenticated = async (req, res, next) => {
  try {
    if (!req.headers["x-token"]) {
      handleHttpError(res, "NO_ACCESS_TOKEN_PROVIDED", 403);
      return;
    }
    const token = req.headers["x-token"].split(" ").pop();
    const { _id } = await verifyToken(token);

    if (!token) {
      handleHttpError(res, "NOT_PAYLOAD_DATA", 401);
      return;
    }

    const user = await User.findOne({ _id });
    req.user = user;

    next();
  } catch (error) {
    handleHttpError(res, "INVALID_ACCESS_TOKEN", 401);
  }
};

module.exports = isAuthenticated;
