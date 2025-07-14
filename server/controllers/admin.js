const prisma = require("../config/prisma")
const bcrypt = require("bcryptjs")

// ✅ เพิ่มผู้ใช้ใหม่
exports.addUser = async (req, res) => {
    try {
        const { userEmail, userPassword, userName, userSurName, userRole, userNumPhone, assignedFloor } = req.body

        // ✅ ตรวจสอบค่าว่าง
        if (!userEmail || !userPassword || !userName || !userSurName || !userRole) {
            return res.status(400).json({ message: 'All fields are required!' })
        }

        // ✅ ตรวจสอบว่าอีเมลซ้ำหรือไม่
        const existingUser = await prisma.user.findUnique({ where: { userEmail } })
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists!" })
        }

        // ✅ เข้ารหัสรหัสผ่าน
        const hashPassword = await bcrypt.hash(userPassword, 10)

        // ✅ เพิ่มผู้ใช้
        const addUser = await prisma.user.create({
            data: {
                userEmail,
                userPassword: hashPassword,
                userRole,
                userName,
                userSurName,
                userNumPhone
            }
        })

        // ✅ กำหนดข้อมูลเพิ่มเติมตาม role
        let data;
        if (userRole === "front") {
            data = await prisma.front.create({ data: { userId: addUser.userId } })
        } else if (userRole === "housekeeping") {
            if (!assignedFloor) {
                return res.status(400).json({ message: "assignedFloor is required for housekeeping!" })
            }
            data = await prisma.housekeeping.create({
                data: { userId: addUser.userId, assignedFloor }
            })
        } else if (userRole === "maintenance") {
            data = await prisma.maintenance.create({ data: { userId: addUser.userId } })
        }

        console.log(addUser, data)
        res.json({ message: "User added successfully." })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

// ✅ ดึงข้อมูลผู้ใช้ทั้งหมด
exports.listUser = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                userId: true,
                userName: true,
                userSurName: true,
                userNumPhone: true,
                userEmail: true,
                userRole: true,
                userEnable: true,
                Housekeeping: { // ✅ ต้องใช้ตัวพิมพ์ใหญ่ให้ตรง schema
                    select: { assignedFloor: true }
                }
            }
        });

        // ✅ จัดโครงสร้างข้อมูลใหม่
        const formattedUsers = users.map(user => ({
            ...user,
            assignedFloor: user.userRole === "housekeeping" ? user.Housekeeping?.assignedFloor || null : null
        }));

        res.json(formattedUsers);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
};

// ✅ ดึงข้อมูลผู้ใช้จาก ID
exports.readUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });

        const user = await prisma.user.findUnique({
            where: { userId },
            select: {
                userEmail: true,
                userNumPhone: true,
                userName: true,
                userSurName: true,
                userRole: true,
                Housekeeping: { select: { assignedFloor: true } }
            }
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            ...user,
            assignedFloor: user.userRole === "housekeeping" ? user.Housekeeping?.assignedFloor || null : null
        });
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
};

// ✅ อัปเดตข้อมูลผู้ใช้
exports.updateUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });

        const { userName, userSurName, userEmail, userNumPhone } = req.body;
        if (!userName || !userSurName || !userEmail || !userNumPhone) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const user = await prisma.user.update({
            where: { userId },
            data: { userName, userSurName, userEmail, userNumPhone }
        });

        res.json({ message: "User updated successfully", user });
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
};

// ✅ ลบผู้ใช้
exports.deleteUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });

        // ✅ ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
        const existingUser = await prisma.user.findUnique({ where: { userId } });
        if (!existingUser) return res.status(404).json({ message: "User not found" });

        // ✅ ลบข้อมูลที่เกี่ยวข้องก่อน (ป้องกัน foreign key constraint error)
        await prisma.housekeeping.deleteMany({ where: { userId } });
        await prisma.maintenance.deleteMany({ where: { userId } });
        await prisma.front.deleteMany({ where: { userId } });

        // ✅ ลบผู้ใช้
        const deletedUser = await prisma.user.delete({ where: { userId } });

        res.json({ message: "User deleted successfully", deletedUser });
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
};
