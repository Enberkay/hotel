const express = require("express")
const router = express.Router()

const { getProfile, updateProfile } = require("../controllers/profile")

const { authCheck } = require("../middlewares/authCheck")
const { z } = require('zod');
const validateWithZod = require('../middlewares/validateWithZod');

const updateProfileSchema = z.object({
  prefix: z.string().optional(),
  userName: z.string().min(1),
  userSurName: z.string().min(1),
  userNumPhone: z.string().min(8)
});

router.get("/profile", authCheck, getProfile)
router.put("/profile", authCheck, validateWithZod(updateProfileSchema), updateProfile)


module.exports = router