const express = require("express")
const router = express.Router()

const { create, list } = require("../controllers/paymentStatus")

const { authCheck } = require("../middlewares/authCheck")

// 🔹 เพิ่มสถานะการชำระเงิน (Create Payment Status)
router.post("/payment-statuses", authCheck, create)

// 🔹 ดูสถานะการชำระเงินทั้งหมด (List Payment Statuses)
router.get("/payment-statuses", authCheck, list)



module.exports = router