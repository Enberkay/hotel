const express = require("express")
const router = express.Router()

const { getProfile, updateProfile } = require("../controllers/profile")

const { authCheck } = require("../middlewares/authCheck")

router.get("/profile", authCheck, getProfile)
router.put("/profile", authCheck, updateProfile)


module.exports = router