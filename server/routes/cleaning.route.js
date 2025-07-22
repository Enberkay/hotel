const express = require("express");
const router = express.Router();

const {
  cleaningRequest,
  listCleaningRequest,
  readCleaningRequest,
  cleaningReport,
  listCleaningReport,
  readCleaningReport,
  allListCleaningReport,
  noteReport,
  noteRequest,
} = require("../controllers/cleaning.controller");

const { authCheck, frontCheck, housekeepingCheck } = require("../middlewares/authCheck");
const { z } = require("zod");
const validateWithZod = require("../middlewares/validateWithZod");

const cleaningRequestSchema = z.object({
  rooms: z.array(
    z.object({
      roomNumber: z.string(),
      description: z.string().optional(),
    })
  ),
});

// สร้างใบแจ้งทำความสะอาด (Create Cleaning Request)
router.post(
  "/cleaning-requests",
  authCheck,
  frontCheck,
  validateWithZod(cleaningRequestSchema),
  cleaningRequest
);

// แสดงรายการใบแจ้งทำความสะอาดทั้งหมด (List Cleaning Requests)
router.get("/cleaning-requests", authCheck, listCleaningRequest);

// ดูรายละเอียดใบแจ้งทำความสะอาดตาม ID (Get Cleaning Request by ID)
router.get("/cleaning-requests/:id", authCheck, readCleaningRequest);

// สร้างรายงานผลทำความสะอาด (Create Cleaning Report)
router.post("/cleaning-reports", authCheck, housekeepingCheck, cleaningReport);

// แสดงรายการรายงานผลทำความสะอาด (List Cleaning Reports)
router.get("/cleaning-reports", authCheck, housekeepingCheck, listCleaningReport);

// ดูรายละเอียดรายงานผลทำความสะอาดตาม ID (Get Cleaning Report by ID)
router.get("/cleaning-reports/:id", authCheck, housekeepingCheck, readCleaningReport);

// แสดงรายการรายงานผลทำความสะอาดทั้งหมด (All Cleaning Reports)
router.get("/cleaning-reports-all", authCheck, allListCleaningReport);

// ตรวจสอบ/โน้ตใบรายงานผล (Note Report)
router.put("/cleaning-reports/:id/note", authCheck, noteReport);

// ตรวจสอบ/โน้ตใบแจ้งทำความสะอาด (Note Request)
router.put("/cleaning-requests/:id/note", authCheck, noteRequest);

module.exports = router;
