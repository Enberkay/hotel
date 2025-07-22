const prisma = require("../config/prisma")

exports.create = async (req, res) => {
    try {
        const { itemName } = req.body

        const item = await prisma.cleaningList.create({
            data: {
                itemName: itemName
            }
        })
        res.json(item)

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.list = async (req, res) => {
    try {
        const item = await prisma.cleaningList.findMany()
        res.json(item)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.read = async (req, res) => {
    try {
        const { id } = req.params
        const item = await prisma.cleaningList.findUnique({
            where: {
                itemId: Number(id)
            }
        })
        if (!item) {
            return res.status(404).json({ message: "ไม่พบข้อมูล" })
        }
        res.json(item)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.update = async (req, res) => {
    try {
        const { itemName } = req.body
        const itemId = Number(req.params.id)

        if (!itemName) {
            return res.status(400).json({ message: "ไม่มีค่าที่ส่งมา" })
        }

        const existingItem = await prisma.cleaningList.findUnique({
            where: {
                itemId: itemId
            }
        })

        if (!existingItem) {
            return res.status(404).json({ message: "ไม่มีค่าที่จะแก้ไข" })
        }

        const itemUpdated = await prisma.cleaningList.update({
            where: {
                itemId: itemId
            },
            data: {
                itemName: itemName
            }
        })
        res.json(itemUpdated)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.remove = async (req, res) => {
    try {
        const { id } = req.params
        const item = await prisma.cleaningList.delete({
            where: {
                itemId: Number(id)
            }
        })
        res.json(item)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}