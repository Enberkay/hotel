import React, { useEffect } from "react"
import useRoomStore from "../../store/room-store"
import { toast } from "react-toastify"
import { useParams, useNavigate, Link } from "react-router-dom"
import { readRoom, updateRoom } from "../../api/room"
import { Undo2 } from "lucide-react"
import { useTranslation } from 'react-i18next';
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const roomFormSchema = z.object({
  roomNumber: z.string()
    .min(3, { message: "room_number_too_short" })
    .max(3, { message: "room_number_too_long" })
    .regex(/^\d{3}$/, { message: "room_number_invalid_format" }),
  floor: z.string().min(1, { message: "select_floor" }),
  roomStatus: z.string().min(1, { message: "select_status" }),
  roomTypeId: z.string().min(1, { message: "select_type" })
}).refine((data) => data.roomNumber[0] === data.floor, {
  message: "room_floor_number_mismatch",
  path: ["roomNumber"]
}).refine((data) => !(data.roomNumber && data.roomNumber[1] === "0" && data.roomNumber[2] === "0"), {
  message: "room_number_ends_with_zero",
  path: ["roomNumber"]
})

const RoomManageEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = useRoomStore((state) => state.token)
  const getRoomType = useRoomStore((state) => state.getRoomType)
  const roomtypes = useRoomStore((state) => state.roomTypes)
  const getRoomStatus = useRoomStore((state) => state.getRoomStatus)
  const roomStatuses = useRoomStore((state) => state.roomStatuses)
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setFocus,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      roomNumber: "",
      roomStatus: "",
      roomTypeId: "",
      floor: ""
    }
  })

  useEffect(() => {
    getRoomType(token)
    getRoomStatus(token)
    const fetchRoom = async () => {
      try {
        const res = await readRoom(token, id)
        const data = res.data
        setValue("roomNumber", data.roomNumber)
        setValue("roomStatus", data.roomStatus)
        setValue("roomTypeId", data.roomTypeId)
        setValue("floor", data.floor)
        setFocus("roomNumber")
      } catch (err) {
        toast.error(t('error_fetch_data'))
      }
    }
    fetchRoom()
  }, [])

  const onSubmit = async (data) => {
    try {
      const res = await updateRoom(token, id, data)
      toast.success(t('edit_room_data_success', { roomNumber: res.data.roomNumber }))
      navigate("/front/room-manage")
    } catch (err) {
      const errMag = err.response?.data?.message
      toast.error(errMag)
    }
  }

  return (
    <div className="m-5 p-6 bg-white shadow-md rounded-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="text-xl font-bold mb-4">{t('edit_room_data')}</h1>

        <div>
          <label htmlFor="roomNumber" className="block text-sm font-semibold mb-1">{t('room_number')}</label>
          <input
            type="number"
            className={`border rounded-md p-2 w-full ${errors.roomNumber ? 'border-red-500' : ''}`}
            placeholder={t('room_number')}
            id="roomNumber"
            autoFocus
            {...register("roomNumber")}
          />
          {errors.roomNumber && (
            <p className="text-red-500 text-xs mt-1">{t(errors.roomNumber.message)}</p>
          )}
        </div>

        <div>
          <label htmlFor="floor" className="block text-sm font-semibold mb-1">{t('floor')}</label>
          <select
            className={`border rounded-md p-2 w-full ${errors.floor ? 'border-red-500' : ''}`}
            id="floor"
            {...register("floor")}
          >
            <option value="" disabled>{t('select_floor')}</option>
            <option value="3">{t('floor_3')}</option>
            <option value="4">{t('floor_4')}</option>
            <option value="5">{t('floor_5')}</option>
            <option value="6">{t('floor_6')}</option>
          </select>
          {errors.floor && (
            <p className="text-red-500 text-xs mt-1">{t(errors.floor.message)}</p>
          )}
        </div>

        <div>
          <label htmlFor="roomStatus" className="block text-sm font-semibold mb-1">{t('room_status')}</label>
          <select
            className={`border rounded-md p-2 w-full ${errors.roomStatus ? 'border-red-500' : ''}`}
            id="roomStatus"
            {...register("roomStatus")}
          >
            <option value="" disabled>{t('select_status')}</option>
            <option value="AVAILABLE">{t('available')}</option>
            <option value="OCCUPIED">{t('occupied')}</option>
            <option value="RESERVED">{t('reserved')}</option>
            <option value="CLEANING">{t('cleaning')}</option>
            <option value="REPAIR">{t('repair')}</option>
          </select>
          {errors.roomStatus && (
            <p className="text-red-500 text-xs mt-1">{t(errors.roomStatus.message)}</p>
          )}
        </div>

        <div>
          <label htmlFor="roomTypeId" className="block text-sm font-semibold mb-1">{t('room_type')}</label>
          <select
            className={`border rounded-md p-2 w-full ${errors.roomTypeId ? 'border-red-500' : ''}`}
            id="roomTypeId"
            {...register("roomTypeId")}
          >
            <option value="" disabled>{t('please_select')}</option>
            {roomtypes.map((item, index) => (
              <option key={index} value={item.roomTypeId}>{t(`${item.name_th}`)}</option>
            ))}
          </select>
          {errors.roomTypeId && (
            <p className="text-red-500 text-xs mt-1">{t(errors.roomTypeId.message)}</p>
          )}
        </div>

        <hr className="my-4" />

        <div className="flex gap-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition disabled:opacity-50" disabled={isSubmitting}>
            {isSubmitting ? t('please_wait') : t('edit_room')}
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