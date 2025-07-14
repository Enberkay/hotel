import React, { useEffect, useState } from "react"
import { createCleaningRequestStatus } from "../../api/cleaningRequestStatus"
import useHotelStore from "../../store/hotel-store"
import { toast } from "react-toastify"

const cleaningStatusList = ["รอดำเนินการ", "รับเรื่องแล้ว", "เสร็จแล้ว"]

const FormCleaningRequestStatus = () => {
    const token = useHotelStore((state) => state.token)
    const cleaningRequestStatuses = useHotelStore((state) => state.cleaningRequestStatuses)
    const getCleaningRequestStatus = useHotelStore((state) => state.getCleaningRequestStatus)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getCleaningRequestStatus(token)
    }, [token, getCleaningRequestStatus])

    const handleAddNextStatus = async () => {
        if (cleaningRequestStatuses.length >= cleaningStatusList.length) return

        setLoading(true)
        const nextStatus = cleaningStatusList[cleaningRequestStatuses.length]

        try {
            const res = await createCleaningRequestStatus(token, { cleaningRequestStatusName: nextStatus })
            getCleaningRequestStatus(token)
            toast.success(`เพิ่มสถานะทำความสะอาด: ${res.data.cleaningRequestStatusName}`)
        } catch (err) {
            console.error(err)
            toast.error(err.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มสถานะ")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-4 bg-white shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">สถานะคำร้องขอทำความสะอาด</h1>
            <div className="flex flex-col items-center space-y-4">
                {cleaningStatusList.map((status, index) => (
                    <div
                        key={index}
                        className={`w-64 p-3 rounded-md text-white text-center ${cleaningRequestStatuses.some((s) => s.cleaningRequestStatusName === status) ? "bg-green-500" : "bg-gray-300"
                            }`}
                    >
                        {status}
                    </div>
                ))}

                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200 disabled:bg-gray-400"
                    onClick={handleAddNextStatus}
                    disabled={cleaningRequestStatuses.length >= cleaningStatusList.length || loading}
                >
                    {loading ? "กำลังเพิ่ม..." : "เพิ่มสถานะถัดไป"}
                </button>
            </div>
        </div>
    )
}

export default FormCleaningRequestStatus
