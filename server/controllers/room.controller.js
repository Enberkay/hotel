const prisma = require("../config/prisma")
const logger = require('../utils/logger');

exports.create = async (req, res) => {
    try {
        const { roomNumber, roomType, roomStatus, floor, pairRoomNumber } = req.body

        const roomNum = await prisma.room.findUnique({
            where: {
                roomNumber: roomNumber
            }
        })

        if (roomNum) {
            console.log("Room already exists")
            return res.status(400).json({ message: "Room already exists!!" })
        }

        const room = await prisma.room.create({
            data: {
                roomNumber,
                floor,
                roomType,
                roomStatus,
                pairRoomNumber: pairRoomNumber || null
            }
        })

        res.json(room)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}

exports.list = async (req, res) => {
    try {
        const rooms = await prisma.room.findMany({
            orderBy: { createdAt: "asc" },
            select: {
                roomNumber: true,
                floor: true,
                roomType: true, // enum
                roomStatus: true,
                pairRoomNumber: true,
                createdAt: true
            }
        });
        res.json(rooms);
    } catch (err) {
        logger.error('List room error: %s', err.stack || err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.read = async (req, res) => {
    try {
        const { roomNumber } = req.params
        const room = await prisma.room.findUnique({
            where: {
                roomNumber: roomNumber
            }
        })
        if (!room) {
            return res.status(404).json({ message: "Room not found" })
        }
        res.json(room)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}

exports.update = async (req, res) => {
    try {
        const { roomType, roomStatus, floor, pairRoomNumber } = req.body;
        const { roomNumber } = req.params;

        // ค้นหาห้องที่มีเลขห้องเดียวกัน แต่ต้องไม่ใช่ห้องที่กำลังอัปเดต
        const existingRoom = await prisma.room.findFirst({
            where: {
                roomNumber: roomNumber,
            }
        });

        if (!existingRoom) {
            return res.status(404).json({ message: "Room not found" });
        }

        const room = await prisma.room.update({
            where: {
                roomNumber: roomNumber
            },
            data: {
                roomType,
                roomStatus,
                floor,
                pairRoomNumber: pairRoomNumber || null
            }
        });

        res.json(room);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.remove = async (req, res) => {
    try {
        const { roomNumber } = req.params
        const room = await prisma.room.findUnique({
            where: {
                roomNumber: roomNumber
            },
        })
        if (!room) {
            return res.status(404).json({ message: 'Room not found!!' })
        }

        await prisma.room.delete({
            where: {
                roomNumber: roomNumber
            }
        })

        res.send("remove room")
        logger.info('Remove room: roomNumber=%s', roomNumber);

    } catch (err) {
        logger.error('Remove room error: %s', err.stack || err.message);
        res.status(500).json({ message: "Server error" })
    }
}

// ฟังก์ชันรวม 2 ห้องเป็น Signature Room
exports.groupRoom = async (req, res) => {
    try {
        const { roomNumber1, roomNumber2 } = req.body;

        // ดึงข้อมูลห้องจาก roomNumber
        const rooms = await prisma.room.findMany({
            where: { roomNumber: { in: [roomNumber1, roomNumber2] } },
            select: { roomNumber: true, roomStatus: true, roomType: true, pairRoomNumber: true }
        });

        if (rooms.length !== 2) {
            return res.status(400).json({ message: "ไม่พบห้องที่ต้องการรวม" });
        }

        const [room1, room2] = rooms;

        // คู่ห้องที่สามารถรวมได้ (ใช้ roomNumber)
        const validRoomPairs = [
            ["315", "316"],
            ["415", "416"],
            ["515", "516"],
            ["615", "616"]
        ];

        // ตรวจสอบว่าห้องที่ขอรวมเป็นคู่ที่ถูกต้องหรือไม่
        const isValidPair = validRoomPairs.some(
            ([roomA, roomB]) =>
                (room1.roomNumber === roomA && room2.roomNumber === roomB) ||
                (room1.roomNumber === roomB && room2.roomNumber === roomA)
        );

        if (!isValidPair) {
            return res.status(400).json({ message: "ห้องนี้ไม่สามารถรวมได้" });
        }

        // ตรวจสอบว่าสถานะห้องเป็น "ว่าง" (roomStatus === 'AVAILABLE')
        if (room1.roomStatus !== 'AVAILABLE' || room2.roomStatus !== 'AVAILABLE') {
            return res.status(400).json({ message: "ห้องไม่ว่าง ไม่สามารถรวมได้" });
        }

        // อัปเดตสถานะของห้องให้เป็น "Signature" และเชื่อม pairRoomNumber
        await prisma.room.update({
            where: { roomNumber: room1.roomNumber },
            data: {
                roomType: 'SIGNATURE',
                pairRoomNumber: room2.roomNumber
            }
        });

        await prisma.room.update({
            where: { roomNumber: room2.roomNumber },
            data: {
                roomType: 'SIGNATURE',
                pairRoomNumber: room1.roomNumber
            }
        });

        return res.status(200).json({ message: "รวมสำเร็จ" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.unGroupRoom = async (req, res) => {
    try {
        const { roomNumber1, roomNumber2 } = req.body;

        // ดึงข้อมูลห้องจาก roomNumber
        const rooms = await prisma.room.findMany({
            where: { roomNumber: { in: [roomNumber1, roomNumber2] } },
            select: { roomNumber: true, roomStatus: true, roomType: true, pairRoomNumber: true }
        });

        if (rooms.length !== 2) {
            return res.status(400).json({ message: "ไม่พบห้องที่ต้องการแยก" });
        }

        const [room1, room2] = rooms;

        // ตรวจสอบว่าห้องนี้เป็นห้องที่ถูกรวมอยู่หรือไม่ (roomType === 'SIGNATURE')
        if (room1.roomType !== 'SIGNATURE' || room2.roomType !== 'SIGNATURE') {
            return res.status(400).json({ message: "ห้องนี้ไม่ได้อยู่ในประเภท Signature ไม่สามารถแยกได้" });
        }

        // เปลี่ยนสถานะของห้องกลับเป็นห้องเดี่ยว (roomType = 'SINGLE') และ pairRoomNumber = null
        await prisma.room.updateMany({
            where: { roomNumber: { in: [roomNumber1, roomNumber2] } },
            data: {
                roomType: 'SINGLE',
                pairRoomNumber: null
            }
        });

        return res.status(200).json({ message: "แยกห้องสำเร็จ" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};


