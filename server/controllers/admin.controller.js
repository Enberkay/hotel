const prisma = require("../config/prisma")
const logger = require('../utils/logger');

// สร้างผู้ใช้ใหม่
exports.createUser = async (req, res) => {
    try {
        const { name, phone, email, role, licensePlate } = req.body

        // ตรวจสอบค่าว่าง
        if (!name || !phone || !email || !role) {
            return res.status(400).json({ message: 'Name, phone, email, and role are required!' })
        }

        // ตรวจสอบว่า phone หรือ email ซ้ำหรือไม่
        const existingPhone = await prisma.user.findUnique({ where: { phone } })
        if (existingPhone) {
            return res.status(400).json({ message: "Phone already exists!" })
        }
        const existingEmail = await prisma.user.findUnique({ where: { email } })
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists!" })
        }

        // เพิ่มผู้ใช้
        const addUser = await prisma.user.create({
            data: {
                name,
                phone,
                email,
                role,
                licensePlate: licensePlate || null
            }
        })
        logger.info('User created: %o', addUser)
        res.json({ message: "User added successfully.", user: addUser })

    } catch (err) {
        logger.error('Create user error: %s', err.stack || err.message)
        res.status(500).json({ message: "Server error" })
    }
}

// ดึงข้อมูลผู้ใช้ทั้งหมด
exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { id: "desc" },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                role: true,
                licensePlate: true
            }
        });
        res.json(users);
    } catch (err) {
        logger.error('Get all users error: %s', err.stack || err.message)
        res.status(500).json({ message: "Server error" })
    }
};

// ดึงข้อมูลผู้ใช้จาก ID
exports.getUserById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: "Invalid user ID" });

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                role: true,
                licensePlate: true
            }
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        logger.error('Get user by id error: %s', err.stack || err.message)
        res.status(500).json({ message: "Server error" })
    }
};

// อัปเดตข้อมูลผู้ใช้
exports.updateUserById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: "Invalid user ID" });

        const { name, phone, email, role, licensePlate } = req.body;
        if (!name || !phone || !email || !role) {
            return res.status(400).json({ message: "Name, phone, email, and role are required!" });
        }

        // ตรวจสอบว่า phone หรือ email ซ้ำกับ user อื่นหรือไม่
        const existingPhone = await prisma.user.findUnique({ where: { phone } });
        if (existingPhone && existingPhone.id !== id) {
            return res.status(400).json({ message: "Phone already exists for another user!" });
        }
        const existingEmail = await prisma.user.findUnique({ where: { email } });
        if (existingEmail && existingEmail.id !== id) {
            return res.status(400).json({ message: "Email already exists for another user!" });
        }

        const user = await prisma.user.update({
            where: { id },
            data: { name, phone, email, role, licensePlate: licensePlate || null }
        });
        logger.info('User updated: %o', user)
        res.json({ message: "User updated successfully", user });
    } catch (err) {
        logger.error('Update user error: %s', err.stack || err.message)
        res.status(500).json({ message: "Server error" })
    }
};

// ลบผู้ใช้
exports.deleteUserById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: "Invalid user ID" });

        // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
        const existingUser = await prisma.user.findUnique({ where: { id } });
        if (!existingUser) return res.status(404).json({ message: "User not found" });

        // ลบผู้ใช้
        const deletedUser = await prisma.user.delete({ where: { id } });
        logger.info('User deleted: %o', deletedUser)
        res.json({ message: "User deleted successfully", deletedUser });
    } catch (err) {
        logger.error('Delete user error: %s', err.stack || err.message)
        res.status(500).json({ message: "Server error" })
    }
};
