const prisma = require("../config/prisma")

exports.create = async (req, res) => {
    try {
        const { roomTypeName, price, name_en, name_th } = req.body;
        const roomType = await prisma.roomType.create({
            data: {
                roomTypeName: roomTypeName || name_th || name_en,
                name_en: name_en || roomTypeName,
                name_th: name_th || roomTypeName,
                price: Number(price)
            }
        })
        res.json(roomType)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}
exports.list = async (req, res) => {
    try {
        const roomType = await prisma.roomType.findMany()
        res.json(roomType)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.read = async (req, res) => {
    try {
        const { id } = req.params
        const roomType = await prisma.roomType.findFirst({
            where: {
                roomTypeId: Number(id)
            }
        })
        res.json(roomType)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.update = async (req, res) => {
    try {
        const { roomTypeName, price, name_en, name_th } = req.body;
        const roomTypeId = Number(req.params.id)

        if ((!roomTypeName && !name_en && !name_th) || !price) {
            return res.status(400).json({ message: "ไม่มีข้อมูลที่ต้องการ" })
        }

        const roomTypeUpdated = await prisma.roomType.update({
            where: {
                roomTypeId: roomTypeId
            },
            data: {
                roomTypeName: roomTypeName || name_th || name_en,
                name_en: name_en || roomTypeName,
                name_th: name_th || roomTypeName,
                price: price
            }
        })
        res.json(roomTypeUpdated)

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })

    }
}

exports.remove = async (req, res) => {
    try {
        const { id } = req.params
        const roomType = await prisma.roomType.delete({
            where: {
                roomTypeId: Number(id)
            }
        })
        res.json(roomType)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}
