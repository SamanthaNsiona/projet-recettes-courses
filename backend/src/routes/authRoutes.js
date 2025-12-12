const { Router } = require("express");
const { register, login, forgotPassword, resetPassword } = require("../controllers/authController");
const { loginLimiter, registerLimiter, passwordResetLimiter } = require("../middleware/rateLimiter");

const router = Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password", passwordResetLimiter, resetPassword);

module.exports = { router };
