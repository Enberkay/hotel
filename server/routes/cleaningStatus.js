const express = require("express")
const router = express.Router()

const { create, list } = require("../controllers/cleaningStatus")

const { authCheck } = require("../middlewares/authCheck")

router.post("/cleaning-statuses", authCheck, create)

router.get("/cleaning-statuses", authCheck, list)

module.exports = router