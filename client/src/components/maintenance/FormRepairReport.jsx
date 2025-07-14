import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import dayjs from "dayjs"
import useHotelStore from "../../store/hotel-store"
import { notedRepairRequest, repairReport } from "../../api/repair"

const FormRepairReport = () => {
    const navigate = useNavigate()
    const token = useHotelStore((state) => state.token)
    const repairStatuses = useHotelStore((state) => state.repairStatuses)
    const getRepairStatus = useHotelStore((state) => state.getRepairStatus)
    const getRepairRequest = useHotelStore((state) => state.getRepairRequest)
    const repairRequests = useHotelStore((state) => state.repairRequests)

    const [selectedRequest, setSelectedRequest] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [repairDetails, setRepairDetails] = useState({})

    useEffect(() => {
        getRepairRequest(token)
        getRepairStatus(token)
    }, [token])

    const formatDateTime = (dateString) => {
        return dateString ? dayjs(dateString).format("DD/MM/YYYY HH:mm:ss") : "-"
    }

    const pendingRequests = repairRequests.filter(
        (req) => req.repairRequestStatusId === 1 || req.repairRequestStatusId === 2
    )

    const handleSelectRequest = async (req) => {
        if (window.confirm("Are you sure?")) {
            try {
                await notedRepairRequest(token, req.requestId)
                setSelectedRequest(req)
                setIsModalOpen(false)
                toast.success("เลือกใบแจ้งซ่อมแล้ว!")
            } catch (error) {
                console.error("เกิดข้อผิดพลาด:", error)
                toast.error("ไม่สามารถเลือกใบแจ้งซ่อมได้")
            }
        }
    }

    const handleOnChange = (e, roomId, field) => {
        setRepairDetails((prevDetails) => ({
            ...prevDetails,
            [roomId]: {
                ...prevDetails[roomId],
                [field]: e.target.value,
            },
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!selectedRequest) {
            toast.error("กรุณาเลือกใบแจ้งซ่อมก่อน")
            return
        }

        const repairData = {
            requestId: selectedRequest.requestId,
            rooms: selectedRequest.RepairRequestRoom.map((detail) => ({
                roomId: detail.room.roomId,
                description: repairDetails[detail.room.roomId]?.description || "",
                repairStatusId: repairDetails[detail.room.roomId]?.repairStatusId || "",
            })),
        }

        try {
            await repairReport(token, repairData.requestId, repairData.rooms)
            toast.success("บันทึกใบรายงานสำเร็จ!")
            navigate("/maintenance")
        } catch (error) {
            console.error("Error:", error)
            toast.error("เกิดข้อผิดพลาดในการส่งข้อมูล")
        }
    }

    return (
        <div className="mt-14 md:max-w-4xl md:mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-semibold mb-4 text-center">
                ทำใบรายงานการซ่อม
            </h1>

            {!selectedRequest && (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition block mx-auto"
                >
                    เลือกใบแจ้งซ่อม
                </button>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                        <h2 className="text-xl font-semibold mb-4 text-center">เลือกใบแจ้งซ่อม</h2>
                        <ul className="border p-4 rounded-lg bg-gray-100 max-h-60 overflow-auto">
                            {pendingRequests.length === 0 ? (
                                <p className="text-gray-500 text-center">ไม่มีใบแจ้งที่รออยู่</p>
                            ) : (
                                pendingRequests.map((req) => (
                                    <li
                                        key={req.requestId}
                                        className={`p-3 border-b last:border-none cursor-pointer hover:bg-gray-200 ${req.repairRequestStatusId === 2 ? "bg-yellow-100" : ""
                                            }`}
                                        onClick={() => handleSelectRequest(req)}
                                    >
                                        <span className="font-semibold">หมายเลข:</span> {req.requestId} |
                                        <span className="ml-2 font-semibold">แจ้งเมื่อ:</span> {formatDateTime(req.requestAt)}
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

            {selectedRequest && (
                <form onSubmit={handleSubmit}>
                    <div className="border p-4 rounded-lg bg-gray-100 mt-4">
                        <p><span className="font-semibold">หมายเลขใบแจ้ง:</span> {selectedRequest.requestId}</p>
                        <p><span className="font-semibold">เวลาที่แจ้ง:</span> {formatDateTime(selectedRequest.requestAt)}</p>
                    </div>

                    <h2 className="text-lg font-semibold mt-4 mb-2">รายละเอียดห้อง</h2>

                    {selectedRequest.RepairRequestRoom.map((detail, index) => (
                        <div key={index} className="mb-4">
                            <p><span className="font-semibold">ห้องหมายเลข:</span> {detail.room.roomNumber}</p>
                            <p><span className="font-semibold">ชั้น:</span> {detail.room.floor}</p>
                            <p><span className="font-semibold">รายละเอียด:</span> {detail.description || "ไม่มีรายละเอียด"}</p>

                            <select
                                className="border"
                                name="repairStatusId"
                                required
                                value={repairDetails[detail.room.roomId]?.repairStatusId || ""}
                                onChange={(e) => handleOnChange(e, detail.room.roomId, "repairStatusId")}
                            >
                                <option value="" disabled>โปรดเลือก</option>
                                {repairStatuses.map((item, index) => (
                                    <option key={index} value={item.repairStatusId}>
                                        {item.repairStatusName}
                                    </option>
                                ))}
                            </select>

                            <label className="block mt-2 font-semibold">เขียนรายละเอียด:</label>
                            <input
                                className="border w-full p-2 rounded-md"
                                type="text"
                                value={repairDetails[detail.room.roomId]?.description || ""}
                                onChange={(e) => handleOnChange(e, detail.room.roomId, "description")}
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="bg-green-600 text-white py-2 px-4 rounded-md mt-4 hover:bg-green-700 w-full"
                    >
                        ส่งใบรายงาน
                    </button>
                </form>
            )}
        </div>
    )
}

export default FormRepairReport
