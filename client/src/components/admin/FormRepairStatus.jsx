import React, { useEffect, useState } from "react"
import { createRepairStatus } from "../../api/repairStatus"
import { toast } from "react-toastify"
import useHotelStore from "../../store/hotel-store"

const repairStatusList = ["ซ่อมแล้ว", "ยังมีปัญหา(ไม่สามารถซ่อมได้)"]

const FormRepairStatus = () => {
    const token = useHotelStore((state) => state.token)
    const repairStatuses = useHotelStore((state) => state.repairStatuses)
    const getRepairStatus = useHotelStore((state) => state.getRepairStatus)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getRepairStatus(token)
    }, [token, getRepairStatus])

    const handleAddNextStatus = async () => {
        if (repairStatuses.length >= repairStatusList.length) return

        setLoading(true)
        const nextStatus = repairStatusList[repairStatuses.length]

        try {
            const res = await createRepairStatus(token, { repairStatusName: nextStatus })
            getRepairStatus(token)
            toast.success(`เพิ่มสถานะ: ${res.data.repairStatusName}`)
        } catch (err) {
            console.error(err)
            toast.error(err.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มสถานะ")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-4 bg-white shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">สถานะการซ่อม</h1>
            <div className="flex flex-col items-center space-y-4">
                {repairStatusList.map((status, index) => (
                    <div
                        key={index}
                        className={`w-64 p-3 rounded-md text-white text-center ${repairStatuses.some((s) => s.repairStatusName === status) ? "bg-green-500" : "bg-gray-300"
                            }`}
                    >
                        {status}
                    </div>
                ))}

                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200 disabled:bg-gray-400"
                    onClick={handleAddNextStatus}
                    disabled={repairStatuses.length >= repairStatusList.length || loading}
                >
                    {loading ? "กำลังเพิ่ม..." : "เพิ่มสถานะถัดไป"}
                </button>
            </div>
        </div>
    )
}

export default FormRepairStatus
