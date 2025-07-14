const express = require("express")
const router = express.Router()

const { create, list, remove, read, update } = require("../controllers/addon")

const { authCheck } = require("../middlewares/authCheck")

router.post("/addons", authCheck, create);         // ✅ Create (POST /addons)
router.get("/addons", authCheck, list);           // ✅ Read all (GET /addons)
router.get("/addons/:id", read);                  // ✅ Read by ID (GET /addons/{id})
router.put("/addons/:id", update);                // ✅ Update by ID (PUT /addons/{id})
router.delete("/addons/:id", authCheck, remove);  // ✅ Delete by ID (DELETE /addons/{id})


module.exports = router