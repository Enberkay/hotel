const express = require("express");
const router = express.Router();

//import controller...
const {
  addUser,
  listUser,
  readUser,
  updateUser,
  deleteUser,
} = require("../controllers/admin.controller");

//middleware
const { authCheck, adminCheck } = require("../middlewares/authCheck");

router.post("/users", authCheck, adminCheck, addUser);
router.get("/users", authCheck, adminCheck, listUser);

router.get("/users/:id", authCheck, adminCheck, readUser);
router.put("/users/:id", authCheck, adminCheck, updateUser);

router.delete("/users/:id", authCheck, adminCheck, deleteUser);

module.exports = router;
