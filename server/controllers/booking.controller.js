const prisma = require("../config/prisma");
const logger = require('../utils/logger');

// กำหนดราคาห้องแต่ละประเภท (config)
const ROOM_TYPE_PRICES = {
  SINGLE: 500, // เตียงเดี่ยว
  DOUBLE: 500, // เตียงคู่
  SIGNATURE: 1500, // signature
};

// ฟังก์ชันสำหรับสร้างการจองใหม่
exports.createBooking = async (req, res) => {
  try {
    const {
      count,
      roomType,
      checkInDate,
      checkOutDate,
      customerName,
      customerSurname,
      customerPhone,
      customerEmail,
      customerIdCard,
      customerLicensePlate,
    } = req.validated || req.body;

    // ตรวจสอบวันที่
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkIn >= checkOut) {
      return res
        .status(400)
        .json({ message: "Check-in date must be before check-out date" });
    }

    // ใช้ราคาจาก config
    const price = ROOM_TYPE_PRICES[roomType];
    if (!price) {
      return res.status(400).json({ message: "Invalid room type" });
    }
    const daysBooked = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const lastTotal = price * daysBooked;

    // สร้าง Booking
    const newBooking = await prisma.booking.create({
      data: {
        roomType, // enum
        count: Number(count),
        checkInDate: checkIn,
        checkOutDate: checkOut,
        total: lastTotal,
        confirmedAt: null,
        bookingStatus: "PENDING",
        customerName,
        customerSurname,
        customerPhone,
        customerEmail,
        customerIdCard,
        customerLicensePlate,
      },
    });

    res
      .status(201)
      .json({ message: "Booking created successfully", booking: newBooking });
    logger.info("Create booking: bookingId=%s", newBooking.bookingId);
  } catch (err) {
    logger.error("Create booking error: %s", err.stack || err.message);
    res
      .status(500)
      .json({ message: "Failed to create booking", error: err.message });
  }
};

// ฟังก์ชันสำหรับดึงรายการการจองทั้งหมด
exports.listBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(bookings);
  } catch (err) {
    logger.error("List bookings error: %s", err.stack || err.message);
    res.status(500).json({
      message: "Failed to retrieve bookings",
      error: err.message,
    });
  }
};

exports.readBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findFirst({
      where: { bookingId: Number(id) },
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (err) {
    logger.error("Read booking error: %s", err.stack || err.message);
    res
      .status(500)
      .json({ message: "Failed to retrieve booking", error: err.message });
  }
};

exports.confirmBooking = async (req, res) => {
  try {
    const { roomNumber } = req.body; // รับ roomNumber จาก Client
    const { id } = req.params; // รับ bookingId จาก URL param
    const { email } = req.user; // ดึง email จาก JWT (พนักงานที่ล็อกอินอยู่)

    // ตรวจสอบค่าที่ส่งมา
    if (!roomNumber || !id) {
      return res
        .status(400)
        .json({
          message: "Missing required fields: roomNumber and bookingId are required",
        });
    }

    // ค้นหาข้อมูลห้อง
    const room = await prisma.room.findUnique({
      where: { roomNumber },
      select: { roomStatus: true, pairRoomNumber: true },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.roomStatus !== "AVAILABLE") {
      return res
        .status(400)
        .json({ message: "Room is not available for booking" });
    }

    // ค้นหา frontId ของพนักงานที่ล็อกอินอยู่
    const frontUser = await prisma.user.findFirst({
      where: {
        email,
        role: "front",
      },
      select: { id: true },
    });

    if (!frontUser) {
      return res
        .status(403)
        .json({ message: "Front Desk user not found or unauthorized" });
    }

    // 🔹 ตรวจสอบว่าห้องเป็น Signature Room หรือไม่
    let mainRoomNumber = roomNumber;
    let secondRoomNumber = null;

    if (room.pairRoomNumber) {
      // กำหนดห้องหลักและห้องคู่ตามลำดับตัวอักษร
      mainRoomNumber = [roomNumber, room.pairRoomNumber].sort()[0];
      secondRoomNumber = [roomNumber, room.pairRoomNumber].sort()[1];
    }

    //ใช้ Transaction เพื่ออัปเดต Booking และเปลี่ยนสถานะห้อง
    const updatedBooking = await prisma.$transaction(async (prisma) => {
      // อัปเดตการจอง
      const booking = await prisma.booking.update({
        where: { bookingId: Number(id) },
        data: {
          room: { connect: { roomNumber: mainRoomNumber } },
          pairRoom: secondRoomNumber
            ? { connect: { roomNumber: secondRoomNumber } }
            : undefined,
          front: { connect: { id: frontUser.id } },
          bookingStatus: "CONFIRMED",
          confirmedAt: new Date(),
        },
      });

      // อัปเดตสถานะห้องหลัก
      await prisma.room.update({
        where: { roomNumber: mainRoomNumber },
        data: { roomStatus: "RESERVED" },
      });

      // ถ้าเป็นห้อง Signature ให้อัปเดตสถานะห้องที่สองด้วย
      if (secondRoomNumber) {
        await prisma.room.update({
          where: { roomNumber: secondRoomNumber },
          data: { roomStatus: "RESERVED" },
        });
      }

      return booking;
    });

    let message = `Booking confirmed for room ${mainRoomNumber}`;
    if (secondRoomNumber) {
      message += ` and ${secondRoomNumber} (Signature Room)`;
    }

    res.status(200).json({ message, booking: updatedBooking });
    logger.info(
      "Confirm booking: bookingId=%s, roomNumber=%s, email=%s",
      id,
      roomNumber,
      email
    );
  } catch (err) {
    logger.error("Confirm booking error: %s", err.stack || err.message);
    res.status(500).json({ message: "Server error" });
  }
};
