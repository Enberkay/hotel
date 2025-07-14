const prisma = require("../config/prisma")

exports.create = async (req, res) => {
    try {
        const { repairRequestStatusName } = req.body
        const repairRequestStatus = await prisma.repairRequestStatus.create({
            data: {
                repairRequestStatusName: repairRequestStatusName
            }
        })
        return res.json(repairRequestStatus)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.list = async (req, res) => {
    try {
        const repairRequestStatus = await prisma.repairRequestStatus.findMany()
        return res.json(repairRequestStatus)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}