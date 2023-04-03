const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * You must pass the user object
 * @param {*} user
 */
const signToken = async (user) => {
  const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "24h",
  });

  return token;
};

/**
 * You must pass the session token in the JWT
 * @param {*} token
 * @returns
 */
const verifyToken = async (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
};

module.exports = { signToken, verifyToken };
