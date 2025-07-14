const prisma = require("../config/prisma")

exports.create = async (req, res) => {
    try {
        const { paymentMethodName } = req.body
        const paymentMethod = await prisma.paymentMethod.create({
            data: {
                paymentMethodName: paymentMethodName
            }
        })
        res.json(paymentMethod)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.list = async (req, res) => {
    try {
        const paymentMethod = await prisma.paymentMethod.findMany()
        res.json(paymentMethod)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.read = async (req, res) => {
    try {
        const { id } = req.params
        const paymentMethod = await prisma.paymentMethod.findFirst({
            where: {
                paymentMethodId: Number(id)
            }
        })
        res.json(paymentMethod)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.update = async (req, res) => {
    try {
        const { paymentMethodName } = req.body
        const paymentMethodId = Number(req.params.id)

        if (!paymentMethodName) {
            return res.status(400).json({ message: "ไม่มีข้อมูล" })
        }

        const paymentMethodUpdated = await prisma.paymentMethod.update({
            where: {
                paymentMethodId: paymentMethodId
            },
            data: {
                paymentMethodName: paymentMethodName
            }
        })

        res.json(paymentMethodUpdated)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })

    }
}

exports.remove = async (req, res) => {
    try {

        const { id } = req.params
        const paymentMethod = await prisma.paymentMethod.delete({
            where: {
                paymentMethodId: Number(id)
            }
        })
        res.json(paymentMethod)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}