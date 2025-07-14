const prisma = require("../config/prisma")

exports.create = async (req, res) => {
    try {

        const { paymentStatusName } = req.body
        const paymentStatus = await prisma.paymentStatus.create({
            data: {
                paymentStatusName: paymentStatusName
            }
        })

        return res.json(paymentStatus)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.list = async (req, res) => {
    try {
        const paymentStatus = await prisma.paymentStatus.findMany()
        return res.json(paymentStatus)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}