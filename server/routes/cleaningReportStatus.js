const express = require("express")
const router = express.Router()

const { create, list } = require("../controllers/cleaningReportStatus")

const { authCheck } = require("../middlewares/authCheck")


router.post("/cleaning-report-statuses", authCheck, create)

router.get("/cleaning-report-statuses", authCheck, list)


module.exports = router