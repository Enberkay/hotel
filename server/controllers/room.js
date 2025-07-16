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

        for (const { roomNumber, roomTypeId, roomStatusId, floor } of roomsData) {
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
                    roomType: { connect: { roomTypeId: Number(roomTypeId) } },
                    roomStatus: { connect: { roomStatusId: Number(roomStatusId) } }
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
            orderBy: { createdAt: "asc" }, // เรียงข้อมูล
            include: {
                roomType: true,
                roomStatus: true
            }
        })
        res.json(rooms)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}

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
        const { roomNumber, roomStatusId, roomTypeId, floor } = req.body
        const roomId = Number(req.params.id)

        // ค้นหาห้องที่มีเลขห้องเดียวกัน แต่ต้องไม่ใช่ห้องที่กำลังอัปเดต
        const existingRoom = await prisma.room.findFirst({
            where: {
                roomNumber: roomNumber,
                NOT: {
                    roomId: roomId // ยกเว้นห้องปัจจุบัน
                }
            }
        })

        if (existingRoom) {
            return res.status(400).json({ message: "เลขห้องซ้ำกับห้องอื่น" })
        }

        const room = await prisma.room.update({
            where: {
                roomId: roomId
            },
            data: {
                roomNumber: roomNumber,
                roomStatus: roomStatusId,
                roomTypeId: Number(roomTypeId),
                floor: floor
            }
        })

        res.json(room)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
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
            select: { roomId: true, roomNumber: true, roomStatusId: true, roomTypeId: true }
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

        // ตรวจสอบว่าสถานะห้องเป็น "ว่าง" (roomStatusId = 1)
        if (room1.roomStatusId !== 1 || room2.roomStatusId !== 1) {
            return res.status(400).json({ message: "ห้องไม่ว่าง ไม่สามารถรวมได้" });
        }

        // อัปเดตสถานะของห้องให้เป็น "Signature" (roomTypeId = 3)
        // ✅ แก้ไขโค้ดเพื่ออัปเดต pairRoomId ให้ถูกต้อง
        await prisma.room.update({
            where: { roomId: room1.roomId },
            data: {
                roomTypeId: 3,  // ตั้งค่าเป็น Signature
                pairRoomId: room2.roomId // ห้องนี้จับคู่กับ room2
            }
        });

        await prisma.room.update({
            where: { roomId: room2.roomId },
            data: {
                roomTypeId: 3,  // ตั้งค่าเป็น Signature
                pairRoomId: room1.roomId // ห้องนี้จับคู่กับ room1
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
            select: { roomId: true, roomNumber: true, roomStatusId: true, roomTypeId: true, pairRoomId: true }
        });

        if (rooms.length !== 2) {
            return res.status(400).json({ message: "ไม่พบห้องที่ต้องการแยก" });
        }

        const [room1, room2] = rooms;

        // ตรวจสอบว่าห้องนี้เป็นห้องที่ถูกรวมอยู่หรือไม่
        if (room1.roomTypeId !== 3 || room2.roomTypeId !== 3) {
            return res.status(400).json({ message: "ห้องนี้ไม่ได้อยู่ในประเภท Signature ไม่สามารถแยกได้" });
        }

        // if (room1.roomStatusId !== 1 || room2.roomStatusId !== 1) {
        //     return res.status(400).json({ message: "ห้องไม่ว่าง ไม่สามารถแยกได้" })
        // }

        // เปลี่ยนสถานะของห้องกลับเป็นห้องเดี่ยว (roomTypeId ปกติ)
        await prisma.room.updateMany({
            where: { roomId: { in: [roomId1, roomId2] } },
            data: {
                roomTypeId: 1, // เปลี่ยนกลับเป็นห้องปกติ
                pairRoomId: null // เอาค่าการจับคู่ห้องออก
            }
        });

        return res.status(200).json({ message: "แยกห้องสำเร็จ" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};


