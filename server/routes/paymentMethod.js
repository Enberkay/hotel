const express = require("express")
const router = express.Router()

const { create, list, remove, read, update } = require("../controllers/paymentMethod")

const { authCheck } = require("../middlewares/authCheck")

// 🔹 เพิ่มวิธีชำระเงิน (Create Payment Method)
router.post("/payment-methods", authCheck, create)

// 🔹 ดูวิธีชำระเงินทั้งหมด (List Payment Methods)
router.get("/payment-methods", authCheck, list)

// 🔹 ดูรายละเอียดวิธีชำระเงินตาม ID (Get Payment Method by ID)
router.get("/payment-methods/:id", authCheck, read)

// 🔹 อัปเดตวิธีชำระเงิน (Update Payment Method)
router.put("/payment-methods/:id", authCheck, update)

// 🔹 ลบวิธีชำระเงิน (Delete Payment Method)
router.delete("/payment-methods/:id", authCheck, remove)


module.exports = router