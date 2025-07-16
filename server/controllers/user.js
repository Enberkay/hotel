const prisma = require("../config/prisma")

// ดึงประวัติการจองของตัวเอง
exports.myBookings = async (req, res) => {
    try {
        const userId = req.user.userId // ดึง userId จาก JWT Token (Middleware)

        // ดึงข้อมูลการจองของลูกค้าโดยใช้ userId
        const bookings = await prisma.booking.findMany({
            where: { customerId: userId },
            include: {
                bookingStatus: true,
                room: {
                    select: {
                        roomNumber: true,
                        floor: true,
                        roomType: true
                    }
                },
                pairRoom: {
                    select: {
                        roomNumber: true,
                        floor: true
                    }
                },
                roomType: true
            },
            orderBy: { createdAt: "desc" }
        })

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "ไม่พบข้อมูลการจองของคุณ" })
        }

        return res.json(bookings)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
}



exports.bookingDetail = async (req, res) => {
    try {
        const { id } = req.params

        const booking = await prisma.booking.findUnique({
            where: {
                bookingId: Number(id)
            },
            include: {
                customer: {
                    select: {
                        userEmail: true,
                        userName: true,
                        userSurName: true,
                        userNumPhone: true,
                        prefix: true
                    }
                },
                BookingAddonList: {
                    include: {
                        BookingAddon: {
                            include: {
                                addon: true
                            }
                        }
                    }
                },
                pairRoom: true
            }
        })

        console.log(booking)

        if (!booking) {
            return res.status(404).json({ message: "ไม่พบข้อมูลการจอง" })
        }

        res.json(booking)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}