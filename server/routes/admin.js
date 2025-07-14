const express = require("express")
const router = express.Router()

//import controller...
const { addUser, listUser, readUser, updateUser, deleteUser } = require("../controllers/admin")

//middleware
const { authCheck, adminCheck } = require("../middlewares/authCheck")

// 🔹 เพิ่มข้อมูลพนักงาน (front, housekeeping, maintenance)
router.post("/users", authCheck, adminCheck, addUser); // ✅ ใช้ "/users" แทน "/user"

// 🔹 ดูข้อมูลพนักงานทั้งหมด
router.get("/users", authCheck, adminCheck, listUser);

// 🔹 ดูข้อมูลพนักงานคนเดียว
router.get("/users/:id", authCheck, adminCheck, readUser); // ✅ ใช้ "/users/:id" แทน "/user/:id"

// 🔹 เปลี่ยนข้อมูลพนักงาน เช่น ชื่อ-นามสกุล
router.put("/users/:id", authCheck, adminCheck, updateUser);

// 🔹 ลบพนักงาน
router.delete("/users/:id", authCheck, adminCheck, deleteUser);


module.exports = router