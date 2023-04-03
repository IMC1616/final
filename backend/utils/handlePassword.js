const bcryptjs = require("bcryptjs");

/**
 * Unencrypted password
 * @param {*} password
 */
const encrypt = async (password) => {
  const hash = await bcryptjs.hash(password, 10);
  return hash;
};

/**
 * Unencrypted password and encrypted password
 * @param {*} password
 * @param {*} hashedPassword
 */
const compare = async (password, hashedPassword) => {
  return await bcryptjs.compare(password, hashedPassword);
};

module.exports = { encrypt, compare };
