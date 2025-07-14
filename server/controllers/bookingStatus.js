const prisma = require("../config/prisma")

exports.create = async (req, res) => {
    try {

        const { bookingStatusName } = req.body
        const bookingStatus = await prisma.bookingStatus.create({
            data: {
                bookingStatusName: bookingStatusName
            }
        })

        res.json(bookingStatus)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}

exports.list = async (req, res) => {
    try {
        const bookingStatus = await prisma.bookingStatus.findMany()
        res.json(bookingStatus)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}