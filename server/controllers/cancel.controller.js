const prisma = require("../config/prisma")

// สำหรับ front กดยกเลิกการจอง
exports.cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.body  // รับจาก body ตามที่ส่งมา
        console.log(bookingId)

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

        res.json({ message: "Booking cancelled successfully", booking: cancelled })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}