const jwt = require("jsonwebtoken")
const prisma = require("../config/prisma")

// exports.authCheck = async (req, res, next) => {
//     try {

//         const headerToken = req.headers.authorization
//         // console.log("Token Header:", headerToken)

//         if (!headerToken) {
//             return res.status(401).json({ message: "no Token, Authorization" })
//         }
//         const token = headerToken.split(" ")[1]
//         const decode = jwt.verify(token, process.env.SECRET)
//         req.user = decode

//         const user = await prisma.user.findFirst({
//             where: {
//                 userEmail: req.user.userEmail
//             }
//         })
//         if (!user.userEnable) {
//             return res.status(400).json({ message: "This account cannot access." })
//         }
//         next()
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ message: "Token invalid" })
//     }
// }

exports.authCheck = async (req, res, next) => {
    try {
        const headerToken = req.headers.authorization;

        if (!headerToken) {
            return res.status(401).json({ message: "No Token, Authorization required" });
        }

        const token = headerToken.split(" ")[1];
        const decode = jwt.verify(token, process.env.SECRET);
        req.user = decode;

        const user = await prisma.user.findFirst({
            where: {
                userEmail: req.user.userEmail
            }
        });

        if (!user || !user.userEnable) {
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


// Middleware สำหรับตรวจสอบ customer
exports.customerCheck = async (req, res, next) => {
    try {
        const { userEmail, userRole } = req.user
        // console.log(userEmail, userRole)

        const customerUser = await prisma.user.findFirst({
            where: {
                userEmail: userEmail
            }
        })

        // อนุญาตให้ admin ผ่าน
        if (userRole === "admin") {
            return next()
        }

        if (!customerUser || customerUser.userRole !== "customer") {
            return res.status(403).json({ message: "Access Denied: Customer only." })
        }

        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error, Customer access denied." })
    }
}

// Middleware สำหรับตรวจสอบ front (พนักงานหน้าฟร้อน)
exports.frontCheck = async (req, res, next) => {
    try {
        const { userEmail, userRole } = req.user

        const frontUser = await prisma.user.findFirst({
            where: {
                userEmail: userEmail
            }
        })

        // อนุญาตให้ admin ผ่าน
        if (userRole === "admin") {
            return next()
        }

        if (!frontUser || frontUser.userRole !== "front") {
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
        const { userEmail, userRole } = req.user

        const housekeepingUser = await prisma.user.findFirst({
            where: {
                userEmail: userEmail
            }
        })

        // อนุญาตให้ admin ผ่าน
        if (userRole === "admin") {
            return next();
        }

        if (!housekeepingUser || housekeepingUser.userRole !== "housekeeping") {
            return res.status(403).json({ message: "Access Denied: Housekeeping only." })
        }

        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error, Housekeeping access denied." })
    }
}

// Middleware สำหรับตรวจสอบ maintenance
exports.maintenanceCheck = async (req, res, next) => {
    try {
        const { userEmail, userRole } = req.user

        const maintenanceUser = await prisma.user.findFirst({
            where: {
                userEmail: userEmail
            }
        })

        // อนุญาตให้ admin ผ่าน
        if (userRole === "admin") {
            return next()
        }

        if (!maintenanceUser || maintenanceUser.userRole !== "maintenance") {
            return res.status(403).json({ message: "Access Denied: Maintenance only." })
        }

        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error, Maintenance access denied." })
    }
}

exports.adminCheck = async (req, res, next) => {
    try {
        const { userEmail } = req.user
        const adminUser = await prisma.user.findFirst({
            where: {
                userEmail: userEmail
            }
        })
        if (!adminUser || adminUser.userRole !== "admin") {
            return res.status(403).json({ message: "Access Denied: Admin only." })
        }


        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error, Admin access denied." })
    }
}