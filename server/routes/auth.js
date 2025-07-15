const express = require("express")
const router = express.Router()

const { register, login, currentUser, createImages, removeImage } = require("../controllers/auth")

const { adminCheck, authCheck, customerCheck, frontCheck, housekeepingCheck, maintenanceCheck } = require("../middlewares/authCheck")

const multer = require("multer");
const path = require("path");

// กำหนด storage สำหรับ multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

//@ENDPOINT http://localhost:8000/api/register
router.post("/register", register)
router.post("/login", login)

router.post("/images", upload.single("file"), createImages);
router.post("/removeimages", removeImage)

// router.post("/current-user", authCheck, currentUser)
router.post("/current-admin", authCheck, adminCheck, currentUser)

//permission all users
router.post("/current-customer", authCheck, customerCheck, currentUser)
router.post("/current-front", authCheck, frontCheck, currentUser)
router.post("/current-housekeeping", authCheck, housekeepingCheck, currentUser)
router.post("/current-maintenance", authCheck, maintenanceCheck, currentUser)

module.exports = router