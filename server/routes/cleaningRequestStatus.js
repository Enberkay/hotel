const express = require("express")
const router = express.Router()

const { create, list } = require("../controllers/cleaningRequestStatus")

const { authCheck } = require("../middlewares/authCheck")


// 🔹 สร้างสถานะใบแจ้งทำความสะอาด (Create Cleaning Request Status)
router.post("/cleaning-request-statuses", authCheck, create)

// 🔹 แสดงรายการสถานะใบแจ้งทำความสะอาดทั้งหมด (List Cleaning Request Statuses)
router.get("/cleaning-request-statuses", authCheck, list)




module.exports = router