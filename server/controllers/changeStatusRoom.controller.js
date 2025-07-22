const prisma = require("../config/prisma")
const logger = require('../utils/logger');
const { z } = require('zod');

const validStatuses = ["AVAILABLE", "OCCUPIED", "RESERVED", "CLEANING", "MAINTENANCE"];
const changeStatusSchema = z.object({
    roomIds: z.array(z.string()).min(1, "ต้องระบุห้องอย่างน้อย 1 ห้อง"),
    roomStatus: z.enum(validStatuses)
});

exports.changeStatusRoom = async (req, res) => {
    try {
        const parseResult = changeStatusSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ message: parseResult.error.errors.map(e => e.message).join(", ") });
        }
        const { roomIds, roomStatus } = parseResult.data;
        logger.info('Change room status: roomIds=%o, roomStatus=%s', roomIds, roomStatus);
        console.log(roomIds)

        // ค้นหาห้องทั้งหมดที่มี roomId ในลิสต์
        const rooms = await prisma.room.findMany({
            where: { roomNumber: { in: roomIds } }
        });

        if (rooms.length === 0) {
            return res.status(404).json({ message: "ไม่พบข้อมูลห้องที่ต้องการอัปเดต" });
        }

        // อัปเดตสถานะของทุกห้องที่พบ
        const updatedRooms = await prisma.room.updateMany({
            where: { roomNumber: { in: roomIds } },
            data: { roomStatus }
        });

        res.json({
            message: `อัปเดตสถานะห้องสำเร็จ`,
            updatedCount: updatedRooms.count,
            updatedRooms: rooms.map(room => ({
                roomId: room.roomId,
                roomNumber: room.roomNumber
            }))
        });

    } catch (err) {
        logger.error('Change room status error: %s', err.stack || err.message);
        res.status(500).json({ message: "Server error" });
    }
};