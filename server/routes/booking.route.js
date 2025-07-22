const express = require("express")
const router = express.Router()

const { createBooking, listBookings, readBooking, confirmBooking } = require("../controllers/booking.controller")
const { checkIn, checkOut } = require("../controllers/checkInAndCheckOut.controller")

const { authCheck, frontCheck } = require("../middlewares/authCheck")
const { z } = require('zod');
const validateWithZod = require('../middlewares/validateWithZod');

const bookingCreateSchema = z.object({
  count: z.preprocess(val => Number(val), z.number().min(1)),
  roomType: z.enum(['SINGLE', 'DOUBLE', 'SIGNATURE']),
  checkInDate: z.string().min(1),
  checkOutDate: z.string().min(1),
  addon: z.array(z.object({
    addonId: z.number(),
    quantity: z.number()
  })).optional()
});

// 🔹 สร้าง Booking (ลูกค้าจองห้อง)
router.post("/bookings", authCheck, validateWithZod(bookingCreateSchema), createBooking); //เปลี่ยน "/booking" → "/bookings"

// 🔹 ดูรายการ Booking ทั้งหมด
router.get("/bookings", authCheck, listBookings);

// 🔹 อ่านข้อมูล Booking รายการเดียว
router.get("/bookings/:id", authCheck, readBooking); //เปลี่ยน "/booking/:id" → "/bookings/:id"

// 🔹 ยืนยันการจอง (พนักงาน Front เท่านั้น)
router.put("/bookings/:id/confirm", authCheck, frontCheck, confirmBooking); //ใช้ PUT แทน POST และเพิ่ม "/confirm"

// // 🔹 Check-in ให้ลูกค้า
router.put("/bookings/:id/check-in", authCheck, checkIn); //ใช้ PUT และรวมเข้ากับ bookings

// 🔹 Check-out ให้ลูกค้า
router.put("/bookings/:id/check-out", authCheck, checkOut); //ใช้ PUT และรวมเข้ากับ bookings

module.exports = router
