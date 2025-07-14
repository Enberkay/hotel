const prisma = require("../config/prisma")

exports.create = async (req, res) => {
    try {
        const { cleaningStatusName } = req.body
        const cleaningStatus = await prisma.cleaningStatus.create({
            data: {
                cleaningStatusName: cleaningStatusName
            }
        })
        return res.json(cleaningStatus)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.list = async (req, res) => {
    try {
        const cleaningStatus = await prisma.cleaningStatus.findMany()
        return res.json(cleaningStatus)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}