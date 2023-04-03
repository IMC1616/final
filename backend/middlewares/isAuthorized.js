const { handleHttpError } = require("../utils/handleError");

/**
 * Array with the allowed roles
 * @param {*} roles
 * @returns
 */
const isAuthorized = (roles) => (req, res, next) => {
  try {
    const { role } = req.user;

    if (!roles.includes(role)) {
      return handleHttpError(res, "FORBIDDEN", 403);
    }
    next();
  } catch (e) {
    handleHttpError(res, "ERROR_PERMISSIONS", 403);
  }
};

module.exports = isAuthorized;
