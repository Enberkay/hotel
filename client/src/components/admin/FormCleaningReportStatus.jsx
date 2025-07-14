import React, { useEffect, useState } from "react"
import { createCleaningReportStatus } from "../../api/cleaningReportStatus"
import useHotelStore from "../../store/hotel-store"
import { toast } from "react-toastify"

const cleaningStatusList = ["รอการตรวจสอบ", "ตรวจสอบแล้ว", "ถูกแจ้งซ่อม"]

const FormCleaningReportStatus = () => {
    const token = useHotelStore((state) => state.token)
    const cleaningReportStatuses = useHotelStore((state) => state.cleaningReportStatuses)
    const getCleaningReportStatus = useHotelStore((state) => state.getCleaningReportStatus)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getCleaningReportStatus(token)
    }, [token, getCleaningReportStatus])

    const handleAddNextStatus = async () => {
        if (cleaningReportStatuses.length >= cleaningStatusList.length) return

        setLoading(true)
        const nextStatus = cleaningStatusList[cleaningReportStatuses.length]

        try {
            const res = await createCleaningReportStatus(token, { cleaningReportStatusName: nextStatus })
            await getCleaningReportStatus(token) // รอให้ข้อมูลอัปเดตจริงก่อนเปลี่ยนสี
            toast.success(`เพิ่มสถานะรายงานทำความสะอาด: ${res.data.cleaningReportStatusName}`)
        } catch (err) {
            console.error(err)
            toast.error(err.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มสถานะ")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-4 bg-white shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">สถานะรายงานทำความสะอาด</h1>
            <div className="flex flex-col items-center space-y-4">
                {cleaningStatusList.map((status, index) => (
                    <div
                        key={index}
                        className={`w-64 p-3 rounded-md text-white text-center ${cleaningReportStatuses.some((s) => s.cleaningReportStatusName === status)
                            ? "bg-green-500"
                            : "bg-gray-300"
                            }`}
                    >
                        {status}
                    </div>
                ))}

                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200 disabled:bg-gray-400"
                    onClick={handleAddNextStatus}
                    disabled={cleaningReportStatuses.length >= cleaningStatusList.length || loading}
                >
                    {loading ? "กำลังเพิ่ม..." : "เพิ่มสถานะถัดไป"}
                </button>
            </div>
        </div>
    )
}

export default FormCleaningReportStatus
