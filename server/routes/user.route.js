const express = require("express")
const router = express.Router()

//import controller...
const { myBookings, bookingDetail } = require("../controllers/user.controller")
const { CancelledBooking } = require("../controllers/cancel.controller")

//import middleware...
const { authCheck } = require("../middlewares/authCheck")

// 🔹 ดูประวัติการจองของตัวเอง
router.get("/mybookings", authCheck, myBookings)
router.get("/mybooking/:id", authCheck, bookingDetail)
router.put("/mybooking/cancel", authCheck, CancelledBooking)

module.exports = router