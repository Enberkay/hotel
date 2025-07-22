const express = require("express");
const router = express.Router();

const {
  create,
  list,
  read,
  update,
  remove,
} = require("../controllers/cleaningListItem.controller");

const { authCheck } = require("../middlewares/authCheck");

router.post("/cleaning-list-item", authCheck, create);
router.get("/cleaning-list-item", authCheck, list);
router.get("/cleaning-list-item/:id", authCheck, read);
router.put("/cleaning-list-item/:id", authCheck, update);
router.delete("/cleaning-list-item/:id", authCheck, remove);

module.exports = router;
