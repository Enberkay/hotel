const prisma = require("../config/prisma")

exports.create = async (req, res) => {
    try {
        const { repairStatusName } = req.body
        const repairStatus = await prisma.repairStatus.create({
            data: {
                repairStatusName: repairStatusName
            }
        })
        return res.json(repairStatus)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.list = async (req, res) => {
    try {
        const repairStatus = await prisma.repairStatus.findMany()
        return res.json(repairStatus)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}