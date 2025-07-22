const express = require("express");
const router = express.Router();

const {
  createBooking,
  listBookings,
  readBooking,
  confirmBooking,
} = require("../controllers/booking.controller");
const {
  checkIn,
  checkOut,
  cancelBooking,
} = require("../controllers/bookingStatus.controller");

const { authCheck, frontCheck } = require("../middlewares/authCheck");
const { z } = require("zod");
const validateWithZod = require("../middlewares/validateWithZod");

const bookingCreateSchema = z.object({
  count: z.preprocess((val) => Number(val), z.number().min(1)),
  roomType: z.enum(["SINGLE", "DOUBLE", "SIGNATURE"]),
  checkInDate: z.string().min(1),
  checkOutDate: z.string().min(1),
  addon: z
    .array(
      z.object({
        addonId: z.number(),
        quantity: z.number(),
      })
    )
    .optional(),
});

// สร้าง Booking (ลูกค้าจองห้อง)
router.post(
  "/bookings",
  authCheck,
  validateWithZod(bookingCreateSchema),
  createBooking
);

// แสดงรายการ Booking ทั้งหมด
router.get("/bookings", authCheck, listBookings);

// ดูรายละเอียด Booking ตาม ID
router.get("/bookings/:id", authCheck, readBooking);

// ยืนยัน Booking (Front)
router.put("/bookings/:id/confirm", authCheck, frontCheck, confirmBooking);

// Check-in
router.put("/bookings/:id/checkin", authCheck, frontCheck, checkIn);

// Check-out
router.put("/bookings/:id/checkout", authCheck, frontCheck, checkOut);

// Cancel Booking
router.put("/bookings/:id/cancel", authCheck, frontCheck, cancelBooking);

module.exports = router;
