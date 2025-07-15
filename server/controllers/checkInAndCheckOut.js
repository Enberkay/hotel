const prisma = require("../config/prisma")

exports.checkIn = async (req, res) => {
    try {
        const { id } = req.params; // รับ bookingId จาก params
        const bookingId = Number(id);


        if (!bookingId) {
            return res.status(400).json({ message: "ไม่พบข้อมูล โปรดเลือกใบจอง" })
        }

        const booking = await prisma.booking.findFirst({
            where: {
                bookingId: Number(bookingId)
            }
        })

        if (!booking) {
            return res.status(404).json({ message: "ไม่พบข้อมูลใดๆ" })
        }

        console.log("ข้อมูลใบจองนี้", booking, "ใบจอง", bookingId)
        const roomCheckInId = booking.roomId

        const checkedInBooking = await prisma.booking.update({
            where: {
                bookingId: Number(bookingId)
            },
            data: {
                bookingStatus: 'CHECKED_IN',
            },
        })

        const checkedInRoom = await prisma.room.update({
            where: {
                roomId: Number(roomCheckInId)
            },
            data: {
                roomStatus: 'OCCUPIED'
            }
        })

        res.status(200).json(
            { message: "Check-In at Booking & room", checkedInBooking, checkedInRoom },
        )


    } catch (err) {
        console.log(err)
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

        const booking = await prisma.booking.findFirst({
            where: {
                bookingId: Number(bookingId)
            }
        })

        if (!booking) {
            return res.status(404).json({ message: "ไม่พบข้อมูลใดๆ" })
        }

        const checkedOutBooking = await prisma.booking.update({
            where: {
                bookingId: Number(bookingId)
            },
            data: {
                bookingStatus: 'CHECKED_OUT',
            },
            include: {
                room: true
            }
        })

        res.status(200).json({ message: "Check-out สำเร็จ", checkedOutBooking })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}