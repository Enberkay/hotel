const express = require("express")
const router = express.Router()

const {
    cleaningRequest,
    listCleaningRequest,
    readCleaningRequest,
    cleaningReport,
    listCleaningReport,
    readCleaningReport,
    allListCleaningReport,
    noteReport,
    noteRequest
} = require("../controllers/cleaning.controller")

const { authCheck, frontCheck } = require("../middlewares/authCheck")
const { z } = require('zod');
const validateWithZod = require('../middlewares/validateWithZod');

const cleaningRequestSchema = z.object({
  rooms: z.array(z.object({
    roomId: z.number(),
    note: z.string().optional()
  }))
});

// 🔹 สร้างใบแจ้งทำความสะอาด (Create Cleaning Request)
router.post("/cleaning-requests", authCheck, frontCheck, validateWithZod(cleaningRequestSchema), cleaningRequest)

// 🔹 แสดงรายการใบแจ้งทำความสะอาดทั้งหมด (List Cleaning Requests)
router.get("/cleaning-requests", authCheck, listCleaningRequest)

// 🔹 ดูรายละเอียดใบแจ้งทำความสะอาดตาม ID (Get Cleaning Request by ID)
router.get("/cleaning-requests/:id", authCheck, readCleaningRequest)

// 🔹 รายงานผลทำความสะอาด(สร้างใบรายงานผล)
router.post("/cleaning-reports", authCheck, cleaningReport)

// 🔹 แสดงใบรายงานผลทำความสะอาด (List Cleaning Reports with Pagination)
router.get("/cleaning-reports", authCheck, listCleaningReport)

// 🔹 ดูรายละเอียดใบรายงานผลทำความสะอาดตาม ID
router.get("/cleaning-report/:id", authCheck, readCleaningReport)

// 🔹 สำหรับ Front
router.get("/all-cleaning-reports", authCheck, allListCleaningReport)

// 🔹 front รับทราบใบรายงานการทำความสะอาด
router.put("/cleaning-report-noted", authCheck, noteReport)

// 🔹 แม่บ้านรับทราบใบแจ้งทำความสะอาด
router.put("/cleaning-request-noted", authCheck, noteRequest)

module.exports = router