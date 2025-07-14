const prisma = require("../config/prisma")

exports.getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                userEmail: req.user.userEmail
            },
            select: {
                userId: true,
                userEmail: true,
                prefix: true,
                userName: true,
                userSurName: true,
                userNumPhone: true,
                licensePlate: true,
                Customer: {
                    select: {
                        stdId: true,
                        idCard: true,
                        customerType: {
                            select: {
                                customerTypeId: true,
                                customerTypeName: true,
                                discount: true
                            }
                        },
                        images: true
                    }

                },
                Front: true
            }
        })

        if (!user) return res.status(404).json({ message: "User not found" })

        res.json(user)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { prefix, userName, userSurName, userNumPhone } = req.body
        console.log(prefix, userName, userSurName, userNumPhone)

        // ตรวจสอบว่าหมายเลขโทรศัพท์ซ้ำหรือไม่
        const existingUser = await prisma.user.findFirst({
            where: {
                userNumPhone,
                NOT: {
                    userEmail: req.user.userEmail
                }
            }
        })

        if (existingUser) {
            return res.status(400).json({ message: "Phone number already in use" })
        }
        const updatedUser = await prisma.user.update({
            where: { userEmail: req.user.userEmail },
            data: {
                prefix,
                userName,
                userSurName,
                userNumPhone
            }
        })

        res.json(updatedUser)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

