const prisma = require("../config/prisma")

// ฟังก์ชันสำหรับสร้างการจองใหม่
exports.createBooking = async (req, res) => {
    try {
        const { count, roomTypeId, checkInDate, checkOutDate, addon, paymentMethodId } = req.body
        const { userEmail } = req.user // ได้จาก authCheck middleware

        // ดึงข้อมูล user ที่เป็น customer จาก userEmail
        const customer = await prisma.user.findFirst({
            where: {
                userEmail,
                userRole: 'customer'
            },
            select: {
                userId: true,
                // ถ้าต้องการ field เฉพาะ customer เช่น discount ให้เพิ่มตรงนี้
            }
        })

        if (!customer) {
            return res.status(403).json({ message: "Customer not found or unauthorized" })
        }

        const customerId = customer.userId
        // const customerDiscount = ... // ถ้ามี field discount ใน user ให้ดึงตรงนี้
        const customerDiscount = 0 // (ตัวอย่าง: ไม่มี discount)

        if (!count || !checkInDate || !checkOutDate) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)

        if (checkIn >= checkOut) {
            return res.status(400).json({ message: "Check-in date must be before check-out date" })
        }

        const roomType = await prisma.roomType.findUnique({
            where: {
                roomTypeId: Number(roomTypeId)
            },
            select: {
                price: true
            }
        })

        if (!roomType) {
            return res.status(400).json({ message: "Invalid room type" })
        }

        const daysBooked = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
        const roomTotal = roomType.price * daysBooked

        let totalAddon = 0
        let addonListData = []

        // Validation & Cleanup สำหรับ addon
        const validAddons = Array.isArray(addon)
            ? addon.filter(a => a.addonId !== undefined && a.quantity !== undefined)
            : []

        if (addon.length > 0 && validAddons.length !== addon.length) {
            return res.status(400).json({ message: "Invalid addon format. Each addon must have addonId and quantity." })
        }

        if (validAddons.length > 0) {
            const addonsData = await prisma.addon.findMany({
                where: {
                    addonId: {
                        in: validAddons.map(a => a.addonId)
                    }
                },
                select: {
                    addonId: true,
                    price: true
                }
            })

            addonListData = validAddons.map((addonItem) => {
                const addonId = addonItem.addonId
                const quantity = addonItem.quantity
                const foundAddon = addonsData.find((a) => a.addonId === addonId)

                if (foundAddon) {
                    totalAddon += foundAddon.price * Number(quantity)
                    return {
                        addonId: Number(addonId),
                        quantity: Number(quantity)
                    }
                }
                return null
            }).filter((a) => a !== null)
        }

        const total = roomTotal + totalAddon
        const lastTotal = total - customerDiscount

        // สร้าง Booking ก่อน (เพราะเป็นหัวหลักของระบบ)
        const newBooking = await prisma.booking.create({
            data: {
                customer: {
                    connect: { userId: customerId }
                },
                roomType: {
                    connect: { roomTypeId: Number(roomTypeId) }
                },
                count: Number(count),
                checkInDate: checkIn,
                checkOutDate: checkOut,
                total: lastTotal,
                confirmedAt: null,
                bookingStatus: 'PENDING',
            }
        })

        // ถ้ามี Addon ให้สร้าง BookingAddonList และ BookingAddon
        if (addonListData.length > 0) {
            const newBookingAddonList = await prisma.bookingAddonList.create({
                data: {}
            })

            await prisma.bookingAddon.createMany({
                data: addonListData.map(a => ({
                    bookingAddonListId: newBookingAddonList.bookingAddonListId,
                    addonId: a.addonId,
                    quantity: a.quantity
                }))
            })

            await prisma.bookingAddonListRelation.create({
                data: {
                    bookingId: newBooking.bookingId,
                    bookingAddonListId: newBookingAddonList.bookingAddonListId,
                    price: totalAddon
                }
            })
        }

        res.status(201).json({ message: "Booking created successfully", booking: newBooking })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to create booking", error: err.message })
    }
}

