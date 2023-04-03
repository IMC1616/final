const mongoose = require("mongoose");

const dbConnection = async () => {
  const { NODE_ENV, DB_URI_DEV, DB_URI_TEST, DB_URI_PROD } = process.env;

  const DB_URI =
    NODE_ENV === "test"
      ? DB_URI_TEST
      : NODE_ENV === "production"
      ? DB_URI_PROD
      : DB_URI_DEV;

  try {
    mongoose.set('strictQuery', false);

    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("[DATABASE]: SUCCESSFUL CONNECTION");
  } catch (error) {
    throw new Error("[DATABASE]: CONNECTION ERROR");
  }
};

module.exports = {
  dbConnection,
};
