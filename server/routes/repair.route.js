const express = require("express")
const router = express.Router()

const { repairRequest, listRepairRequest, readRepairRequest, noteRepairRequest, repairReport } = require("../controllers/repair.controller")

const { authCheck } = require("../middlewares/authCheck")
const { z } = require('zod');
const validateWithZod = require('../middlewares/validateWithZod');

const repairRequestSchema = z.object({
  reportIds: z.array(z.number()),
  rooms: z.array(z.object({
    roomId: z.number(),
    note: z.string().optional()
  }))
});

router.post("/repair-requests", authCheck, validateWithZod(repairRequestSchema), repairRequest)

router.get("/repair-requests", authCheck, listRepairRequest)

router.get("/repair-requests/:id", authCheck, readRepairRequest)

router.put("/repair-requests", authCheck, noteRepairRequest)

router.post("/repair-reports", authCheck, repairReport)

module.exports = router