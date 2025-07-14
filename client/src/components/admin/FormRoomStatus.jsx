import React, { useEffect, useState } from "react"
import { createRoomStatus } from "../../api/roomStatus"
import useHotelStore from "../../store/hotel-store"
import { toast } from "react-toastify"

const roomStatusList = ["พร้อมให้จอง", "มีคนพักอยู่", "ถูกจอง", "กำลังทำความสะอาด", "กำลังปรับปรุง"]

const FormRoomStatus = () => {
  const token = useHotelStore((state) => state.token)
  const roomStatuses = useHotelStore((state) => state.roomStatuses)
  const getRoomStatus = useHotelStore((state) => state.getRoomStatus)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getRoomStatus(token)
  }, [token, getRoomStatus])

  const handleAddNextStatus = async () => {
    if (roomStatuses.length >= roomStatusList.length) return

    setLoading(true)
    const nextStatus = roomStatusList[roomStatuses.length]

    try {
      const res = await createRoomStatus(token, { roomStatusName: nextStatus })
      getRoomStatus(token)
      toast.success(`เพิ่มสถานะห้อง: ${res.data.roomStatusName}`)
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มสถานะ")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow-md text-center">
      <h1 className="text-2xl font-bold mb-4">สถานะห้อง</h1>
      <div className="flex flex-col items-center space-y-4">
        {roomStatusList.map((status, index) => (
          <div
            key={index}
            className={`w-64 p-3 rounded-md text-white text-center ${roomStatuses.some((s) => s.roomStatusName === status) ? "bg-green-500" : "bg-gray-300"
              }`}
          >
            {status}
          </div>
        ))}

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200 disabled:bg-gray-400"
          onClick={handleAddNextStatus}
          disabled={roomStatuses.length >= roomStatusList.length || loading}
        >
          {loading ? "กำลังเพิ่ม..." : "เพิ่มสถานะถัดไป"}
        </button>
      </div>
    </div>
  )
}

export default FormRoomStatus
