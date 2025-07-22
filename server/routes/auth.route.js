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
const { z } = require("zod");

router.post("/login", login);

// Endpoint สำหรับสร้าง default admin จาก ENV หรือ fallback
router.post("/register-default-admin", registerDefaultAdmin);

// router.post("/current-user", authCheck, currentUser)
router.post("/current-admin", authCheck, adminCheck, currentUser);

//permission all users
router.post("/current-customer", authCheck, customerCheck, currentUser);
router.post("/current-front", authCheck, frontCheck, currentUser);
router.post("/current-housekeeping", authCheck, housekeepingCheck, currentUser);

module.exports = router;
