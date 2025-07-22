const prisma = require("../config/prisma")
const { calculateBookingTotal, processAddons } = require('../services/bookingService');
const logger = require('../utils/logger');

// กำหนดราคาห้องแต่ละประเภท (config)
const ROOM_TYPE_PRICES = {
    SINGLE: 500,      // เตียงเดี่ยว
    DOUBLE: 500,     // เตียงคู่
    SIGNATURE: 1500  // signature
};

// ฟังก์ชันสำหรับสร้างการจองใหม่
exports.createBooking = async (req, res) => {
    try {
        const { count, roomType, checkInDate, checkOutDate, addon } = req.validated;
        const { userEmail } = req.user;

        // ดึงข้อมูล user ที่เป็น customer จาก userEmail
        const customer = await prisma.user.findFirst({
            where: {
                userEmail,
                userRole: 'customer'
            },
            select: {
                userId: true,
            }
        });

        if (!customer) {
            return res.status(403).json({ message: "Customer not found or unauthorized" });
        }
        const customerId = customer.userId;
        const customerDiscount = 0;

        // ตรวจสอบวันที่
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        if (checkIn >= checkOut) {
            return res.status(400).json({ message: "Check-in date must be before check-out date" });
        }

        // ใช้ราคาจาก config
        const price = ROOM_TYPE_PRICES[roomType];
        if (!price) {
            return res.status(400).json({ message: "Invalid room type" });
        }

        const daysBooked = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const { totalAddon, addonListData } = await processAddons(addon);
        const lastTotal = calculateBookingTotal(price, daysBooked, totalAddon, customerDiscount);

        // สร้าง Booking
        const newBooking = await prisma.booking.create({
            data: {
                customer: { connect: { userId: customerId } },
                roomType, // enum
                count: Number(count),
                checkInDate: checkIn,
                checkOutDate: checkOut,
                total: lastTotal,
                confirmedAt: null,
                bookingStatus: 'PENDING',
            }
        });

        // Addon
        if (addonListData.length > 0) {
            const newBookingAddonList = await prisma.bookingAddonList.create({ data: {} });
            await prisma.bookingAddon.createMany({
                data: addonListData.map(a => ({
                    bookingAddonListId: newBookingAddonList.bookingAddonListId,
                    addonId: a.addonId,
                    quantity: a.quantity
                }))
            });
            await prisma.bookingAddonListRelation.create({
                data: {
                    bookingId: newBooking.bookingId,
                    bookingAddonListId: newBookingAddonList.bookingAddonListId,
                    price: totalAddon
                }
            });
        }

        res.status(201).json({ message: "Booking created successfully", booking: newBooking });
        logger.info('Create booking: userId=%s, bookingId=%s', customerId, newBooking.bookingId);
    } catch (err) {
        logger.error('Create booking error: %s', err.stack || err.message);
        res.status(500).json({ message: "Failed to create booking", error: err.message });
    }
};

// ฟังก์ชันสำหรับดึงรายการการจองทั้งหมด
exports.listBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                customer: {
                    select: {
                        userId: true,
                        userEmail: true,
                        userName: true,
                        userSurName: true,
                        userNumPhone: true,
                        prefix: true
                    }
                },
                bookingStatus: true, // ถ้า bookingStatus มี field เดียว ให้ select เฉพาะ field นั้น
                roomType: { select: { roomTypeName: true } },
                BookingAddonListRelation: {
                    include: {
                        bookingAddonList: {
                            include: {
                                BookingAddon: {
                                    include: {
                                        addon: { select: { addonName: true, price: true } }
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
        logger.error('List bookings error: %s', err.stack || err.message);
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
                    select: {
                        userId: true,
                        userEmail: true,
                        userName: true,
                        userSurName: true,
                        userNumPhone: true,
                        prefix: true
                    }
                },
                roomType: { select: { roomTypeName: true, price: true } },
                BookingAddonListRelation: {
                    include: {
                        bookingAddonList: {
                            include: {
                                BookingAddon: {
                                    include: {
                                        addon: { select: { addonName: true, price: true } }
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
        res.status(200).json(booking)
    } catch (err) {
        logger.error('Read booking error: %s', err.stack || err.message);
        res.status(500).json({ message: "Failed to retrieve booking", error: err.message })
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
        logger.info('Confirm booking: bookingId=%s, roomId=%s, userEmail=%s', id, roomId, userEmail);
    } catch (err) {
        logger.error('Confirm booking error: %s', err.stack || err.message);
        res.status(500).json({ message: "Server error" });
    }
};








