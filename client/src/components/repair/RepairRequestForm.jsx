import dayjs from "dayjs"
import { allListCleaningReport, readCleaningReport } from "../../api/cleaning"
import useAuthStore from "../../store/auth-store"
import { useState, useEffect, useCallback } from "react"
import { repairRequest } from "../../api/repair"
import { toast } from "react-toastify"

const RepairRequestForm = () => {
    const token = useAuthStore((state) => state.token)
    const [cleaningReports, setCleaningReports] = useState([])
    const [selectedReport, setSelectedReport] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedRooms, setSelectedRooms] = useState([])

    const fetchCleaningReports = useCallback(async () => {
        try {
            const response = await allListCleaningReport(token)
            console.log("API Response:", response.data)
            setCleaningReports(Array.isArray(response.data) ? response.data : [])
        } catch (error) {
            console.error("Error fetching cleaning reports:", error)
            setCleaningReports([])
        }
    }, [token])

    useEffect(() => {
        fetchCleaningReports()
    }, [])

    const fetchReportDetails = async (reportId) => {
        try {
            console.log("Fetching Report Details for ID:", reportId)
            const response = await readCleaningReport(token, reportId)
            console.log("Report Details Response:", response.data)
            setSelectedReport(response.data)
        } catch (error) {
            console.error("Error fetching report details:", error)
        }
    }

    const formatDateTime = (dateString) => {
        return dateString ? dayjs(dateString).format("DD/MM/YYYY HH:mm:ss") : "-"
    }

    const verifiedReports = cleaningReports.filter(report => {
        // ตรวจสอบว่า cleaningReportStatusId เป็น 2
        if (report.cleaningReportStatusId === 2) {
            // ตรวจสอบว่ามี cleaningStatusId เป็น 2 ใน CleaningResults หรือไม่
            const hasIssue = report.CleaningResults.some(result => result.cleaningStatus.cleaningStatusId === 2);
            return hasIssue;
        }
        return false;
    });


    //กดเอาห้องจากขวาไปซ้าย
    // ฟังก์ชันเลือกห้อง พร้อมเพิ่มทุกรายการตรวจสอบของห้องนั้น
    const handleSelectRoom = (roomId, roomNumber, cleaningResults, reportId) => {
        const existingRoom = selectedRooms.find((room) => room.roomId === roomId)

        if (existingRoom) {
            // ถ้าห้องนี้ถูกเลือกแล้ว ให้เอาออก
            setSelectedRooms(selectedRooms.filter((room) => room.roomId !== roomId))
        } else {
            // ถ้ายังไม่ถูกเลือก ให้เพิ่มเข้าไป
            setSelectedRooms([
                ...selectedRooms,
                { roomId, roomNumber, cleaningResults, reportId }  // เพิ่ม reportId ให้แต่ละห้อง
            ])
        }
    }


    // ฟังก์ชันอัปเดตรายละเอียดของห้อง
    const handleUpdateDetail = (roomId, index, newText) => {
        setSelectedRooms((prevRooms) =>
            prevRooms.map((room) =>
                room.roomId === roomId
                    ? {
                        ...room,
                        cleaningResults: room.cleaningResults.map((result, i) =>
                            i === index ? { ...result, description: newText } : result
                        ),
                    }
                    : room
            )
        )
    }

    // ฟังก์ชันลบห้องออกจากรายการ
    const handleRemoveRoom = (roomId) => {
        setSelectedRooms(selectedRooms.filter((room) => room.roomId !== roomId));
    }

    //ลบรายการของในห้องที่ไม่มีปัญหา
    const handleRemoveCleaningResult = (roomId, index) => {
        setSelectedRooms((prevRooms) =>
            prevRooms
                .map((room) =>
                    room.roomId === roomId
                        ? {
                            ...room,
                            cleaningResults: room.cleaningResults.filter((_, i) => i !== index),
                        }
                        : room
                )
                .filter((room) => room.cleaningResults.length > 0) // ถ้าไม่มีรายการตรวจสอบเหลือเลยให้ลบห้องออกด้วย
        )
    }

    const handleSubmitRepairRequest = async () => {
        if (selectedRooms.length === 0) {
            toast.error("กรุณาเลือกห้องที่ต้องการแจ้งซ่อม")
            return;
        }

        // // ตรวจสอบสถานะของห้องที่ยังไม่ได้แจ้งซ่อม
        // const incompleteRooms = selectedRooms.filter(room => {
        //     return !room.cleaningResults.some(result => result.repairStatus === 'แจ้งซ่อมแล้ว');
        // });

        // if (incompleteRooms.length > 0 && selectedRooms.length > 1) {
        //     toast.error(`แจ้งซ่อมยังไม่ครบ ตอนนี้มีแค่: ${incompleteRooms.map(room => room.roomNumber).join(', ')}`);
        //     return;
        // }


        const repairRequests = {
            reportIds: [...new Set(selectedRooms.map((room) => room.reportId))],  // กรอง reportId ซ้ำ
            rooms: selectedRooms.map((room) => ({
                roomId: room.roomId,
                description: room.cleaningResults
                    .map((result) => `${result.cleaningList.itemName}: ${result.description || "-"}`)
                    .join(", "), // รวม description ของห้อง
            })),
        }

        console.log("ส่งข้อมูลแจ้งซ่อม:", repairRequests)

        try {
            const response = await repairRequest(token, repairRequests.reportIds, repairRequests.rooms) // ส่ง reportIds และ rooms
            console.log("✅ ส่งแจ้งซ่อมสำเร็จ:", response.data)
            toast.success("แจ้งซ่อมสำเร็จ!")
            setSelectedReport(null) // รีเซ็ตใบรายงาน
            setSelectedRooms([]) // ล้างค่าห้องที่เลือก
            fetchCleaningReports()
        } catch (error) {
            console.error("แจ้งซ่อมไม่สำเร็จ:", error)
            toast.error("เกิดข้อผิดพลาดในการแจ้งซ่อม")
        }
    }






    return (
        <div className="flex h-full">
            {/* Left: Repair Request Form */}
            {/* Left: Selected Rooms & Repair Form */}
            <div className="w-1/2 p-6 bg-gray-100 h-screen overflow-auto touch-pan-y">
                <h2 className="text-xl font-semibold mb-4">แจ้งซ่อม</h2>

                {selectedRooms.length === 0 ? (
                    <p className="text-gray-500">กรุณาเลือกห้องจากรายการทางขวา</p>
                ) : (
                    <ul className="space-y-4">
                        {selectedRooms.map((room) => (
                            <li key={room.roomId} className="p-4 border rounded-lg bg-white shadow ">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">ห้อง: {room.roomNumber}</h3>
                                    <button
                                        onClick={() => handleRemoveRoom(room.roomId)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                                    >
                                        ลบห้อง
                                    </button>
                                </div>

                                {room.cleaningResults.map((result, index) => (
                                    <div key={index} className="mt-2 p-3 border rounded-lg bg-gray-50 shadow">
                                        <div className="flex justify-between items-center">
                                            <p><span className="font-semibold">รายการตรวจสอบ:</span> {result.cleaningList.itemName}</p>
                                            <button
                                                onClick={() => handleRemoveCleaningResult(room.roomId, index)}
                                                className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition"
                                            >
                                                ลบ
                                            </button>
                                        </div>
                                        <p><span className="font-semibold">สถานะ:</span>
                                            <span className="ml-2 px-2 py-1 rounded-lg bg-red-500 text-white">
                                                {result.cleaningStatus.cleaningStatusName}
                                            </span>
                                        </p>
                                        <p><span className="font-semibold">รายละเอียด:</span></p>
                                        <textarea
                                            className="w-full p-2 border rounded-lg"
                                            value={result.description || ""}
                                            onChange={(e) => handleUpdateDetail(room.roomId, index, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </li>
                        ))}
                    </ul>
                )}
                {selectedRooms.length > 0 && (
                    <button
                        onClick={handleSubmitRepairRequest}
                        className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                        แจ้งซ่อม
                    </button>
                )}

            </div>



            {/* Right: Cleaning Reports */}
            <div className="w-1/2 p-6 bg-white shadow-lg overflow-auto touch-pan-y ">
                <h2 className="text-xl font-semibold mb-4 text-center">ใบรายงานผลทำความสะอาด</h2>

                {!selectedReport && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition block mx-auto"
                    >
                        เลือกใบรายงานผล
                    </button>
                )}

                {selectedReport && (
                    <div className="border p-4 rounded-lg bg-gray-100 mt-4">
                        <p><span className="font-semibold">หมายเลขใบรายงาน:</span> {selectedReport.reportId}</p>
                        <p><span className="font-semibold">รายงานเมื่อ:</span> {formatDateTime(selectedReport.reportAt)}</p>

                        {/* Loop CleaningResults with cleaningStatusId === 2 */}
                        <h3 className="text-lg font-semibold mt-4">รายละเอียดการตรวจสอบ:</h3>

                        {/* ปรับโค้ดในรายการ CleaningResults */}
                        <ul className="mt-2 space-y-2">
                            {selectedReport.CleaningResults.filter(result => result.cleaningStatusId === 2).reduce((acc, result) => {
                                const roomInfo = selectedReport.CleaningReportRoom.find(room => room.roomId === result.roomId)
                                const roomNumber = roomInfo ? roomInfo.room.roomNumber : "ไม่ทราบหมายเลขห้อง"
                                const reportId = roomInfo ? roomInfo.reportId : undefined;  // ดึง reportId

                                // ค้นหาว่าห้องนี้เคยถูกเพิ่มไปใน acc หรือยัง
                                const existingRoom = acc.find(room => room.roomId === result.roomId)
                                if (existingRoom) {
                                    existingRoom.cleaningResults.push(result)
                                } else {
                                    acc.push({ roomId: result.roomId, roomNumber, cleaningResults: [result], reportId })  // เพิ่ม reportId ไปที่ห้อง
                                }

                                return acc;
                            }, []).map((room, index) => {
                                const isSelected = selectedRooms.some((r) => r.roomId === room.roomId)

                                return (
                                    <li key={index} className="p-3 border rounded-lg bg-white shadow flex justify-between items-center">
                                        <div>
                                            <p><span className="font-semibold">ห้อง:</span> {room.roomNumber}</p>
                                            {room.cleaningResults.map((result, i) => (
                                                <div key={i} className="mt-2">
                                                    <p><span className="font-semibold">รายการตรวจสอบ:</span> {result.cleaningList.itemName}</p>
                                                    <p><span className="font-semibold">สถานะ:</span>
                                                        <span className="ml-2 px-2 py-1 rounded-lg bg-red-500 text-white">
                                                            {result.cleaningStatus.cleaningStatusName}
                                                        </span>
                                                    </p>
                                                    <p><span className="font-semibold">รายละเอียด:</span> {result.description || '-'}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => handleSelectRoom(room.roomId, room.roomNumber, room.cleaningResults, room.reportId)}  // ส่ง reportId ไปกับการเลือกห้อง
                                            className={`px-3 py-1 rounded-lg transition ${isSelected ? "bg-gray-400 text-white" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                                        >
                                            {isSelected ? "✔" : "+"}
                                        </button>
                                    </li>
                                );
                            })}

                        </ul>


                        {/* ปุ่มเลือกใบใหม่ */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition block mx-auto"
                        >
                            เลือกใบใหม่
                        </button>
                    </div>
                )}




                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                            <h2 className="text-xl font-semibold mb-4 text-center">เลือกใบรายงานผล</h2>
                            <ul className="border p-4 rounded-lg bg-gray-100 max-h-60 overflow-auto">
                                {verifiedReports.length === 0 ? (
                                    <p className="text-gray-500 text-center">ไม่มีใบรายงาน</p>
                                ) : (
                                    verifiedReports.map((report) => (
                                        <li
                                            key={report.reportId}
                                            className="p-3 border-b last:border-none cursor-pointer hover:bg-gray-200"
                                            onClick={() => {
                                                fetchReportDetails(report.reportId)
                                                setIsModalOpen(false)
                                            }}
                                        >
                                            <span className="font-semibold">หมายเลข:</span> {report.reportId} |
                                            <span className="ml-2 font-semibold">แจ้งเมื่อ:</span> {formatDateTime(report.reportAt)}
                                        </li>
                                    ))
                                )}
                            </ul>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition block mx-auto"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RepairRequestForm
