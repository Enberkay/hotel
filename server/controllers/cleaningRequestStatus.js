const prisma = require("../config/prisma")

exports.create = async (req, res) => {
    try {
        const { cleaningRequestStatusName } = req.body
        const cleaningRequestStatus = await prisma.cleaningRequestStatus.create({
            data: {
                cleaningRequestStatusName: cleaningRequestStatusName
            }
        })
        return res.json(cleaningRequestStatus)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.list = async (req, res) => {
    try {
        const cleaningRequestStatus = await prisma.cleaningRequestStatus.findMany()
        return res.json(cleaningRequestStatus)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}