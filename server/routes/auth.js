const express = require("express")
const router = express.Router()

const { register, login, currentUser } = require("../controllers/auth")

const { adminCheck, authCheck, customerCheck, frontCheck, housekeepingCheck, maintenanceCheck } = require("../middlewares/authCheck")
const { z } = require('zod');
const validateWithZod = require('../middlewares/validateWithZod');

const registerSchema = z.object({
  userEmail: z.string().email(),
  userPassword: z.string().min(6),
  userName: z.string().min(1),
  userSurName: z.string().min(1),
  userNumPhone: z.string().min(8),
  prefix: z.string().optional(),
  licensePlate: z.string().optional(),
});

// ลบ route และ logic ที่เกี่ยวข้องกับ image upload ทั้งหมด

//@ENDPOINT http://localhost:8000/api/register
router.post("/register", validateWithZod(registerSchema), register)
router.post("/login", login)

// router.post("/current-user", authCheck, currentUser)
router.post("/current-admin", authCheck, adminCheck, currentUser)

//permission all users
router.post("/current-customer", authCheck, customerCheck, currentUser)
router.post("/current-front", authCheck, frontCheck, currentUser)
router.post("/current-housekeeping", authCheck, housekeepingCheck, currentUser)
router.post("/current-maintenance", authCheck, maintenanceCheck, currentUser)

module.exports = router