// ฟังก์ชันสำหรับดึงรายการการจองทั้งหมด
exports.listBookings = async (req, res) => {
    try {
        // ดึงข้อมูลการจองทั้งหมดจากฐานข้อมูล
        const bookings = await prisma.booking.findMany({
            include: {
                customer: {
                    include: {
                        user: {
                            select: {
                                prefix: true,
                                userName: true,
                                userSurName: true,
                                userEmail: true,
                                userNumPhone: true
                            }
                        }
                    }
                },
                bookingStatus: {
                    select: {
                        bookingStatusName: true,
                        bookingStatusId: true
                    }
                },
                roomType: {
                    select: {
                        roomTypeName: true
                    }
                },
                BookingAddonListRelation: {
                    include: {
                        bookingAddonList: {
                            include: {
                                BookingAddon: {
                                    include: {
                                        addon: {
                                            select: {
                                                addonName: true,
                                                price: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        res.status(200).json(bookings)
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Failed to retrieve bookings",
            error: err.message,
        })
    }
}

exports.readBooking = async (req, res) => {
    try {
        const { id } = req.params

        const booking = await prisma.booking.findFirst({
            where: { bookingId: Number(id) },
            include: {
                customer: {
                    include: {
                        user: {
                            select: {
                                userName: true,
                                userSurName: true,
                                userEmail: true,
                                userNumPhone: true,
                                licensePlate: true
                            }
                        }
                    }
                },
                roomType: {
                    select: {
                        roomTypeName: true,
                        price: true
                    }
                },
                BookingAddonListRelation: { // 👈 แก้ตรงนี้
                    include: {
                        bookingAddonList: { // ดึง bookingAddonList ที่อยู่ใน relation
                            include: {
                                BookingAddon: { // แล้วดึง BookingAddon ต่อ
                                    include: {
                                        addon: {
                                            select: {
                                                addonName: true,
                                                price: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" })
        }

        const { total } = booking

        // ✅ ดึงรายการ Addon
        let addonList = []
        let totalAddonPrice = 0

        for (const relation of booking.BookingAddonListRelation) {
            const bookingAddonList = relation.bookingAddonList
            for (const bookingAddon of bookingAddonList.BookingAddon) {
                if (bookingAddon.addon) {
                    const { addonName, price } = bookingAddon.addon
                    const quantity = bookingAddon.quantity || 0
                    const addonTotal = price * quantity

                    totalAddonPrice += addonTotal
                    addonList.push({ addonName, price, quantity, total: addonTotal })
                }
            }
        }

        res.json({
            ...booking,
            addons: addonList,
            totalAddon: totalAddonPrice,
            total
        })
    } catch (err) {
        console.error("❌ Server Error:", err)
        res.status(500).json({ message: "Server error" })
    }
}

exports.confirmBooking = async (req, res) => {
    try {
        const { roomId } = req.body;  // รับ roomId จาก Client
        const { id } = req.params;  // รับ bookingId จาก URL param
        const { userEmail } = req.user;  // ดึง userEmail จาก JWT (พนักงานที่ล็อกอินอยู่)

        // ตรวจสอบค่าที่ส่งมา
        if (!roomId || !id) {
            return res.status(400).json({ message: "Missing required fields: roomId and bookingId are required" });
        }

        // ค้นหาข้อมูลห้อง
        const room = await prisma.room.findUnique({
            where: { roomId: Number(roomId) },
            select: { roomStatus: true, pairRoomId: true }
        });

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        if (room.roomStatus !== 'AVAILABLE') {
            return res.status(400).json({ message: "Room is not available for booking" });
        }

        // ค้นหา frontId ของพนักงานที่ล็อกอินอยู่
        const frontUser = await prisma.user.findFirst({
            where: {
                userEmail,
                userRole: 'front'
            },
            select: { userId: true }
        });

        if (!frontUser) {
            return res.status(403).json({ message: "Front Desk user not found or unauthorized" });
        }

        // 🔹 ตรวจสอบว่าห้องเป็น Signature Room หรือไม่
        let mainRoomId = roomId;
        let secondRoomId = null;

        if (room.pairRoomId) {
            mainRoomId = Math.min(roomId, room.pairRoomId); // ใช้ห้องหมายเลขต่ำกว่าเป็นตัวหลัก
            secondRoomId = Math.max(roomId, room.pairRoomId); // ห้องที่รวมกัน
        }

        // ✅ ใช้ Transaction เพื่ออัปเดต Booking และเปลี่ยนสถานะห้อง
        const updatedBooking = await prisma.$transaction(async (prisma) => {
            // อัปเดตการจอง
            const booking = await prisma.booking.update({
                where: { bookingId: Number(id) },
                data: {
                    room: { connect: { roomId: Number(mainRoomId) } },
                    pairRoom: secondRoomId ? { connect: { roomId: Number(secondRoomId) } } : undefined,
                    front: { connect: { userId: frontUser.userId } },
                    bookingStatus: 'CONFIRMED',
                    confirmedAt: new Date()
                }
            });

            // อัปเดตสถานะห้องหลัก
            await prisma.room.update({
                where: { roomId: Number(mainRoomId) },
                data: { roomStatus: 'RESERVED' }
            });

            // ถ้าเป็นห้อง Signature ให้อัปเดตสถานะห้องที่สองด้วย
            if (secondRoomId) {
                await prisma.room.update({
                    where: { roomId: Number(secondRoomId) },
                    data: { roomStatus: 'RESERVED' }
                });
            }

            return booking;
        });

        let message = `Booking confirmed for room ${mainRoomId}`;
        if (secondRoomId) {
            message += ` and ${secondRoomId} (Signature Room)`;
        }

        res.status(200).json({ message, booking: updatedBooking });
    } catch (err) {
        console.error("❌ Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};








