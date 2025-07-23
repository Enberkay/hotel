const express = require("express");
const router = express.Router();

// const {
//   login,
//   currentUser,
//   registerDefaultAdmin,
// } = require("../controllers/auth.controller");

const { login, currentUser, registerDefaultAdmin } = require("../controllers/auth.controller");

const {
  adminCheck,
  authCheck,
  frontCheck,
  housekeepingCheck,
} = require("../middlewares/authCheck");

// Login
router.post("/login", login);

// Register default admin
router.post("/register-default-admin", registerDefaultAdmin);

// Current user (admin, front, housekeeping)
router.post("/current-admin", authCheck, adminCheck, currentUser);
router.post("/current-front", authCheck, frontCheck, currentUser);
router.post("/current-housekeeping", authCheck, housekeepingCheck, currentUser);

module.exports = router;
