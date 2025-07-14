const express = require("express")
const router = express.Router()

const { create, list, read, update, remove } = require("../controllers/cleaningListItem")

const { authCheck } = require("../middlewares/authCheck")

router.post("/cleaning-list-item", authCheck, create)  // ✅ สร้างข้อมูล (Create)
router.get("/cleaning-list-item", authCheck, list)     // ✅ ดึงข้อมูลทั้งหมด (Read - List)
router.get("/cleaning-list-item/:id", authCheck, read) // ✅ ดึงข้อมูลเฉพาะรายการ (Read - One)
router.put("/cleaning-list-item/:id", authCheck, update) // ✅ อัปเดตข้อมูล (Update)
router.delete("/cleaning-list-item/:id", authCheck, remove) // ❌ เปลี่ยนจาก PUT เป็น DELETE

module.exports = router