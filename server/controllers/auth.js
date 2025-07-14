
const prisma = require("../config/prisma")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const cloudinary = require("cloudinary").v2

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUNDINARY_CLOUND_NAME,
    api_key: process.env.CLOUNDINARY_API_KEY,
    api_secret: process.env.CLOUNDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

exports.register = async (req, res) => {
    try {
        const { userEmail, userPassword, userName, userSurName, userNumPhone, prefix, licensePlate, images, customertypeId } = req.body
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

        const customer = await prisma.customer.create({
            data: {
                userId: newUser.userId,
                customerTypeId: Number(customertypeId),
                images: {
                    create: images.map((item) => ({
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url,
                        secure_url: item.secure_url
                    }))
                }
            }
        })

        console.log(newUser)
        console.log(customer)
        res.json({ message: "Register success!!." })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Auth controller register error" })
    }
}

exports.createImages = async (req, res) => {
    try {

        // console.log(req.body)
        // const { image } = req.body

        const result = await cloudinary.uploader.upload(req.body.image,
            {
                public_id: `Apiwat-${Date.now()}`,
                resource_type: "auto",
                folder: "Hotel2025"

            })
        res.send(result)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server Error" })
    }
}

exports.removeImage = async (req, res) => {
    try {

        const { public_id } = req.body
        // console.log(req.body.public_id)
        cloudinary.uploader.destroy(public_id, (result) => {

            res.json("ลบรูปแล้ว!!!..")
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server Error" })
    }
}



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