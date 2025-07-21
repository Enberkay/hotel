const express = require("express")
const router = express.Router()

//import controller...
const { create, read, list, update, remove, groupRoom, unGroupRoom } = require("../controllers/room")
const { changeStatusRoom } = require("../controllers/changeStatusRoom")

const { authCheck } = require("../middlewares/authCheck")
const { z } = require('zod');
const validateWithZod = require('../middlewares/validateWithZod');

const roomCreateSchema = z.array(z.object({
  roomNumber: z.string().min(1),
  roomTypeId: z.number(),
  roomStatusId: z.number(),
  floor: z.number()
}));

//@ENDPOINT http://localhost:8000/api

//เพิ่มห้อง (Create Room)
router.post("/rooms", validateWithZod(roomCreateSchema), create)

//ดูห้องทั้งหมด (List Rooms)
router.get("/rooms", authCheck, list)

//ดูรายละเอียดห้องตาม ID (Get Room by ID)
router.get("/rooms/:id", authCheck, read)

//อัปเดตห้อง (Update Room)
router.put("/rooms/:id", authCheck, update)

//ลบห้อง (Delete Room)
router.delete("/rooms/:id", authCheck, remove)

//อัปเดตสถานะห้อง (Change Room Status)
router.post("/rooms-status", authCheck, changeStatusRoom)

//จัดกลุ่มห้อง (Group Rooms)
router.post("/rooms/group", authCheck, groupRoom)

//ยกเลิกการจัดกลุ่มห้อง (Ungroup Rooms)
router.post("/rooms/ungroup", authCheck, unGroupRoom)

module.exports = router