import React, { useState, useEffect } from "react"
import useRoomStore from "../../store/room-store";
import useAuthStore from "../../store/auth-store";
import { Star, BedDouble, BedSingle, Bed, Trash2, Edit } from "lucide-react"
import { toast } from "react-toastify"
import { cleaningRequest } from "../../api/cleaning"
import { useLocation } from "react-router-dom"
import { useTranslation } from 'react-i18next';

const CleaningRequestForm = () => {
  const location = useLocation()
  const state = location.state
  const token = useAuthStore((state) => state.token);
  const getRoom = useRoomStore((state) => state.getRoom);
  const rooms = useRoomStore((state) => state.rooms);
  const { t } = useTranslation(['cleaning', 'room', 'common']);

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
        toast.info(`${t('room_check_out_notification', { roomNumber: state.roomNumber })}`)

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
        return toast.error(`${t('select_rooms_same_floor_error')}`)
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
      return toast.error(`${t('select_room_before_submit_error')}`)
    }
    try {
      await cleaningRequest(token, selectedRooms)
      toast.success(`${t('cleaning_request_success')}`)
      getRoom(token)
      setSelectedRooms([])
    } catch (error) {
      console.error(error)
      toast.error(`${t('cleaning_request_error')}`)
    }
  }

  // จัดกลุ่มห้องตามชั้น
  const groupedRooms = rooms.reduce((acc, room) => {
    const floor = room.floor || "Unknown Floor"
    if (!acc[floor]) acc[floor] = []
    acc[floor].push(room)
    return acc
  }, {})

  // mapping สีของสถานะห้อง
  const statusColors = {
    AVAILABLE: "bg-green-500",
    OCCUPIED: "bg-gray-500",
    RESERVED: "bg-yellow-500",
    CLEANING: "bg-blue-500",
    REPAIR: "bg-red-500",
  }

  return (
    <div className="flex mx-5 mt-5">
      <div className="flex flex-col items-start gap-4">
        {/* แจ้งสี */}
        <div className="flex flex-col gap-2 bg-gray-100 p-4 rounded-lg shadow-lg">
          <p className="text-xs text-black flex items-center gap-2">
            <Star size={20} className="text-green-500" /> {t('cleaning:status_available')}
          </p>
          <p className="text-xs text-black flex items-center gap-2">
            <Star size={20} className="text-gray-500" /> {t('cleaning:status_occupied')}
          </p>
          <p className="text-xs text-black flex items-center gap-2">
            <Star size={20} className="text-yellow-500" /> {t('cleaning:status_reserved')}
          </p>
          <p className="text-xs text-black flex items-center gap-2">
            <Star size={20} className="text-blue-500" /> {t('cleaning:status_cleaning')}
          </p>
          <p className="text-xs text-black flex items-center gap-2">
            <Star size={20} className="text-red-500" /> {t('cleaning:status_repair')}
          </p>
        </div>

        {/* แจ้งไอคอนเตียง */}
        <div className="flex flex-col gap-2 bg-gray-100 p-4 rounded-lg shadow-lg">
          <p className="text-xs text-black flex items-center gap-2">
            <BedDouble size={20} className="text-black" /> {t('room:room_type_standard_double')}
          </p>
          <p className="text-xs text-black flex items-center gap-2">
            <BedSingle size={20} className="text-black" /> {t('room:room_type_standard_single')}
          </p>
          <p className="text-xs text-black flex items-center gap-2">
            <Bed size={20} className="text-black" /> {t('room:room_type_signature')}
          </p>
        </div>
      </div>

      {/* รายการห้องพักที่สามารถเลือกได้ */}
      <div className="flex-1 p-5 grid grid-cols-2 gap-5">
        {Object.keys(groupedRooms).map((floor) => (
          <div key={floor} className="mb-6 text-center">
            <h2 className="text-lg font-bold mb-3">{t('cleaning:floor', { floor })}</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {groupedRooms[floor].map((room) => {
                const roomTypeName = room.roomType?.roomTypeName || ""
                const roomIcon = roomTypeName.includes("เตียงเดี่ยว")
                  ? BedSingle
                  : roomTypeName.includes("เตียงคู่")
                    ? BedDouble
                    : Bed
                const roomStatusColor = statusColors[room.roomStatus] || "bg-gray-300"

                // ตรวจสอบว่าห้องถูกเลือกหรือไม่
                const isSelected = selectedRooms.some(
                  (r) => r.roomId === room.roomId
                )
                const isDisabled = room.roomStatus === 'CLEANING'

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
          <h2 className="text-lg font-bold mb-3">{t('cleaning:selected_rooms')}</h2>
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
              <p className="text-gray-500 text-sm">{t('cleaning:no_rooms_selected')}</p>
            )}
          </div>
          <button
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={selectedRooms.length === 0}
          >
            {t('cleaning:submit_cleaning_request')}
          </button>
          {editingRoom && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-bold mb-3">
                  {t('cleaning:add_room_description', { roomNumber: editingRoom.roomNumber })}
                </h3>
                <textarea
                  className="w-full p-2 border rounded-lg"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('cleaning:add_description_placeholder')}
                ></textarea>
                <div className="mt-3 flex justify-end gap-3">
                  <button
                    onClick={() => setEditingRoom(null)}
                    className="px-3 py-1 bg-gray-300 rounded-lg"
                  >
                    {t('common:cancel')}
                  </button>
                  <button
                    onClick={saveDescription}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                  >
                    {t('common:save')}
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

export default CleaningRequestForm
