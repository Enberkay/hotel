const prisma = require("../config/prisma")

exports.create = async (req, res) => {
    try {
        const { addonName, price, addonName_en, addonName_th } = req.validated || req.body;
        console.log(addonName, price, addonName_en, addonName_th)

        const addon = await prisma.addon.create({
            data: {
                addonName: addonName || addonName_th || addonName_en,
                addonName_en: addonName_en || addonName,
                addonName_th: addonName_th || addonName,
                price: Number(price)
            }
        })
        res.json(addon)

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}
exports.list = async (req, res) => {
    try {
        const addon = await prisma.addon.findMany()
        res.json(addon)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.read = async (req, res) => {
    try {
        const { id } = req.params
        const addon = await prisma.addon.findFirst({
            where: {
                addonId: Number(id)
            }
        })

        res.json(addon)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.update = async (req, res) => {
    try {
        const { addonName, price, addonName_en, addonName_th } = req.body
        const addonId = Number(req.params.id)

        if ((!addonName && !addonName_en && !addonName_th) || !price) {
            return res.status(400).json({ message: "ไม่มีค่าที่ส่งมา" })
        }

        const existingAddon = await prisma.addon.findFirst({
            where: {
                addonId: addonId
            }
        })

        if (!existingAddon) {
            return res.status(404).json({ message: "ไม่มีค่าที่จะแก้ไข" })
        }

        const addonUpdated = await prisma.addon.update({
            where: {
                addonId: addonId
            },
            data: {
                addonName: addonName || addonName_th || addonName_en,
                addonName_en: addonName_en || addonName,
                addonName_th: addonName_th || addonName,
                price: Number(price)
            }
        })

        res.json(addonUpdated)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.remove = async (req, res) => {
    try {
        const { id } = req.params
        const addon = await prisma.addon.delete({
            where: {
                addonId: Number(id)
            }
        })
        res.json(addon)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}