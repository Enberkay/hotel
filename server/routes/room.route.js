const express = require("express")
const router = express.Router()

//import controller...
const { create, read, list, update, remove, groupRoom, unGroupRoom } = require("../controllers/room.controller")
const { changeStatusRoom } = require("../controllers/changeStatusRoom.controller")

const { authCheck } = require("../middlewares/authCheck")
const { z } = require('zod');
const validateWithZod = require('../middlewares/validateWithZod');

const roomCreateSchema = z.object({
  roomNumber: z.string().min(1),
  roomType: z.enum(['SINGLE', 'DOUBLE', 'SIGNATURE']),
  roomStatus: z.string().min(1),
  floor: z.string().min(1)
});

// เพิ่มห้อง (Create Room)
router.post("/rooms", authCheck, validateWithZod(roomCreateSchema), create)

// ดูห้องทั้งหมด (List Rooms)
router.get("/rooms", authCheck, list)

// ดูรายละเอียดห้อง (Read Room)
router.get("/rooms/:roomNumber", authCheck, read)

// อัปเดตห้อง (Update Room)
router.put("/rooms/:roomNumber", authCheck, update)

// ลบห้อง (Remove Room)
router.delete("/rooms/:roomNumber", authCheck, remove)

// รวม 2 ห้องเป็น Signature Room
router.post("/rooms/group", authCheck, groupRoom)

// แยกห้อง Signature
router.post("/rooms/ungroup", authCheck, unGroupRoom)

// เปลี่ยนสถานะห้อง
router.put("/rooms/status", authCheck, changeStatusRoom)

module.exports = router