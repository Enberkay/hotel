import React, { useEffect } from "react"
import useRoomStore from "../../store/room-store"
import { readRoom, updateRoom } from "../../api/room"
import { toast } from "react-toastify"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from 'react-i18next';

const roomFormSchema = z.object({
  roomNumber: z.string()
    .min(3, { message: "room_number_too_short" })
    .max(3, { message: "room_number_too_long" })
    .regex(/^\d{3}$/, { message: "room_number_invalid_format" }),
  floor: z.string().min(1, { message: "select_floor" }),
  roomStatusId: z.string().min(1, { message: "select_status" }),
  roomType: z.enum(['SINGLE', 'DOUBLE', 'SIGNATURE'])
}).refine((data) => data.roomNumber[0] === data.floor, {
  message: "floor_and_room_number_mismatch",
  path: ["roomNumber"]
}).refine((data) => !(data.roomNumber && data.roomNumber[1] === "0" && data.roomNumber[2] === "0"), {
  message: "room_number_cannot_end_with_zero",
  path: ["roomNumber"]
})

const ROOM_TYPE_ENUM = [
  { value: 'SINGLE', label: 'เตียงเดี่ยว' },
  { value: 'DOUBLE', label: 'เตียงคู่' },
  { value: 'SIGNATURE', label: 'Signature' },
];

const AdminRoomEditForm = () => {
  const { t } = useTranslation();
  const { id } = useParams()
  const navigate = useNavigate()
  const token = useRoomStore((state) => state.token)
  const getRoomType = useRoomStore((state) => state.getRoomType)
  const roomtypes = useRoomStore((state) => state.roomTypes)
  const getRoomStatus = useRoomStore((state) => state.getRoomStatus)
  const roomStatuses = useRoomStore((state) => state.roomStatuses)

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
      roomStatusId: "",
      roomType: "",
      floor: ""
    }
  })

  useEffect(() => {
    getRoomType(token)
    getRoomStatus(token)
    const fetchRoom = async () => {
      try {
        const res = await readRoom(token, id)
        // set form values
        const data = res.data
        setValue("roomNumber", data.roomNumber)
        setValue("roomStatusId", data.roomStatusId)
        setValue("roomType", data.roomType)
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
      toast.success(t('room_updated_successfully', { roomNumber: res.data.roomNumber }))
      navigate("/admin/rooms")
    } catch (err) {
      const errMag = err.response?.data?.message
      toast.error(errMag)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>{t('edit_room_data')}</h1>
        <input
          type="number"
          className={`border ${errors.roomNumber ? 'border-red-500' : ''}`}
          placeholder={t('room_number')}
          id="roomNumber"
          autoFocus
          {...register("roomNumber")}
        />
        {errors.roomNumber && (
          <p className="text-red-500 text-xs mt-1">{t(errors.roomNumber.message)}</p>
        )}
        <select
          className={`border ${errors.floor ? 'border-red-500' : ''}`}
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
        <select
          className={`border ${errors.roomStatusId ? 'border-red-500' : ''}`}
          id="roomStatusId"
          {...register("roomStatusId")}
        >
          <option value="" disabled>{t('select_status')}</option>
          {roomStatuses.map((item, index) =>
            <option key={index} value={item.roomStatusId}>{item.roomStatusName}</option>
          )}
        </select>
        {errors.roomStatusId && (
          <p className="text-red-500 text-xs mt-1">{t(errors.roomStatusId.message)}</p>
        )}
        <label htmlFor="roomType" className="block text-sm font-semibold">ประเภทห้อง</label>
        <select id="roomType" {...register("roomType")}
          className={`border rounded-md p-2 w-full ${errors.roomType ? 'border-red-500' : ''}`}
        >
          <option value="">เลือกประเภทห้อง</option>
          {ROOM_TYPE_ENUM.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        {errors.roomType && (
          <p className="text-red-500 text-xs mt-1">{t(errors.roomType.message)}</p>
        )}
        <div className="flex gap-2 mt-4">
          <Link
            to={"/admin/rooms"}
            className="bg-gray-500 text-white rounded-md p-2 shadow-md hover:scale-105 hover:-translate-y-1 transition duration-200"
          >
            {t('back')}
          </Link>
          <button
            className="bg-blue-500 text-white p-2 rounded-md shadow-md hover:scale-105 hover:-translate-y-1 transition duration-200 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('please_wait') : t('edit_room')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminRoomEditForm