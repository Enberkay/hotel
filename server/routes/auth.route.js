const express = require("express");
const router = express.Router();

const {
  login,
  currentUser,
  registerDefaultAdmin,
} = require("../controllers/auth.controller");

const {
  adminCheck,
  authCheck,
  customerCheck,
  frontCheck,
  housekeepingCheck,
  maintenanceCheck,
} = require("../middlewares/authCheck");

// Login
router.post("/login", login);

// Register default admin
router.post("/register-default-admin", registerDefaultAdmin);

// Current user (admin, customer, front, housekeeping, maintenance)
router.post("/current-admin", authCheck, adminCheck, currentUser);
router.post("/current-customer", authCheck, customerCheck, currentUser);
router.post("/current-front", authCheck, frontCheck, currentUser);
router.post("/current-housekeeping", authCheck, housekeepingCheck, currentUser);
router.post("/current-maintenance", authCheck, maintenanceCheck, currentUser);

module.exports = router;
