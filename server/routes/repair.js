const express = require("express")
const router = express.Router()

const { repairRequest, listRepairRequest, readRepairRequest, noteRepairRequest, repairReport } = require("../controllers/repair")

const { authCheck } = require("../middlewares/authCheck")

router.post("/repair-requests", authCheck, repairRequest)

router.get("/repair-requests", authCheck, listRepairRequest)

router.get("/repair-requests/:id", authCheck, readRepairRequest)

router.put("/repair-requests", authCheck, noteRepairRequest)

router.post("/repair-reports", authCheck, repairReport)

module.exports = router