const prisma = require("../config/prisma")
const logger = require('../utils/logger');

// exports.create = async (req, res) => {
//     try {

//         const { roomNumber, roomTypeId, roomStatusId, floor } = req.body

//         const roomNum = await prisma.room.findFirst({
//             where: {
//                 roomNumber: roomNumber
//             }
//         })

//         if (roomNum) {
//             console.log("Room already exits")
//             return res.status(400).json({ message: "Room already exists!!" })
//         }

//         const room = await prisma.room.create({
//             data: {
//                 roomNumber: roomNumber,
//                 floor: floor,
//                 roomType: {
//                     connect: {
//                         roomTypeId: Number(roomTypeId) // ✅ ใช้ connect เชื่อมกับ RoomType
//                     }
//                 },
//                 roomStatus: {
//                     connect: {
//                         roomStatusId: Number(roomStatusId)
//                     }
//                 }
//             }
//         })

//         res.json(room)
//         // res.json("room")
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ message: "Server error" })
//     }
// }

//สำหรับเพิ่มห้องทั้งหมดใน postman
exports.create = async (req, res) => {
    try {
        const roomsData = req.validated;

        if (!Array.isArray(roomsData) || roomsData.length === 0) {
            return res.status(400).json({ message: "Invalid payload format! Expected an array of rooms." });
        }

        let createdRooms = [];

        for (const { roomNumber, roomType, roomStatus, floor } of roomsData) {
            const roomNumberStr = roomNumber.toString();

            const existingRoom = await prisma.room.findFirst({
                where: { roomNumber: roomNumberStr }
            });

            if (existingRoom) {
                createdRooms.push({ roomNumber, status: "Room already exists" });
                continue;
            }

            const newRoom = await prisma.room.create({
                data: {
                    roomNumber: roomNumberStr,
                    floor,
                    roomType, // enum: 'SINGLE' | 'DOUBLE' | 'SIGNATURE'
                    roomStatus // ต้องเป็นค่าจาก enum RoomStatus
                }
            });

            createdRooms.push(newRoom);
        }

        res.json({ message: "Rooms processed", data: createdRooms });
        logger.info('Create room: %o', createdRooms.map(r => r.roomNumber || r.roomNumberStr));

    } catch (err) {
        logger.error('Create room error: %s', err.stack || err.message);
        res.status(500).json({ message: "Server error" });
    }
};




exports.list = async (req, res) => {
    try {
        const rooms = await prisma.room.findMany({
            orderBy: { createdAt: "asc" },
            select: {
                roomId: true,
                roomNumber: true,
                floor: true,
                roomType: true, // enum
                roomStatus: true,
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

        const { id } = req.params
        const room = await prisma.room.findFirst({
            where: {
                roomId: Number(id)
            },
            include: {
                roomType: true
            }
        })

        res.send(room)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}

exports.update = async (req, res) => {
    try {
        const { roomNumber, roomStatus, roomType, floor } = req.body;
        const roomId = Number(req.params.id);

        // ค้นหาห้องที่มีเลขห้องเดียวกัน แต่ต้องไม่ใช่ห้องที่กำลังอัปเดต
        const existingRoom = await prisma.room.findFirst({
            where: {
                roomNumber: roomNumber,
                NOT: {
                    roomId: roomId // ยกเว้นห้องปัจจุบัน
                }
            }
        });

        if (existingRoom) {
            return res.status(400).json({ message: "เลขห้องซ้ำกับห้องอื่น" });
        }

        const room = await prisma.room.update({
            where: {
                roomId: roomId
            },
            data: {
                roomNumber: roomNumber,
                roomStatus: roomStatus,
                roomType: roomType, // enum
                floor: floor
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
        const { id } = req.params

        const room = await prisma.room.findFirst({
            where: {
                roomId: Number(id)
            },
        })
        if (!room) {
            return res.status(400).json({ message: 'room not found!!' })
        }

        await prisma.room.delete({
            where: {
                roomId: Number(id)
            }
        })

        res.send("remove room")
        logger.info('Remove room: roomId=%s', id);

    } catch (err) {
        logger.error('Remove room error: %s', err.stack || err.message);
        res.status(500).json({ message: "Server error" })
    }
}




// ฟังก์ชันรวม 2 ห้องเป็น Signature Room
exports.groupRoom = async (req, res) => {
    try {
        const { roomId1, roomId2 } = req.body;

        // ดึงข้อมูลห้องจาก roomId
        const rooms = await prisma.room.findMany({
            where: { roomId: { in: [roomId1, roomId2] } },
            select: { roomId: true, roomNumber: true, roomStatus: true, roomType: true }
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

        // อัปเดตสถานะของห้องให้เป็น "Signature"
        await prisma.room.update({
            where: { roomId: room1.roomId },
            data: {
                roomType: 'SIGNATURE',
                pairRoomId: room2.roomId
            }
        });

        await prisma.room.update({
            where: { roomId: room2.roomId },
            data: {
                roomType: 'SIGNATURE',
                pairRoomId: room1.roomId
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
        const { roomId1, roomId2 } = req.body;

        // ดึงข้อมูลห้องจาก roomId
        const rooms = await prisma.room.findMany({
            where: { roomId: { in: [roomId1, roomId2] } },
            select: { roomId: true, roomNumber: true, roomStatus: true, roomType: true, pairRoomId: true }
        });

        if (rooms.length !== 2) {
            return res.status(400).json({ message: "ไม่พบห้องที่ต้องการแยก" });
        }

        const [room1, room2] = rooms;

        // ตรวจสอบว่าห้องนี้เป็นห้องที่ถูกรวมอยู่หรือไม่ (roomType === 'SIGNATURE')
        if (room1.roomType !== 'SIGNATURE' || room2.roomType !== 'SIGNATURE') {
            return res.status(400).json({ message: "ห้องนี้ไม่ได้อยู่ในประเภท Signature ไม่สามารถแยกได้" });
        }

        // เปลี่ยนสถานะของห้องกลับเป็นห้องเดี่ยว (roomType = 'SINGLE')
        await prisma.room.updateMany({
            where: { roomId: { in: [roomId1, roomId2] } },
            data: {
                roomType: 'SINGLE',
                pairRoomId: null
            }
        });

        return res.status(200).json({ message: "แยกห้องสำเร็จ" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};


