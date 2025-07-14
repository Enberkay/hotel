const prisma = require("../config/prisma")

exports.create = async (req, res) => {
    try {
        const { customerTypeName, discount } = req.body
        const customerType = await prisma.customerType.create({
            data: {
                customerTypeName: customerTypeName,
                discount: Number(discount)
            }
        })

        res.json(customerType)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.list = async (req, res) => {
    try {
        const customerType = await prisma.customerType.findMany()
        res.json(customerType)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.read = async (req, res) => {
    try {
        const { id } = req.params
        const customerType = await prisma.customerType.findFirst({
            where: {
                customerTypeId: Number(id)
            }
        })
        res.json(customerType)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.update = async (req, res) => {
    try {
        const { customerTypeName, discount } = req.body
        const customerTypeId = Number(req.params.id)

        if (!customerTypeName || !discount) {
            return res.status(400).json({ message: "ไม่มีข้อมูล"})
        }

        const customerTypeUpdated = await prisma.customerType.update({
            where: {
                customerTypeId: customerTypeId
            },
            data: {
                customerTypeName: customerTypeName,
                discount: Number(discount)
            }
        })

        res.json(customerTypeUpdated)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.remove = async (req, res) => {
    try {
        const { id } = req.params
        const customerType = await prisma.customerType.delete({
            where: {
                customerTypeId: Number(id)
            }
        })
        res.json(customerType)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}