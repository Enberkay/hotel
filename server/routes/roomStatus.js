const express = require("express")
const router = express.Router()

const { list, create } = require("../controllers/roomStatus")

const { authCheck } = require("../middlewares/authCheck")

// 🔹 เพิ่มสถานะห้อง (Create Room Status)
router.post("/room-statuses", authCheck, create)

// 🔹 ดูสถานะห้องทั้งหมด (List Room Statuses)
router.get("/room-statuses", authCheck, list)


module.exports = router