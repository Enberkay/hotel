const prisma = require("../config/prisma")

exports.repairRequest = async (req, res) => {
    try {
        const { userId } = req.user // ดึง userId จาก JWT Token
        const { reportIds, rooms } = req.body // รับ reportIds แทน reportId

        console.log("รับข้อมูลแจ้งซ่อม:", { reportIds, rooms })

        // ตรวจสอบว่า reportIds มีค่าหรือไม่
        if (!Array.isArray(reportIds) || reportIds.length === 0) {
            return res.status(400).json({ message: "กรุณาระบุ reportIds" })
        }

        // ตรวจสอบว่า rooms มีข้อมูลหรือไม่
        if (!Array.isArray(rooms) || rooms.length === 0) {
            return res.status(400).json({ message: "กรุณาระบุห้องที่แจ้งซ่อม" })
        }

        //ค้นหา frontId จาก userId
        const front = await prisma.front.findUnique({ where: { userId } })
        if (!front) {
            return res.status(403).json({ message: "Unauthorized: User is not a front desk staff" })
        }

        const frontId = front.frontId

        // ใช้ Transaction เพื่อความปลอดภัย
        const repairRequest = await prisma.$transaction(async (prisma) => {
            //1. สร้างใบแจ้งซ่อม
            const newRepairRequest = await prisma.repairRequest.create({
                data: {
                    frontId,
                    repairRequestStatus: 'PENDING',
                    RepairRequestRoom: {
                        create: rooms.map((room) => ({
                            roomId: room.roomId,
                            description: room.description
                        }))
                    }
                },
                include: { RepairRequestRoom: true }
            })

            //2. อัปเดต cleaningReportStatus เป็น 'REPORTED' (ถ้ามี reportIds)
            await prisma.cleaningReport.updateMany({
                where: { reportId: { in: reportIds } },
                data: { cleaningReportStatus: 'REPORTED' }
            })

            return newRepairRequest
        })

        res.status(201).json({
            message: "สร้างใบแจ้งซ่อมสำเร็จ และอัปเดตสถานะรายงานทำความสะอาดแล้ว",
            repairRequest
        })
    } catch (err) {
        console.error("Error:", err)
        res.status(500).json({ message: "Server error" })
    }
}

//list ทั้งหมดเพราะช่างมีคนเดียว (มันแค่แสดงต่อให้มีหลายคนก็ได้)
exports.listRepairRequest = async (req, res) => {
    try {
        const repairRequest = await prisma.repairRequest.findMany({
            include: {
                front: {
                    include: {
                        user: {
                            select: {
                                userName: true,
                                userSurName: true,
                                userNumPhone: true
                            }
                        }
                    }
                },
                repairRequestStatus: {
                    select: {
                        repairRequestStatusId: true,
                        repairRequestStatusName: true
                    }
                },
                // เพิ่มการดึงข้อมูลจาก RepairRequestRoom
                RepairRequestRoom: {
                    include: {
                        room: true, // รวมข้อมูลห้อง
                    }
                }
            },
            orderBy: { requestAt: "desc" }
        })
        res.json(repairRequest)
    } catch (err) {
        console.error("Error:", err)
        return res.status(500).json({ message: "Server error", error: err.message })
    }
}

exports.readRepairRequest = async (req, res) => {
    try {

        const { id } = req.params

        const reportRequest = await prisma.repairRequest.findFirst({

            where: {
                requestId: parseInt(id)
            },
            include: {
                front: {
                    include: {
                        user: {
                            select: {
                                userName: true,
                                userSurName: true,
                                userNumPhone: true
                            }
                        }
                    }
                },
                repairRequestStatus: true,
                RepairRequestRoom: {
                    include: {
                        room: {
                            select: {
                                roomNumber: true,
                                floor: true
                            }
                        }
                    }
                }
            }


        })

        res.json(reportRequest)
    } catch (err) {
        console.error("Error:", err)
        return res.status(500).json({ message: "Server error", error: err.message })
    }
}

exports.noteRepairRequest = async (req, res) => {
    try {
        const { userId } = req.user
        const { requestId } = req.body

        if (!requestId) {
            return res.status(400).json({ message: "กรุณาระบุใบแจ้งซ่อม" })
        }

        const request = await prisma.repairRequest.findFirst({
            where: {
                requestId: Number(requestId)
            }
        })

        if (!request) {
            return res.status(404).json({ message: "ไม่พบข้อมูลใบแจ้งซ่อม" })
        }

        const maintenance = await prisma.maintenance.findFirst({
            where: {
                userId
            }
        })

        if (!maintenance) {
            return res.status(403).json({ message: "User is not authorized for maintenance" })
        }

        const noted = await prisma.repairRequest.update({
            where: {
                requestId: Number(requestId)
            },
            data: {
                maintenanceId: maintenance.maintenanceId,
                repairRequestStatus: 'IN_PROGRESS'
            }
        })

        res.json(noted)

    } catch (err) {
        console.error("Error:", err)
        return res.status(500).json({ message: "Server error", error: err.message })
    }
}

exports.repairReport = async (req, res) => {
    try {
        const { userId } = req.user
        const { rooms, requestId } = req.body

        // ตรวจสอบว่ามี requestId ที่ส่งมาหรือไม่
        if (!requestId) {
            return res.status(400).json({ message: "กรุณาระบุใบแจ้งซ่อม" })
        }

        // ตรวจสอบว่าใบแจ้งซ่อมมีอยู่จริงหรือไม่
        const request = await prisma.repairRequest.findFirst({
            where: {
                requestId: Number(requestId)
            }
        })

        if (!request) {
            return res.status(404).json({ message: "ไม่พบข้อมูลใบแจ้งซ่อม" })
        }

        // ตรวจสอบว่าผู้ใช้มีสิทธิ์ในการทำการบำรุงรักษาหรือไม่
        const maintenance = await prisma.maintenance.findFirst({
            where: {
                userId
            }
        })

        if (!maintenance) {
            return res.status(403).json({ message: "User is not authorized for maintenance" })
        }

        // สร้าง RepairReport ใหม่
        const repairReport = await prisma.repairReport.create({
            data: {
                requestId: Number(requestId),
                maintenanceId: maintenance.maintenanceId,
                frontId: request.frontId,
                // ตั้งวันที่ให้เป็นปัจจุบัน
                reportAt: new Date(),
            }
        })

        // บันทึกข้อมูลแต่ละห้องใน RepairReportRoom
        const repairReportRooms = await prisma.repairReportRoom.createMany({
            data: rooms.map(room => ({
                reportId: repairReport.reportId,
                roomId: room.roomId,
                description: room.description,
                repairStatus: room.repairStatus || 'FIXED',
            }))
        })

        await prisma.repairRequest.update({
            where: {
                requestId: Number(requestId)
            },
            data: {
                repairRequestStatus: 'COMPLETED'
            }
        })

        // ส่งข้อมูลกลับให้ผู้ใช้
        return res.status(201).json({
            message: "บันทึกใบรายงานสำเร็จ!",
            repairReport,
            repairReportRooms
        })

    } catch (err) {
        console.error("Error:", err)
        return res.status(500).json({ message: "Server error", error: err.message })
    }
}

