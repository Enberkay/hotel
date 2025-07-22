const jwt = require("jsonwebtoken")
const prisma = require("../config/prisma")

exports.authCheck = async (req, res, next) => {
    try {
        const headerToken = req.headers.authorization;

        if (!headerToken) {
            return res.status(401).json({ message: "No Token, Authorization required" });
        }

        const token = headerToken.split(" ")[1];
        const decode = jwt.verify(token, process.env.SECRET);
        req.user = decode;

        // ตรวจสอบ user จาก phone (primary login field)
        const user = await prisma.user.findFirst({
            where: {
                phone: req.user.phone
            }
        });

        if (!user) {
            return res.status(403).json({ message: "This account cannot access." });
        }

        next();
    } catch (error) {
        console.error("Auth error:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }

        return res.status(401).json({ message: "Invalid token" });
    }
};

// Middleware สำหรับตรวจสอบ front (พนักงานหน้าฟร้อน)
exports.frontCheck = async (req, res, next) => {
    try {
        const { phone, role } = req.user
        const frontUser = await prisma.user.findFirst({
            where: {
                phone: phone
            }
        })
        if (role === "admin") {
            return next()
        }
        if (!frontUser || frontUser.role !== "front") {
            return res.status(403).json({ message: "Access Denied: Front only." })
        }
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error, Front access denied." })
    }
}

// Middleware สำหรับตรวจสอบ housekeeping
exports.housekeepingCheck = async (req, res, next) => {
    try {
        const { phone, role } = req.user
        const housekeepingUser = await prisma.user.findFirst({
            where: {
                phone: phone
            }
        })
        if (role === "admin") {
            return next();
        }
        if (!housekeepingUser || housekeepingUser.role !== "housekeeping") {
            return res.status(403).json({ message: "Access Denied: Housekeeping only." })
        }
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error, Housekeeping access denied." })
    }
}

// Middleware สำหรับตรวจสอบ admin
exports.adminCheck = async (req, res, next) => {
    try {
        const { phone } = req.user
        const adminUser = await prisma.user.findFirst({
            where: {
                phone: phone
            }
        })
        if (!adminUser || adminUser.role !== "admin") {
            return res.status(403).json({ message: "Access Denied: Admin only." })
        }
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error, Admin access denied." })
    }
}