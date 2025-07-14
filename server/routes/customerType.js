const express = require("express")
const router = express.Router()

const { create, list, remove, read, update } = require("../controllers/customerType")

const { authCheck } = require("../middlewares/authCheck")

// 🔹 เพิ่มประเภทลูกค้า (Create Customer Type)
router.post("/customer-types", authCheck, create)

// 🔹 ดูประเภทลูกค้าทั้งหมด (List Customer Types) 
// ❌ ไม่ควรมี authCheck เพราะต้องใช้ในหน้า Register
router.get("/customer-types", list)

// 🔹 ดูรายละเอียดประเภทลูกค้าตาม ID (Get Customer Type by ID)
router.get("/customer-types/:id", authCheck, read)

// 🔹 อัปเดตประเภทลูกค้า (Update Customer Type)
router.put("/customer-types/:id", authCheck, update)

// 🔹 ลบประเภทลูกค้า (Delete Customer Type)
router.delete("/customer-types/:id", authCheck, remove)




module.exports = router