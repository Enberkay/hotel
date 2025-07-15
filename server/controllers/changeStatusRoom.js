const prisma = require("../config/prisma")

exports.changeStatusRoom = async (req, res) => {
    try {
        const { roomIds, roomStatusId } = req.body;
        console.log(roomIds)

        if (!roomIds || !Array.isArray(roomIds) || roomIds.length === 0) {
            return res.status(400).json({ message: "กรุณาระบุห้องที่ต้องการอัปเดต" });
        }

        // ค้นหาห้องทั้งหมดที่มี roomId ในลิสต์
        const rooms = await prisma.room.findMany({
            where: { roomId: { in: roomIds.map(Number) } }
        });

        if (rooms.length === 0) {
            return res.status(404).json({ message: "ไม่พบข้อมูลห้องที่ต้องการอัปเดต" });
        }

        // อัปเดตสถานะของทุกห้องที่พบ
        const updatedRooms = await prisma.room.updateMany({
            where: { roomId: { in: roomIds.map(Number) } },
            data: { roomStatus: roomStatusId }
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
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};