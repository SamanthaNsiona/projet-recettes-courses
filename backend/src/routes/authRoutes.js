const { Router } = require("express");
const { register, login, forgotPassword, resetPassword, getCurrentUser, changePassword, deleteAccount } = require("../controllers/authController");
const { loginLimiter, registerLimiter, passwordResetLimiter } = require("../middleware/rateLimiter");
const { protect } = require("../middleware/authMiddleware");
const { verifyHCaptchaMiddleware } = require("../middleware/hcaptchaMiddleware");

const router = Router();

router.post("/register", registerLimiter, verifyHCaptchaMiddleware, register);
router.post("/login", loginLimiter, login);
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password", passwordResetLimiter, resetPassword);
router.get("/me", protect, getCurrentUser);
router.post("/change-password", protect, changePassword);
router.delete("/delete-account", protect, deleteAccount);

module.exports = { router };
