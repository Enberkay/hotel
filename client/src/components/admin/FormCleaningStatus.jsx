import React, { useEffect, useState } from "react"
import { createCleaningStatus } from "../../api/cleaningStatus"
import { toast } from "react-toastify"
import useHotelStore from "../../store/hotel-store"

const cleaningStatusList = ["ปกติ", "มีปัญหา"]

const FormCleaningStatus = () => {
    const token = useHotelStore((state) => state.token)
    const cleaningStatuses = useHotelStore((state) => state.cleaningStatuses)
    const getCleaningStatus = useHotelStore((state) => state.getCleaningStatus)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getCleaningStatus(token)
    }, [token, getCleaningStatus])

    const handleAddNextStatus = async () => {
        if (cleaningStatuses.length >= cleaningStatusList.length) return

        setLoading(true)
        const nextStatus = cleaningStatusList[cleaningStatuses.length]

        try {
            const res = await createCleaningStatus(token, { cleaningStatusName: nextStatus })
            getCleaningStatus(token)
            toast.success(`เพิ่มสถานะ: ${res.data.cleaningStatusName}`)
        } catch (err) {
            console.error(err)
            toast.error(err.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มสถานะ")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-4 bg-white shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">สถานะการทำความสะอาด</h1>
            <div className="flex flex-col items-center space-y-4">
                {cleaningStatusList.map((status, index) => (
                    <div
                        key={index}
                        className={`w-64 p-3 rounded-md text-white text-center ${cleaningStatuses.some((s) => s.cleaningStatusName === status) ? "bg-green-500" : "bg-gray-300"
                            }`}
                    >
                        {status}
                    </div>
                ))}

                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200 disabled:bg-gray-400"
                    onClick={handleAddNextStatus}
                    disabled={cleaningStatuses.length >= cleaningStatusList.length || loading}
                >
                    {loading ? "กำลังเพิ่ม..." : "เพิ่มสถานะถัดไป"}
                </button>
            </div>
        </div>
    )
}

export default FormCleaningStatus
