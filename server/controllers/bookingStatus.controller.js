const prisma = require("../config/prisma")
const logger = require('../utils/logger');

// สำหรับ front กดยกเลิกการจอง
exports.cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.body  // รับจาก body ตามที่ส่งมา
        logger.info('Request to cancel booking: bookingId=%s', bookingId);

        if (!bookingId) {
            return res.status(400).json({ message: "กรุณาระบุใบจอง" })
        }

        const booking = await prisma.booking.findUnique({
            where: {
                bookingId: Number(bookingId)
            }
        })

        if (!booking) {
            return res.status(404).json({ message: "ไม่พบข้อมูลการจอง" })
        }

        if (booking.bookingStatus !== 'PENDING') {
            return res.status(400).json({ message: "สถานะนี้ไม่สามารถยกเลิกได้" })
        }

        // ถ้าผ่านได้ ค่อย update
        const cancelled = await prisma.booking.update({
            where: {
                bookingId: Number(bookingId)
            },
            data: {
                bookingStatus: 'CANCELLED',
                cancelledAt: new Date()
            }
        })

        logger.info('Booking cancelled: %o', cancelled);
        res.json({ message: "Booking cancelled successfully", booking: cancelled })

    } catch (err) {
        logger.error('Cancel booking error: %s', err.stack || err.message);
        res.status(500).json({ message: "Server error" })
    }
}

exports.checkIn = async (req, res) => {
    try {
        const { id } = req.params; // รับ bookingId จาก params
        const bookingId = Number(id);

        if (!bookingId) {
            return res.status(400).json({ message: "ไม่พบข้อมูล โปรดเลือกใบจอง" })
        }

        const booking = await prisma.booking.findUnique({
            where: {
                bookingId: bookingId
            }
        })

        if (!booking) {
            return res.status(404).json({ message: "ไม่พบข้อมูลใดๆ" })
        }

        if (!booking.roomNumber) {
            return res.status(400).json({ message: "Booking นี้ยังไม่ได้ระบุห้อง" })
        }

        // อัปเดต bookingStatus
        const checkedInBooking = await prisma.booking.update({
            where: {
                bookingId: bookingId
            },
            data: {
                bookingStatus: 'CHECKED_IN',
            },
        })

        // อัปเดตสถานะห้องหลัก
        const checkedInRoom = await prisma.room.update({
            where: {
                roomNumber: booking.roomNumber
            },
            data: {
                roomStatus: 'OCCUPIED'
            }
        })

        // ถ้ามี pairRoomNumber (signature room) ให้อัปเดตด้วย
        let checkedInPairRoom = null;
        if (booking.pairRoomNumber) {
            checkedInPairRoom = await prisma.room.update({
                where: { roomNumber: booking.pairRoomNumber },
                data: { roomStatus: 'OCCUPIED' }
            });
        }

        res.status(200).json(
            { 
                message: "Check-In at Booking & room", 
                checkedInBooking, 
                checkedInRoom, 
                checkedInPairRoom 
            },
        )

    } catch (err) {
        logger.error('Check-In error: %s', err.stack || err.message);
        res.status(500).json({ message: "Server error" })
    }
}

exports.checkOut = async (req, res) => {
    try {
        const { id } = req.params; // รับ bookingId จาก params
        const bookingId = Number(id);

        if (!bookingId) {
            return res.status(400).json({ message: "ไม่พบข้อมูล โปรดเลือกใบจอง" })
        }

        const booking = await prisma.booking.findUnique({
            where: {
                bookingId: bookingId
            }
        })

        if (!booking) {
            return res.status(404).json({ message: "ไม่พบข้อมูลใดๆ" })
        }

        if (!booking.roomNumber) {
            return res.status(400).json({ message: "Booking นี้ยังไม่ได้ระบุห้อง" })
        }

        // อัปเดต bookingStatus
        const checkedOutBooking = await prisma.booking.update({
            where: {
                bookingId: bookingId
            },
            data: {
                bookingStatus: 'CHECKED_OUT',
            },
            include: {
                room: true
            }
        })

        // อัปเดตสถานะห้องหลัก
        const checkedOutRoom = await prisma.room.update({
            where: {
                roomNumber: booking.roomNumber
            },
            data: {
                roomStatus: 'AVAILABLE'
            }
        })

        // ถ้ามี pairRoomNumber (signature room) ให้อัปเดตด้วย
        let checkedOutPairRoom = null;
        if (booking.pairRoomNumber) {
            checkedOutPairRoom = await prisma.room.update({
                where: { roomNumber: booking.pairRoomNumber },
                data: { roomStatus: 'AVAILABLE' }
            });
        }

        res.status(200).json({ 
            message: "Check-out สำเร็จ", 
            checkedOutBooking, 
            checkedOutRoom, 
            checkedOutPairRoom 
        })

    } catch (err) {
        logger.error('Check-Out error: %s', err.stack || err.message);
        res.status(500).json({ message: "Server error" })
    }
}