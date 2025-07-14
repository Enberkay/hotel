import React, { useEffect, useState } from "react"
import { createRepairRequestStatus } from "../../api/repairRequestStatus"
import { toast } from "react-toastify"
import useHotelStore from "../../store/hotel-store"

const repairStatusList = ["รอดำเนินการ", "รับเรื่องแล้ว", "เสร็จแล้ว"]

const FormRepairRequestStatus = () => {
    const token = useHotelStore((state) => state.token)
    const repairRequestStatuses = useHotelStore((state) => state.repairRequestStatuses)
    const getRepairRequestStatus = useHotelStore((state) => state.getRepairRequestStatus)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getRepairRequestStatus(token)
    }, [token, getRepairRequestStatus])

    const handleAddNextStatus = async () => {
        if (repairRequestStatuses.length >= repairStatusList.length) return

        setLoading(true)
        const nextStatus = repairStatusList[repairRequestStatuses.length]

        try {
            const res = await createRepairRequestStatus(token, { repairRequestStatusName: nextStatus })
            getRepairRequestStatus(token)
            toast.success(`เพิ่มสถานะ: ${res.data.repairRequestStatusName}`)
        } catch (err) {
            console.error(err)
            toast.error(err.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มสถานะ")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-4 bg-white shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">สถานะคำขอซ่อม</h1>
            <div className="flex flex-col items-center space-y-4">
                {repairStatusList.map((status, index) => (
                    <div
                        key={index}
                        className={`w-64 p-3 rounded-md text-white text-center ${repairRequestStatuses.some((s) => s.repairRequestStatusName === status) ? "bg-green-500" : "bg-gray-300"
                            }`}
                    >
                        {status}
                    </div>
                ))}

                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200 disabled:bg-gray-400"
                    onClick={handleAddNextStatus}
                    disabled={repairRequestStatuses.length >= repairStatusList.length || loading}
                >
                    {loading ? "กำลังเพิ่ม..." : "เพิ่มสถานะถัดไป"}
                </button>
            </div>
        </div>
    )
}

export default FormRepairRequestStatus
