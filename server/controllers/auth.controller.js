
const prisma = require("../config/prisma")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

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
            where: { userId: req.user.userId },
            select: {
                userId: true,
                userName: true,
                userPhone: true,
                userRole: true,
                licensePlate: true
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

// Register default admin from ENV or fallback
exports.registerDefaultAdmin = async (req, res) => {
    try {
        const userEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@admin.com';
        const userPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin1234';
        const userName = 'Admin';
        const userSurName = 'System';
        const userNumPhone = '0000000000';
        const prefix = 'Mr.';
        const licensePlate = '';

        const { secret } = req.body;
        if (secret !== process.env.DEFAULT_ADMIN_SECRET) {
            return res.status(403).json({ message: "Forbidden: Invalid secret" });
        }

        // Check if admin already exists
        const user = await prisma.user.findFirst({ where: { userEmail } });
        if (user) {
            return res.status(400).json({ message: 'Default admin already exists.' });
        }

        const hashPassword = await bcrypt.hash(userPassword, 10);
        const newUser = await prisma.user.create({
            data: {
                userEmail,
                userPassword: hashPassword,
                userRole: 'admin',
                userName,
                userSurName,
                userNumPhone,
                prefix,
                licensePlate
            }
        });
        res.json({ message: 'Default admin created successfully.', userEmail, password: userPassword });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'registerDefaultAdmin error' });
    }
}