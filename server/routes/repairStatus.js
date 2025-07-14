const express = require("express")
const router = express.Router()


const { create, list } = require("../controllers/repairStatus")

const { authCheck } = require("../middlewares/authCheck")

// 🔹 สร้างสถานะห้องที่ได้รับการซ่อม (Create Repair Status)
router.post("/repair-statuses", authCheck, create)

// 🔹 แสดงรายการสถานะห้องที่ได้รับการซ่อม (List Repair Statuses)
router.get("/repair-statuses", authCheck, list)


module.exports = router