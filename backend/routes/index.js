const express = require("express");
const fs = require("fs");
const removeExtension = require("../utils/handleRemoveExtension");

const router = express.Router();

const PATH_ROUTES = __dirname;

fs.readdirSync(PATH_ROUTES).filter((file) => {
  const name = removeExtension(file);
  if (name !== "index") {
    router.use(`/${name}`, require(`./${file}`));
  }
});

module.exports = router;
