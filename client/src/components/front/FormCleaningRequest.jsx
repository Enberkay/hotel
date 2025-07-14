import React, { useState, useEffect } from "react"
import useHotelStore from "../../store/hotel-store"
import { Star, BedDouble, BedSingle, Bed, Trash2, Edit } from "lucide-react"
import { toast } from "react-toastify"
import { cleaningRequest } from "../../api/cleaning"
import { useLocation } from "react-router-dom"

const FormCleaningRequest = () => {
  const location = useLocation()
  const state = location.state
  const token = useHotelStore((state) => state.token)
  const getRoom = useHotelStore((state) => state.getRoom)
  const rooms = useHotelStore((state) => state.rooms)

  // State สำหรับเก็บห้องที่ถูกเลือก
  const [selectedRooms, setSelectedRooms] = useState([])
  // State สำหรับเก็บคำอธิบาย
  const [editingRoom, setEditingRoom] = useState(null)
  const [description, setDescription] = useState("")

  // เมื่อ component โหลด ให้ดึงข้อมูลห้องพักถ้ามี token
  useEffect(() => {
    if (token) getRoom(token)
  }, [token])

  // ห้องที่เพิ่ง Check-Out จะถูกเพิ่มอัตโนมัติ
  useEffect(() => {
    if (state?.roomId && state?.roomNumber && state.floor) {
      // ตรวจสอบว่าห้องนี้เคยถูกเพิ่มไปแล้วหลังจากรีเฟรชหรือไม่

      console.log(state?.roomId, state?.roomNumber, state.floor)
      const cleanedRooms = JSON.parse(
        sessionStorage.getItem("cleanedRooms") || "[]"
      )

      if (!cleanedRooms.includes(state.roomId)) {
        setSelectedRooms((prev) => [
          ...prev,
          {
            roomId: state.roomId,
            roomNumber: state.roomNumber,
            floor: state.floor,
            description: "",
          },
        ])
        toast.info(`ห้องที่ Check-Out เมื่อกี้คือ ${state.roomNumber}`)

        // บันทึกห้องที่ถูกเพิ่มไปแล้วเพื่อป้องกันการเพิ่มซ้ำหลังจากรีเฟรช
        sessionStorage.setItem(
          "cleanedRooms",
          JSON.stringify([...cleanedRooms, state.roomId])
        )
      }
    }
  }, [state])

  // ฟังก์ชันเลือกห้อง -> เพิ่มห้องเข้าไปใน selectedRooms ถ้ายังไม่ถูกเลือก
  const handleSelectRoom = (room) => {
    if (selectedRooms.length > 0) {
      // ตรวจสอบว่าห้องใหม่อยู่ชั้นเดียวกับห้องที่เลือกอยู่แล้ว
      const selectedFloors = new Set(selectedRooms.map((r) => r.floor))
      if (!selectedFloors.has(room.floor)) {
        return toast.error(`กรุณาเลือกห้องที่อยู่ชั้นเดียวกัน`)
      }
    }

    setSelectedRooms((prev) =>
      prev.some((r) => r.roomId === room.roomId)
        ? prev
        : [...prev, { ...room, description: "" }]
    )
  }


  const handleEditDescription = (room) => {
    setEditingRoom(room)
    setDescription(room.description || "")
  }

  const saveDescription = () => {
    setSelectedRooms((prev) =>
      prev.map((r) =>
        r.roomId === editingRoom.roomId ? { ...r, description } : r
      )
    )
    setEditingRoom(null)
    setDescription("")
  }

  const handleRemoveRoom = (roomId) => {
    setSelectedRooms((prev) => prev.filter((room) => room.roomId !== roomId))
  }

  const handleSubmit = async () => {
    if (selectedRooms.length === 0) {
      return toast.error("กรุณาเลือกห้องก่อนส่งคำขอ")
    }
    try {
      await cleaningRequest(token, selectedRooms)
      toast.success("ส่งคำขอทำความสะอาดสำเร็จ!")
      getRoom(token)
      setSelectedRooms([])
    } catch (error) {
      console.error(error)
      toast.error("เกิดข้อผิดพลาดในการส่งคำขอ")
    }
  }

  // จัดกลุ่มห้องตามชั้น
  const groupedRooms = rooms.reduce((acc, room) => {
    const floor = room.floor || "Unknown Floor"
    if (!acc[floor]) acc[floor] = []
    acc[floor].push(room)
    return acc
  }, {})

  // สีของสถานะห้อง
  const statusColors = {
    1: "bg-green-500", // ว่าง
    2: "bg-gray-500", // มีคนเข้าพัก
    3: "bg-yellow-500", // ติดจอง
    4: "bg-blue-500", // แจ้งทำความสะอาด
    5: "bg-red-500", // แจ้งซ่อม
  }

  return (
    <div className="flex mx-5 mt-5">
      <div className="flex flex-col items-start gap-4">
        {/* แจ้งสี */}
        <div className="flex flex-col gap-2 bg-gray-100 p-4 rounded-lg shadow-lg">
          <p className="text-xs text-black flex items-center gap-2">
            <Star size={20} className="text-green-500" /> ว่าง
          </p>
          <p className="text-xs text-black flex items-center gap-2">
            <Star size={20} className="text-gray-500" /> มีคนเข้าพัก
          </p>
          <p className="text-xs text-black flex items-center gap-2">
            <Star size={20} className="text-yellow-500" /> ติดจอง
          </p>
          <p className="text-xs text-black flex items-center gap-2">
            <Star size={20} className="text-blue-500" /> แจ้งทำความสะอาด
          </p>
          <p className="text-xs text-black flex items-center gap-2">
            <Star size={20} className="text-red-500" /> แจ้งซ่อม
          </p>
        </div>

        {/* แจ้งไอคอนเตียง */}
        <div className="flex flex-col gap-2 bg-gray-100 p-4 rounded-lg shadow-lg">
          <p className="text-xs text-black flex items-center gap-2">
            <BedDouble size={20} className="text-black" /> Standard (เตียงคู่)
          </p>
          <p className="text-xs text-black flex items-center gap-2">
            <BedSingle size={20} className="text-black" /> Standard (เตียงเดี่ยว)
          </p>
          <p className="text-xs text-black flex items-center gap-2">
            <Bed size={20} className="text-black" /> Signature
          </p>
        </div>
      </div>

      {/* รายการห้องพักที่สามารถเลือกได้ */}
      <div className="flex-1 p-5 grid grid-cols-2 gap-5">
        {Object.keys(groupedRooms).map((floor) => (
          <div key={floor} className="mb-6 text-center">
            <h2 className="text-lg font-bold mb-3">ชั้น {floor}</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {groupedRooms[floor].map((room) => {
                const roomTypeName = room.roomType?.roomTypeName || ""
                const roomIcon = roomTypeName.includes("เตียงเดี่ยว")
                  ? BedSingle
                  : roomTypeName.includes("เตียงคู่")
                    ? BedDouble
                    : Bed
                const roomStatusColor =
                  statusColors[room.roomStatusId] || "bg-gray-300"

                // ตรวจสอบว่าห้องถูกเลือกหรือไม่
                const isSelected = selectedRooms.some(
                  (r) => r.roomId === room.roomId
                )
                const isDisabled = room.roomStatusId === 4

                return (
                  <button
                    key={room.roomId}
                    className={`flex flex-col items-center justify-center w-20 h-20 rounded-lg shadow-md text-white 
                                ${roomStatusColor} 
                                ${isSelected
                        ? "border-4 border-yellow-500"
                        : "border border-transparent"
                      }
                                ${isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                      }`}
                    onClick={() => !isDisabled && handleSelectRoom(room)}
                    disabled={isDisabled}
                  >
                    {React.createElement(roomIcon, { size: 32 })}
                    <p className="text-sm font-semibold">{room.roomNumber}</p>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex mt-5">
        <div className="w-72 bg-gray-100 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-3">ห้องที่เลือก</h2>
          <div className="space-y-3">
            {selectedRooms.length > 0 ? (
              selectedRooms.map((room) => (
                <div
                  key={room.roomId}
                  className="flex items-center justify-between bg-white p-2 rounded-lg shadow"
                >
                  <span className="text-sm font-semibold">{room.roomNumber}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditDescription(room)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleRemoveRoom(room.roomId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">ยังไม่ได้เลือกห้อง</p>
            )}
          </div>
          <button
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={selectedRooms.length === 0}
          >
            🧹 ส่งคำขอทำความสะอาด
          </button>
          {editingRoom && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-bold mb-3">
                  เพิ่มรายละเอียดสำหรับห้อง {editingRoom.roomNumber}
                </h3>
                <textarea
                  className="w-full p-2 border rounded-lg"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="เพิ่มรายละเอียด..."
                ></textarea>
                <div className="mt-3 flex justify-end gap-3">
                  <button
                    onClick={() => setEditingRoom(null)}
                    className="px-3 py-1 bg-gray-300 rounded-lg"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={saveDescription}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FormCleaningRequest
