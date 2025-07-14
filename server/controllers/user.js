const prisma = require("../config/prisma")

// ดึงประวัติการจองของตัวเอง
exports.myBookings = async (req, res) => {
    try {
        const userId = req.user.userId // ดึง userId จาก JWT Token (Middleware)

        // ค้นหาข้อมูลการจองของลูกค้า
        const customer = await prisma.customer.findUnique({
            where: { userId: userId },
            include: {
                Booking: {
                    include: {
                        bookingStatus: true,
                        paymentStatus: true,
                        room: {
                            select: {
                                roomNumber: true,
                                floor: true,
                                roomType: true
                            }
                        },
                        // ✅ ดึงข้อมูล pairRoom ถ้ามี
                        pairRoom: {
                            select: {
                                roomNumber: true,
                                floor: true
                            }
                        },
                        roomType: true,
                        paymentMethod: true
                    },
                    orderBy: { createdAt: "desc" }
                }
            }
        })

        if (!customer || !customer.Booking.length) {
            return res.status(404).json({ message: "ไม่พบข้อมูลการจองของคุณ" })
        }

        return res.json(customer.Booking)
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
                    include: {
                        user: {
                            select: {
                                userEmail: true,
                                userName: true,
                                userSurName: true,
                                userNumPhone: true,
                                prefix: true
                            }
                        }
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