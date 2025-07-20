import React, { useState, useEffect } from "react"
import useRoomStore from "../../store/room-store"
import useAuthStore from "../../store/auth-store"
import { Star, BedDouble, BedSingle, Bed, CircleX } from "lucide-react"
import { changeRoomStatus, groupRoom, ungroupRoom } from "../../api/room"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { useTranslation } from 'react-i18next';

const RoomManage = () => {
  const token = useAuthStore((state) => state.token)
  const getRoom = useRoomStore((state) => state.getRoom)
  const rooms = useRoomStore((state) => state.rooms)
  const { t, i18n } = useTranslation();

  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedPair, setSelectedPair] = useState(null)

  useEffect(() => {
    getRoom(token)
  }, [])

  const pairableRooms = [
    ["315", "316"],
    ["415", "416"],
    ["515", "516"],
    ["615", "616"],
  ]

  const handleGroupRoom = async () => {
    if (!selectedPair) {
      toast.error(t("please_select_pair_to_group"))
      return
    }

    const [room1Number, room2Number] = selectedPair
    const room1 = rooms.find((r) => r.roomNumber === room1Number)
    const room2 = rooms.find((r) => r.roomNumber === room2Number)

    if (!room1 || !room2) {
      toast.error(t("selected_rooms_are_incorrect"))
      return
    }

    try {
      await groupRoom(token, { roomId1: room1.roomId, roomId2: room2.roomId })
      toast.success(t("group_rooms_success", { room1Number, room2Number }))
      setSelectedPair(null)
      getRoom(token)
    } catch (error) {
      toast.error(t("group_rooms_failed"))
    }
  }

  const handleUnGroupRoom = async (room1Number, room2Number) => {
    const room1 = rooms.find((r) => r.roomNumber === room1Number)
    const room2 = rooms.find((r) => r.roomNumber === room2Number)

    if (!room1 || !room2) {
      toast.error(t("selected_rooms_are_incorrect"))
      return
    }

    try {
      await ungroupRoom(token, { roomId1: room1.roomId, roomId2: room2.roomId })
      toast.success(t("ungroup_rooms_success", { room1Number, room2Number }))
      getRoom(token)
    } catch (error) {
      toast.error(t("ungroup_rooms_failed"))
    }
  }

  const groupedRooms = rooms.reduce((acc, room) => {
    const floor = room.floor || "Unknown Floor"
    if (!acc[floor]) acc[floor] = []
    acc[floor].push(room)
    return acc
  }, {})

  const handleStatusChange = (roomId, roomStatus) => {
    const room = rooms.find((r) => r.roomId === roomId)

    if (!room) {
      toast.error(t("selected_room_is_incorrect"))
      return
    }

    // ตรวจสอบว่าห้องนี้เป็นห้องที่ถูก Group หรือไม่ (โดยเช็ค roomTypeId ด้วย)
    let roomIdsToUpdate = [roomId] // เริ่มต้นด้วยห้องที่เลือก

    if (room.roomTypeId === 3) {
      const pairedRoom = pairableRooms.find(
        ([room1, room2]) => room.roomNumber === room1 || room.roomNumber === room2
      )

      if (pairedRoom) {
        const otherRoomNumber = pairedRoom.find((r) => r !== room.roomNumber)
        const otherRoom = rooms.find((r) => r.roomNumber === otherRoomNumber)
        if (otherRoom && otherRoom.roomTypeId === 3) {
          roomIdsToUpdate.push(otherRoom.roomId)
        }
      }
    }

    // แสดง Toast ยืนยันการเปลี่ยนสถานะ
    toast(
      ({ closeToast }) => (
        <div className="text-center">
          <p className="font-semibold">{t("confirm_room_status_change")}</p>
          <div className="flex justify-center gap-3 mt-3">
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              onClick={closeToast}
            >
              {t("cancel")}
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={async () => {
                closeToast()
                try {
                  { console.log(roomIdsToUpdate, roomStatus) }
                  await changeRoomStatus(token, roomIdsToUpdate, roomStatus)
                  toast.success(t("update_success"), { position: "top-center" })
                  getRoom(token)
                } catch (err) {
                  toast.error(t("update_failed"), { position: "top-center" })
                }
              }}
            >
              {t("confirm")}
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false, position: "top-center" }
    )
  }



  return (
    <div className="flex mx-5 mt-5">
      <div className="flex flex-col items-start gap-4">
        {/* แจ้งสี */}
        <div className="flex flex-col gap-2 bg-gray-100 p-4 rounded-lg shadow-lg">
          <p className="text-xs text-black flex items-center gap-2">
            <Star size={20} className="text-green-500" /> {t("available")}
          </p>
          <p className="text-xs text-black flex items-center gap-2">
            <Star size={20} className="text-gray-500" /> {t("occupied")}
          </p>
          <p className="text-xs text-black flex items-center gap-2">
            <Star size={20} className="text-yellow-500" /> {t("reserved")}
          </p>
          <p className="text-xs text-black flex items-center gap-2">
            <Star size={20} className="text-blue-500" /> {t("cleaning")}
          </p>
          <p className="text-xs text-black flex items-center gap-2">
            <Star size={20} className="text-red-500" /> {t("repair")}
          </p>
        </div>

        {/* แจ้งไอคอนเตียง */}
        <div className="flex flex-col gap-2 bg-gray-100 p-4 rounded-lg shadow-lg">
          <p className="text-xs text-black flex items-center gap-2">
            <BedDouble size={20} className="text-black" /> {t("standard_double_bed")}
          </p>
          <p className="text-xs text-black flex items-center gap-2">
            <BedSingle size={20} className="text-black" /> {t("standard_single_bed")}
          </p>
          <p className="text-xs text-black flex items-center gap-2">
            <Bed size={20} className="text-black" /> {t("signature")}
          </p>
        </div>
      </div>

      {/* แสดงห้อง */}
      <div className="flex-1 p-5 grid grid-cols-2 gap-5">
        {Object.keys(groupedRooms).map((floor) => (
          <div key={floor} className="mb-6 text-center">
            <h2 className="text-lg font-bold mb-3">{t("floor", { floor })}</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {groupedRooms[floor].map((room) => {
                const statusColors = {
                  AVAILABLE: "bg-green-500",
                  OCCUPIED: "bg-gray-500",
                  RESERVED: "bg-yellow-500",
                  CLEANING: "bg-blue-500",
                  REPAIR: "bg-red-500",
                }
                const statusColor = statusColors[room.roomStatus] || "bg-black"
                const roomIcon = room.roomType?.roomTypeName.includes(
                  "เตียงเดี่ยว"
                )
                  ? BedSingle
                  : room.roomType?.roomTypeName.includes("เตียงคู่")
                    ? BedDouble
                    : Bed

                return (
                  <button
                    key={room.roomNumber}
                    className={`flex flex-col items-center justify-center w-20 h-20 border rounded-lg shadow-md ${statusColor} hover:bg-opacity-80`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    {React.createElement(roomIcon, {
                      size: 32,
                      className: "text-white",
                    })}
                    <p className="text-sm font-semibold text-white">
                      {room.roomNumber}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>


      <div className="flex mt-5">
        <div className="w-72 bg-gray-100 p-4 rounded-lg shadow-lg">
          <h2 className="text-md font-bold mb-3">{t("select_pair_to_group")}</h2>
          <div className="grid gap-3">
            {pairableRooms.map(([room1, room2]) => {
              const room1Data = rooms.find((r) => r.roomNumber === room1)
              const room2Data = rooms.find((r) => r.roomNumber === room2)
              const isGrouped = room1Data?.roomTypeId === 3 && room2Data?.roomTypeId === 3

              return (
                <div key={`${room1}-${room2}`} className="relative">
                  <button
                    className={`p-3 rounded-lg flex-grow w-full text-white ${selectedPair?.includes(room1) ? "bg-blue-500" : "bg-gray-500"
                      } hover:opacity-80 transition duration-200`}
                    onClick={() => !isGrouped && setSelectedPair([room1, room2])}
                    disabled={isGrouped}
                  >
                    {t("room", { room1, room2 })}
                  </button>
                  {isGrouped && (
                    <button
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 shadow-md"
                      onClick={() => handleUnGroupRoom(room1, room2)}
                    >
                      <CircleX />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          <button
            className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg shadow-md hover:bg-green-600"
            onClick={handleGroupRoom}
            disabled={!selectedPair}
          >
            {t("confirm_group")}
          </button>
        </div>
      </div>



      {/* Popup เลือกสถานะห้อง */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
            <h2 className="text-lg font-bold mb-4 text-center text-gray-700">
              {t("select_room_status", { roomNumber: selectedRoom.roomNumber })}
            </h2>

            {/* ปุ่มเลือกสถานะห้อง พร้อมสีพื้นหลัง */}
            <div className="grid gap-3">
              {Object.entries(statusColors).map(([status, color]) => (
                <button
                  key={status}
                  className={`p-3 rounded-lg ${color} hover:opacity-80 transition duration-200`}
                  onClick={() => {
                    handleStatusChange(selectedRoom.roomId, status)
                    setSelectedRoom(null) // ปิด popup
                  }}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* ปุ่มด้านล่าง */}
            <div className="flex justify-between items-center mt-5">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200"
                onClick={() => setSelectedRoom(null)}
              >
                {t("close")}
              </button>

              <Link
                to={`/front/room-manage/${selectedRoom.roomId}`}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
              >
                {t("edit_room_data")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomManage
