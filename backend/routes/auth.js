const express = require("express");
const auth = require("../controllers/auth.controllers");
const { loginValidator } = require("../validators/auth");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.post("/login", loginValidator, auth.login);
router.post("/refresh-access-token", isAuthenticated, auth.refreshAccessToken);

// TODO: router.post("/logout", validatorLogin, authController.logout);
// TODO: router.post("/send-reset-password-link", authController.sendResetPasswordLink);
// TODO: router.post("/reset-password", authController.resetPassword);

module.exports = router;
