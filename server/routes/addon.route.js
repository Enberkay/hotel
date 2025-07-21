const express = require("express")
const router = express.Router()

const { create, list, remove, read, update } = require("../controllers/addon.controller")
const { z } = require('zod');
const validateWithZod = require('../middlewares/validateWithZod');

const addonCreateSchema = z.object({
  addonName: z.string().min(1),
  price: z.number().min(0)
});

const { authCheck } = require("../middlewares/authCheck")

router.post("/addon", validateWithZod(addonCreateSchema), create);         // ✅ Create (POST /addons)
router.get("/addons", authCheck, list);           // ✅ Read all (GET /addons)
router.get("/addons/:id", read);                  // ✅ Read by ID (GET /addons/{id})
router.put("/addons/:id", update);                // ✅ Update by ID (PUT /addons/{id})
router.delete("/addons/:id", authCheck, remove);  // ✅ Delete by ID (DELETE /addons/{id})


module.exports = router