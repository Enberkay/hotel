import React, { useState, useEffect } from "react"
import useRoomStore from "../../store/room-store"
import { toast } from "react-toastify"
import { useParams, useNavigate, Link } from "react-router-dom"
import { readRoom, updateRoom } from "../../api/room"
import { Undo2 } from "lucide-react"
import { useTranslation } from 'react-i18next';


const initalState = {
  roomNumber: "",
  roomStatusId: "",
  roomTypeId: "",
  floor: ""
}


const RoomManageEdit = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  const token = useRoomStore((state) => state.token)
  const getRoomType = useRoomStore((state) => state.getRoomType)
  const roomtypes = useRoomStore((state) => state.roomTypes)
  const getRoomStatus = useRoomStore((state) => state.getRoomStatus)
  const roomStatuses = useRoomStore((state) => state.roomStatuses)
  const { t } = useTranslation();

  const [form, setForm] = useState(initalState)

  useEffect(() => {
    getRoomType(token)
    getRoomStatus(token)
    fetchRoom(token, id, form)
  }, [])

  const fetchRoom = async (token, id, form) => {
    try {
      const res = await readRoom(token, id, form)
      console.log(res)
      setForm(res.data) //รับ data ที่ read มา set ในตัวแปล form

    } catch (err) {
      console.log("Error fetch data", err)
    }
  }

  const handleOnChange = (e) => {
    // console.log(e.target.name, e.target.value)
    // ...form คือ operator spread
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.roomNumber[0] != form.floor) {
      return toast.error(t('room_floor_number_mismatch'))
    }

    if (form.roomNumber.length < 3) {
      return toast.error(t('room_number_too_short'))
    }

    if (form.roomNumber.length > 3) {
      return toast.error(t('room_number_too_long'))
    }

    if (form.roomNumber[0] != form.floor) {
      return toast.error(t('room_floor_number_mismatch'))
    }

    if (form.roomNumber[1] == "0" && form.roomNumber[2] == "0") {
      return toast.error(t('room_number_ends_with_zero'))
    }

    try {
      const res = await updateRoom(token, id, form)
      console.log(res)
      toast.success(t('edit_room_data_success', { roomNumber: res.data.roomNumber }))
      navigate("/front/room-manage")

    } catch (err) {
      console.log(err)
      const errMag = err.response?.data?.message
      toast.error(errMag)
    }

  }

  return (
    <div className="m-5 p-6 bg-white shadow-md rounded-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-xl font-bold mb-4">{t('edit_room_data')}</h1>

        <div>
          <label htmlFor="roomNumber" className="block text-sm font-semibold mb-1">{t('room_number')}</label>
          <input
            type="number"
            className="border rounded-md p-2 w-full"
            value={form.roomNumber}
            onChange={handleOnChange}
            placeholder={t('room_number')}
            name="roomNumber"
            id="roomNumber"
            required
          />
        </div>

        <div>
          <label htmlFor="floor" className="block text-sm font-semibold mb-1">{t('floor')}</label>
          <select
            className="border rounded-md p-2 w-full"
            name="floor"
            onChange={handleOnChange}
            required
            value={form.floor}
            id="floor"
          >
            <option value="" disabled>{t('select_floor')}</option>
            <option value="3">{t('floor_3')}</option>
            <option value="4">{t('floor_4')}</option>
            <option value="5">{t('floor_5')}</option>
            <option value="6">{t('floor_6')}</option>
          </select>
        </div>

        <div>
          <label htmlFor="roomStatus" className="block text-sm font-semibold mb-1">{t('room_status')}</label>
          <select
            className="border rounded-md p-2 w-full"
            name="roomStatus"
            onChange={handleOnChange}
            required
            value={form.roomStatus}
            id="roomStatus"
          >
            <option value="" disabled>{t('select_status')}</option>
            <option value="AVAILABLE">{t('available')}</option>
            <option value="OCCUPIED">{t('occupied')}</option>
            <option value="RESERVED">{t('reserved')}</option>
            <option value="CLEANING">{t('cleaning')}</option>
            <option value="REPAIR">{t('repair')}</option>
          </select>
        </div>

        <div>
          <label htmlFor="roomTypeId" className="block text-sm font-semibold mb-1">{t('room_type')}</label>
          <select
            className="border rounded-md p-2 w-full"
            name="roomTypeId"
            onChange={handleOnChange}
            required
            value={form.roomTypeId}
            id="roomTypeId"
          >
            <option value="" disabled>{t('please_select')}</option>
            {roomtypes.map((item, index) => (
              <option key={index} value={item.roomTypeId}>{t(`${item.name_th}`)}</option>
            ))}
          </select>
        </div>

        <hr className="my-4" />

        <div className="flex gap-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition">
            {t('edit_room')}
          </button>
          <Link
            to={"/front/room-manage"}
            className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600 transition flex items-center"
          >
            <Undo2 className="mr-2" /> {t('back')}
          </Link>
        </div>
      </form>
    </div>

  )
}
export default RoomManageEdit