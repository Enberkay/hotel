const prisma = require("../config/prisma")

exports.create = async (req, res) => {
    try {

        const { roomStatusName } = req.body
        const roomStatus = await prisma.roomStatus.create({
            data: {
                roomStatusName: roomStatusName
            }
        })

        res.json(roomStatus)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}
exports.list = async (req, res) => {
    try {
        const roomStatus = await prisma.roomStatus.findMany()
        res.json(roomStatus)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}