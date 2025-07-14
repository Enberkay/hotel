const express = require("express")
const router = express.Router()

const { create, list } = require("../controllers/repairRequestStatus")

const { authCheck } = require("../middlewares/authCheck")

// 🔹 สร้างสถานะใบแจ้งซ่อม (Create Repair Request Status)
router.post("/repair-request-statuses", authCheck, create)

// 🔹 แสดงรายการสถานะใบแจ้งซ่อม (List Repair Request Statuses)
router.get("/repair-request-statuses", authCheck, list)

module.exports = router