const prisma = require("../config/prisma")
const logger = require('../utils/logger');

exports.cleaningRequest = async (req, res) => {
    try {
        const { userId } = req.user // ดึง userId จาก JWT Token
        const { rooms } = req.validated // รับข้อมูลห้องที่ต้องทำความสะอาด

        // console.log("Check : ", rooms)

        if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
            return res
                .status(400)
                .json({ message: "กรุณาระบุห้องที่ต้องทำความสะอาด" })
        }

        // ค้นหา frontId จากตาราง Front ตาม userId
        const front = await prisma.user.findUnique({
            where: { userId, userRole: 'front' }
        })

        if (!front) {
            return res
                .status(403)
                .json({ message: "Unauthorized: User is not a front desk staff" })
        }

        const frontId = front.userId // ใช้ frontId ที่หาได้จาก userId

        // ใช้ transaction เพื่อให้แน่ใจว่าทั้งการสร้าง request และการอัปเดตห้องสำเร็จพร้อมกัน
        const result = await prisma.$transaction(async (prisma) => {
            // สร้างคำขอทำความสะอาด
            const cleaningRequest = await prisma.cleaningRequest.create({
                data: {
                    userId,
                    cleaningRequestStatus: 'PENDING',
                    CleaningRequestRoom: {
                        create: rooms.map(({ roomId, description }) => ({
                            roomId,
                            description: description || null,
                        })),
                    },
                },
                include: { CleaningRequestRoom: true },
            })

            // อัปเดตสถานะของห้องที่ส่งคำขอให้เป็น 'CLEANING'
            await prisma.room.updateMany({
                where: {
                    roomId: { in: rooms.map(({ roomId }) => roomId) },
                },
                data: {
                    roomStatus: 'CLEANING',
                },
            })

            return cleaningRequest
        })
        console.log(result)
        logger.info('Create cleaning request: userId=%s, rooms=%o', userId, rooms.map(r => r.roomId));

        res.status(201).json({
            message: "สร้างคำขอทำความสะอาดสำเร็จ และอัปเดตสถานะห้องแล้ว",
            cleaningRequest: result,
        })
    } catch (err) {
        logger.error('Create cleaning request error: %s', err.stack || err.message);
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

exports.listCleaningRequest = async (req, res) => {
    try {
        const { userId } = req.user // ได้จาก authCheck middleware
        const housekeeping = await prisma.user.findFirst({
            where: {
                userId,
                userRole: 'housekeeping'
            },
            select: {
                userId: true,
                assignedFloor: true
            }
        })
        if (!housekeeping) {
            return res.status(404).json({ message: "ไม่พบข้อมูลพนักงานทำความสะอาด" })
        }
        const housekeepingFloor = housekeeping.assignedFloor
        const cleaningRequests = await prisma.cleaningRequest.findMany({
            where: {
                CleaningRequestRoom: {
                    some: {
                        room: {
                            floor: housekeepingFloor
                        }
                    }
                }
            },
            orderBy: { requestAt: "desc" },
            include: {
                CleaningRequestRoom: {
                    include: {
                        room: {
                            select: {
                                roomNumber: true,
                                floor: true,
                            }
                        }
                    }
                },
                cleaningRequestStatus: true, // ถ้าเป็น enum หรือ object เดียว ให้ select เฉพาะ field ที่ใช้
                user: { select: { userName: true, userSurName: true, prefix: true, userNumPhone: true } },
            }
        })
        return res.json(cleaningRequests)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.readCleaningRequest = async (req, res) => {
    try {
        const { id } = req.params
        const cleaningRequest = await prisma.cleaningRequest.findUnique({
            where: { requestId: Number(id) },
            include: {
                CleaningRequestRoom: {
                    include: {
                        room: {
                            select: {
                                roomNumber: true,
                                floor: true,
                            }
                        }
                    }
                },
                cleaningRequestStatus: true,
                user: { select: { userName: true, userSurName: true, prefix: true, userNumPhone: true } },
            }
        })
        if (!cleaningRequest) {
            return res.status(404).json({ message: "ไม่พบข้อมูลใบแจ้งทำความสะอาด" })
        }
        return res.json(cleaningRequest)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.cleaningReport = async (req, res) => {
    try {
        const { userId } = req.user
        const { rooms, requestId } = req.body

        console.log("ข้อมูลที่ได้รับจาก Frontend:", JSON.stringify(req.body, null, 2))

        if (!requestId) {
            return res.status(400).json({ message: "requestId is required" })
        }

        if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
            return res.status(400).json({ message: "Rooms data is required" })
        }

        const cleaningRequest = await prisma.cleaningRequest.findUnique({ where: { requestId } })
        if (!cleaningRequest) {
            return res.status(404).json({ message: "CleaningRequest not found" })
        }

        const housekeeping = await prisma.user.findFirst({ where: { userId } })
        if (!housekeeping) {
            return res.status(403).json({ message: "User is not authorized for housekeeping" })
        }

        let report = await prisma.cleaningReport.findUnique({ where: { requestId } })
        if (!report) {
            report = await prisma.cleaningReport.create({
                data: {
                    requestId,
                    userId: housekeeping.userId,
                    reportAt: new Date()
                }
            })
        }

        //ดึงข้อมูลห้องที่มีอยู่แล้วใน CleaningReportRoom
        const existingReportRooms = await prisma.cleaningReportRoom.findMany({
            where: { reportId: report.reportId },
            select: { roomId: true }
        })

        const existingRoomIds = new Set(existingReportRooms.map(r => r.roomId))
        const newRooms = rooms.filter(room => !existingRoomIds.has(room.roomId))

        if (newRooms.length > 0) {
            await prisma.cleaningReportRoom.createMany({
                data: newRooms.map(room => ({ reportId: report.reportId, roomId: room.roomId })),
                skipDuplicates: true
            })
        }

        //ดึง roomId ที่อัปเดตใหม่อีกครั้ง
        const allReportRooms = await prisma.cleaningReportRoom.findMany({
            where: { reportId: report.reportId },
            select: { roomId: true }
        })
        const validRoomIds = new Set(allReportRooms.map(r => r.roomId))

        console.log("Room ที่สามารถบันทึกผลได้:", [...validRoomIds])

        //สร้าง CleaningResults
        const cleaningResultsData = []
        for (const room of rooms) {
            if (!room.results || !Array.isArray(room.results)) continue

            if (!validRoomIds.has(room.roomId)) {
                console.warn(`Room ID ${room.roomId} is not linked to CleaningReportRoom, skipping...`)
                continue
            }

            for (const result of room.results) {
                cleaningResultsData.push({
                    reportId: report.reportId,
                    roomId: room.roomId,
                    itemId: result.itemId,
                    cleaningStatus: result.cleaningStatus || 'NORMAL',
                    description: result.description || ""
                })
            }
        }


        console.log("CleaningResults ที่จะบันทึก:", JSON.stringify(cleaningResultsData, null, 2))

        if (cleaningResultsData.length > 0) {
            try {
                // ใช้ create ทีละรายการ แทน createMany
                for (const result of cleaningResultsData) {
                    await prisma.cleaningResults.create({ data: result })
                }
                console.log("CleaningResults บันทึกสำเร็จ!")
            } catch (error) {
                console.error("Prisma create Error:", error)
            }
        } else {
            console.warn("ไม่มีข้อมูล CleaningResults ที่จะบันทึก")
        }

        // อัปเดตสถานะ `CleaningRequest` เป็น "เสร็จแล้ว"
        await prisma.cleaningRequest.update({
            where: { requestId },
            data: { cleaningRequestStatus: 'COMPLETED' }
        })

        //ดึงข้อมูลรายงานที่อัปเดต
        const updatedReport = await prisma.cleaningReport.findUnique({
            where: { reportId: report.reportId },
            include: {
                CleaningReportRoom: {
                    include: { CleaningResults: true }
                }
            }
        })
        console.log("รายงานที่อัปเดต:", JSON.stringify(updatedReport, null, 2))

        res.json({ message: "Cleaning report updated successfully", report: updatedReport })
    } catch (err) {
        console.error("Error:", err)
        return res.status(500).json({ message: "Server error", error: err.message })
    }
}


//สำหรับแม่บ้าน
exports.listCleaningReport = async (req, res) => {
    try {
        const { userId } = req.user // ได้จาก authCheck middleware

        // ค้นหา housekeeping ที่ดูแลชั้นไหน
        const housekeeping = await prisma.user.findFirst({
            where: {
                userId,
                userRole: 'housekeeping'
            },
            select: {
                userId: true,
                assignedFloor: true
            }
        })

        if (!housekeeping) {
            return res.status(404).json({ message: "ไม่พบข้อมูลพนักงานทำความสะอาด" })
        }

        const housekeepingFloor = housekeeping.assignedFloor //ชั้นที่รับผิดชอบ

        //ดึงข้อมูล
        const cleaningReport = await prisma.cleaningReport.findMany({
            where: {
                CleaningReportRoom: {
                    some: {
                        room: {
                            floor: housekeepingFloor //เฉพาะห้องที่อยู่ในชั้นที่พนักงานดูแล
                        }
                    }
                }
            },
            include: {
                user: {
                    include: {
                        user: {
                            select: {
                                prefix: true,
                                userName: true,
                                userSurName: true,
                                userNumPhone: true
                            }
                        }
                    }
                }
            },
            orderBy: { reportAt: "desc" },
        })

        // console.log(cleaningReport)
        res.json(cleaningReport)

    } catch (err) {
        console.error("Error:", err)
        return res.status(500).json({ message: "Server error", error: err.message })
    }
}

exports.readCleaningReport = async (req, res) => {
    try {
        const { id } = req.params

        const report = await prisma.cleaningReport.findUnique({
            where: { reportId: Number(id) },
            include: {
                CleaningReportRoom: {
                    include: {
                        room: true // ดึงข้อมูลห้องมาด้วย
                    }
                },
                CleaningResults: {
                    include: {
                        cleaningList: true, // ดึงข้อมูลรายการที่ทำความสะอาด
                        cleaningStatus: true // ดึงสถานะการทำความสะอาด
                    }
                },
                user: {
                    select: {
                        user: {
                            select: {
                                prefix: true,
                                userName: true,
                                userSurName: true,
                                userNumPhone: true
                            }
                        }
                    }
                }
            }
        })

        if (!report) {
            return res.status(404).json({ message: "ไม่พบใบรายงานผลทำความสะอาด" })
        }
        // console.log(report)

        res.json(report)
    } catch (err) {
        console.error("Error:", err)
        return res.status(500).json({ message: "Server error", error: err.message })
    }
}


//
exports.allListCleaningReport = async (req, res) => {
    try {
        const cleaningReport = await prisma.cleaningReport.findMany({
            include: {
                user: {
                    include: {
                        user: {
                            select: {
                                prefix: true,
                                userName: true,
                                userSurName: true,
                                userNumPhone: true
                            }
                        }
                    }
                },
                cleaningReportStatus: true,
                CleaningResults: {
                    include: {
                        cleaningList: true,  // ดึงข้อมูลรายการที่ทำความสะอาด
                        cleaningStatus: true // ดึงสถานะการทำความสะอาด
                    }
                }
            },
            orderBy: { reportAt: "desc" }
        })
        // console.log(cleaningReport)
        res.json(cleaningReport)
    } catch (err) {
        console.error("Error:", err)
        return res.status(500).json({ message: "Server error", error: err.message })
    }
}

exports.noteReport = async (req, res) => {
    try {
        const { userId } = req.user
        const { reportId } = req.body
        console.log(reportId)

        if (!reportId) {
            return res.status(400).json({ message: "กรุณาระบุใบรายงานการทำความสะอาด" })
        }

        const report = await prisma.cleaningReport.findFirst({
            where: {
                reportId: Number(reportId)
            }
        })

        if (!report) {
            return res.status(404).json({ message: "ไม่พบข้อมูลใบรายงานการทำความสะอาด" })
        }

        const front = await prisma.user.findFirst(
            {
                where: {
                    userId
                }
            }
        )

        if (!front) {
            return res.status(403).json({ message: "User is not authorized for front" })
        }

        const noted = await prisma.cleaningReport.update({
            where: {
                reportId: Number(reportId)
            },
            data: {
                cleaningReportStatus: 'CHECKED',
                userId: front.userId
            }
        })
        res.json(noted)
    } catch (err) {
        console.error("Error:", err)
        return res.status(500).json({ message: "Server error", error: err.message })
    }
}

exports.noteRequest = async (req, res) => {
    try {
        const { userId } = req.user
        const { requestId } = req.body

        if (!requestId) {
            return res.status(400).json({ message: "กรุณาระบุใบแจ้งทำความสะอาด" })
        }

        const request = await prisma.cleaningRequest.findFirst({
            where: {
                requestId: Number(requestId)
            }
        })

        if (!request) {
            return res.status(404).json({ message: "ไม่พบข้อมูลใบแจ้งทำความสะอาด" })
        }

        const housekeeping = await prisma.user.findFirst({
            where: {
                userId
            }
        })

        if (!housekeeping) {
            return res.status(403).json({ message: "User is not authorized for housekeeping" })
        }

        const noted = await prisma.cleaningRequest.update({
            where: {
                requestId: Number(requestId)
            },
            data: {
                userId: housekeeping.userId,
                cleaningRequestStatus: 'IN_PROGRESS'
            }
        })

        res.json(noted)

    } catch (err) {
        console.error("Error:", err)
        return res.status(500).json({ message: "Server error", error: err.message })
    }
}




