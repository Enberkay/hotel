
const prisma = require("../config/prisma")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const path = require("path");

exports.register = async (req, res) => {
    try {
        const { userEmail, userPassword, userName, userSurName, userNumPhone, prefix, licensePlate } = req.body
        console.log(images)
        // Step 1 Validate body, DO NOT EMPTY
        if (!userEmail) {
            return res.status(400).json({ message: 'Email is required!!!' })
        }

        if (!userPassword) {
            return res.status(400).json({ message: 'Password is required!!!' })
        }

        // if (!userName || !userSurName) {
        //     return res.status(400).json({ message: 'Full name is required!!!' })
        // }

        // Step 2 Check Email in DB already ?
        const user = await prisma.user.findFirst({
            where: {
                userEmail: userEmail
            }
        })

        if (user) {
            return res.status(400).json({ message: "อีเมลล์นี้ถูกใช้แล้ว" })
        }

        //check Number Phone is DB already?
        const userNum = await prisma.user.findFirst({
            where: {
                userNumPhone: userNumPhone
            }
        })

        if (userNum) {
            return res.status(400).json({ message: "เบอร์นี้ถูกใช้แล้ว" })
        }

        // Step 3 HashPassword
        const hashPassword = await bcrypt.hash(userPassword, 10)

        // Step 4 Register User
        const newUser = await prisma.user.create({
            data: {
                userEmail: userEmail,
                userPassword: hashPassword,
                // userRole: userRole,  //test admin
                userName: userName,
                userSurName: userSurName,
                userNumPhone: userNumPhone,
                prefix: prefix,
                licensePlate: licensePlate
            }
        })

        // test admin
        // if (newUser.userRole === "admin") {
        //     return res.json("admin for tset")
        // }

        console.log(newUser)
        res.json({ message: "Register success!!." })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Auth controller register error" })
    }
}

exports.createImages = async (req, res) => {
    try {
        // Multer จะเพิ่ม req.file เข้ามา
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        // ตัวอย่างการบันทึกข้อมูลไฟล์ลง DB (หรือจะส่งกลับ client อย่างเดียวก็ได้)
        // สมมติว่า images table มี field: asset_id, public_id, url, secure_url
        // ในที่นี้จะใช้ filename เป็น asset_id/public_id และ path เป็น url
        const fileUrl = `/uploads/${req.file.filename}`; // สมมติเปิด static /uploads
        const imageData = {
            asset_id: req.file.filename,
            public_id: req.file.filename,
            url: fileUrl,
            secure_url: fileUrl
        };
        // ถ้าต้องการบันทึกลง DB:
        // await prisma.image.create({ data: imageData });
        res.json(imageData);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.removeImage = async (req, res) => {
    try {
        const { filename } = req.body; // รับชื่อไฟล์ที่ต้องการลบ
        if (!filename) {
            return res.status(400).json({ message: "No filename provided" });
        }
        const fs = require("fs");
        const filePath = path.join(__dirname, "../uploads", filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Failed to delete file" });
            }
            res.json({ message: "ลบรูปแล้ว!!!.." });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
};


exports.login = async (req, res) => {
    try {

        const { userEmail, userPassword } = req.body

        // Step 1 Check Email
        const user = await prisma.user.findFirst({
            where: {
                userEmail: userEmail
            }
        })
        if (!user) {
            return res.status(400).json({ message: "ไม่พบบัญชีนี้" })
        }

        // Step 2 Check password
        const isMatch = await bcrypt.compare(userPassword, user.userPassword)
        if (!isMatch) {
            return res.status(400).json({ message: "อีเมลล์ และ รหัสผ่านไม่ถูกต้อง" })
        }

        // Step 3 create Payload
        const payload = {
            userId: user.userId,
            userEmail: user.userEmail,
            userRole: user.userRole
        }

        // Step 4 Generate Token
        jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) {
                return res.status(500).json({ message: "Server Error" })
            }
            res.json({ payload, token })

        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server Error" })
    }
}

exports.currentUser = async (req, res) => {
    try {
        //code
        const user = await prisma.user.findFirst({
            where: { userEmail: req.user.userEmail },
            select: {
                userId: true,
                userEmail: true,
                userName: true,
                userRole: true
            }
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user })
    } catch (err) {
        //errs
        console.log(err)
        return res.status(500).json({ message: "Server Error" })
    }
}