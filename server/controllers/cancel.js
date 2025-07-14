const prisma = require("../config/prisma")

//อยู่ที่ user.js (routes)
exports.CancelledBooking = async (req, res) => {
    try {
        const { bookingId } = req.body  // รับจาก body ตามที่ส่งมา
        console.log(bookingId)

        if (!bookingId) {
            return res.status(400).json({ message: "กรุณาระบุใบจอง" })
        }

        const booking = await prisma.booking.findFirst({
            where: {
                bookingId: Number(bookingId)
            }
        })

        if (!booking) {
            return res.status(404).json({ message: "ไม่พบข้อมูลการจอง" })
        }

        if (booking.bookingStatusId !== 1) {
            return res.status(400).json({ message: "สถานะนี้ไม่สามารถยกเลิกได้" })
        }

        // ถ้าผ่านได้ ค่อย update
        const cancelled = await prisma.booking.update({
            where: {
                bookingId: Number(bookingId)
            },
            data: {
                bookingStatusId: 5,
                cancelledAt: new Date()
            }
        })


        res.json(cancelled)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}