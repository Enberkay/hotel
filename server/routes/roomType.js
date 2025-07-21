const express = require("express")
const router = express.Router()

const { create, list, remove, update, read } = require("../controllers/roomType")

const { authCheck } = require("../middlewares/authCheck")

// เพิ่ม ประเภทห้อง

// เพิ่มประเภทห้อง (Create Room Type)
router.post("/room-types", authCheck, create)

// ดูประเภทห้องทั้งหมด (List Room Types)
router.get("/room-types", authCheck, list)

// ดูรายละเอียดประเภทห้องตาม ID (Get Room Type by ID)
router.get("/room-types/:id", authCheck, read)

// อัปเดตประเภทห้อง (Update Room Type)
router.put("/room-types/:id", authCheck, update)

// ลบประเภทห้อง (Delete Room Type)
router.delete("/room-types/:id", authCheck, remove)


module.exports = router