const prisma = require("../config/prisma")

exports.create = async (req, res) => {
    try {
        const { cleaningReportStatusName } = req.body
        const cleaningReportStatus = await prisma.cleaningReportStatus.create({
            data: {
                cleaningReportStatusName: cleaningReportStatusName
            }
        })
        return res.json(cleaningReportStatus)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.list = async (req, res) => {
    try {
        const cleaningReportStatus = await prisma.cleaningReportStatus.findMany()
        return res.json(cleaningReportStatus)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}