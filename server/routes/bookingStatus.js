const express = require("express")
const router = express.Router()

const { create, list } = require("../controllers/bookingStatus")

const { authCheck } = require("../middlewares/authCheck")

// 🔹 สร้างสถานะของใบจอง (Create Booking Status)
router.post("/booking-statuses", authCheck, create)

// 🔹 ดูสถานะใบจองทั้งหมด (List Booking Statuses)
router.get("/booking-statuses", authCheck, list)



module.exports = router