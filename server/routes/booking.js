const express = require("express")
const router = express.Router()

const { createBooking, listBookings, readBooking, confirmBooking } = require("../controllers/booking")
const { checkIn, checkOut } = require("../controllers/checkInAndCheckOut")

const { authCheck, frontCheck } = require("../middlewares/authCheck")

// 🔹 สร้าง Booking (ลูกค้าจองห้อง)
router.post("/bookings", authCheck, createBooking); // ✅ เปลี่ยน "/booking" → "/bookings"

// 🔹 ดูรายการ Booking ทั้งหมด
router.get("/bookings", authCheck, listBookings);

// 🔹 อ่านข้อมูล Booking รายการเดียว
router.get("/bookings/:id", authCheck, readBooking); // ✅ เปลี่ยน "/booking/:id" → "/bookings/:id"

// 🔹 ยืนยันการจอง (พนักงาน Front เท่านั้น)
router.put("/bookings/:id/confirm", authCheck, frontCheck, confirmBooking); // ✅ ใช้ PUT แทน POST และเพิ่ม "/confirm"

// // 🔹 Check-in ให้ลูกค้า
router.put("/bookings/:id/check-in", authCheck, checkIn); // ✅ ใช้ PUT และรวมเข้ากับ bookings

// 🔹 Check-out ให้ลูกค้า
router.put("/bookings/:id/check-out", authCheck, checkOut); // ✅ ใช้ PUT และรวมเข้ากับ bookings

module.exports = router
