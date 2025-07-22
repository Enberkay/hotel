const express = require("express");
const router = express.Router();

//import controller...
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/admin.controller");

//middleware
const { authCheck, adminCheck } = require("../middlewares/authCheck");

router.post("/users", authCheck, adminCheck, createUser);
router.get("/users", authCheck, adminCheck, getAllUsers);
router.get("/users/:id", authCheck, adminCheck, getUserById);
router.put("/users/:id", authCheck, adminCheck, updateUserById);
router.delete("/users/:id", authCheck, adminCheck, deleteUserById);

module.exports = router;
