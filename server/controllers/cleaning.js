const prisma = require("../config/prisma")

exports.cleaningRequest = async (req, res) => {
    try {
        const { userId } = req.user // ดึง userId จาก JWT Token
        const { rooms } = req.body // รับข้อมูลห้องที่ต้องทำความสะอาด

        // console.log("Check : ", rooms)

        if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
            return res
                .status(400)
                .json({ message: "กรุณาระบุห้องที่ต้องทำความสะอาด" })
        }

        // ค้นหา frontId จากตาราง Front ตาม userId
        const front = await prisma.front.findUnique({
            where: { userId },
        })

        if (!front) {
            return res
                .status(403)
                .json({ message: "Unauthorized: User is not a front desk staff" })
        }

        const frontId = front.frontId // ใช้ frontId ที่หาได้จาก userId

        // ใช้ transaction เพื่อให้แน่ใจว่าทั้งการสร้าง request และการอัปเดตห้องสำเร็จพร้อมกัน
        const result = await prisma.$transaction(async (prisma) => {
            // สร้างคำขอทำความสะอาด
            const cleaningRequest = await prisma.cleaningRequest.create({
                data: {
                    frontId,
                    cleaningRequestStatusId: 1, // Pending
                    CleaningRequestRoom: {
                        create: rooms.map(({ roomId, description }) => ({
                            roomId,
                            description: description || null,
                        })),
                    },
                },
                include: { CleaningRequestRoom: true },
            })

            // อัปเดตสถานะของห้องที่ส่งคำขอให้เป็น `4` (แจ้งทำความสะอาด)
            await prisma.room.updateMany({
                where: {
                    roomId: { in: rooms.map(({ roomId }) => roomId) },
                },
                data: {
                    roomStatusId: 4, // แจ้งทำความสะอาด
                },
            })

            return cleaningRequest
        })
        console.log(result)

        res.status(201).json({
            message: "สร้างคำขอทำความสะอาดสำเร็จ และอัปเดตสถานะห้องแล้ว",
            cleaningRequest: result,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

exports.listCleaningRequest = async (req, res) => {
    try {
        const { userEmail } = req.user // ได้จาก authCheck middleware

        // ค้นหา housekeeping ที่ดูแลชั้นไหน
        const housekeeping = await prisma.housekeeping.findFirst({
            where: {
                user: {
                    userEmail
                }
            },
            select: {
                housekeepingId: true,
                assignedFloor: true
            }
        })

        if (!housekeeping) {
            return res.status(404).json({ message: "ไม่พบข้อมูลพนักงานทำความสะอาด" })
        }

        const housekeepingFloor = housekeeping.assignedFloor

        // ดึงคำขอทำความสะอาดที่เกี่ยวข้องกับชั้นที่พนักงานดูแล
        const cleaningRequests = await prisma.cleaningRequest.findMany({
            where: {
                CleaningRequestRoom: {
                    some: {
                        room: {
                            floor: housekeepingFloor // เฉพาะห้องที่อยู่ในชั้นที่พนักงานดูแล
                        }
                    }
                }
            },
            orderBy: { requestAt: "desc" }, // เรียงตามเวลาที่แจ้งล่าสุด
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
                cleaningRequestStatus: true, // ดึงสถานะของคำขอทำความสะอาด
                front: {
                    include: {
                        user: {
                            select: {
                                userName: true,
                                userSurName: true,
                                prefix: true,
                                userNumPhone: true
                            }
                        }
                    }
                },
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
        const { id } = req.params // รับ ID ของคำขอจาก URL

        // ค้นหาข้อมูลคำขอทำความสะอาดโดยใช้ ID
        const cleaningRequest = await prisma.cleaningRequest.findUnique({
            where: {
                requestId: Number(id) // แปลง ID เป็นตัวเลข
            },
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
                cleaningRequestStatus: true, // ดึงสถานะของคำขอทำความสะอาด
                front: {
                    include: {
                        user: {
                            select: {
                                userName: true,
                                userSurName: true,
                                prefix: true,
                                userNumPhone: true
                            }
                        }
                    }
                },
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

        const housekeeping = await prisma.housekeeping.findFirst({ where: { userId } })
        if (!housekeeping) {
            return res.status(403).json({ message: "User is not authorized for housekeeping" })
        }

        let report = await prisma.cleaningReport.findUnique({ where: { requestId } })
        if (!report) {
            report = await prisma.cleaningReport.create({
                data: {
                    requestId,
                    housekeepingId: housekeeping.housekeepingId,
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
                    cleaningStatusId: result.cleaningStatusId ?? 1,  //ตั้งค่า default ถ้าไม่มีค่า
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
            data: { cleaningRequestStatusId: 3 }
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
        const { userEmail } = req.user // ได้จาก authCheck middleware

        // ค้นหา housekeeping ที่ดูแลชั้นไหน
        const housekeeping = await prisma.housekeeping.findFirst({
            where: {
                user: {
                    userEmail
                }
            },
            select: {
                housekeepingId: true,
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
                housekeeping: {
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
                housekeeping: {
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
                housekeeping: {
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

        const front = await prisma.front.findFirst(
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
                cleaningReportStatusId: 2,
                frontId: front.frontId

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

        const housekeeping = await prisma.housekeeping.findFirst({
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
                housekeepingId: housekeeping.housekeepingId,
                cleaningRequestStatusId: 2
            }
        })

        res.json(noted)

    } catch (err) {
        console.error("Error:", err)
        return res.status(500).json({ message: "Server error", error: err.message })
    }
}




