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
  const { i18n } = useTranslation();

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
      return toast.error("ชั้นกับเลขห้องไม่ตรงกัน")
    }

    if (form.roomNumber.length < 3) {
      return toast.error("มึงหลอนเบาะ ใส่ให้ครบ 3 ตัวดิ")
    }

    if (form.roomNumber.length > 3) {
      return toast.error("มึงหลอนเบาะ  มีแค่ 3 ตัว")
    }

    if (form.roomNumber[0] != form.floor) {
      return toast.error("ชั้นกับเลขห้องไม่ตรงกัน")
    }

    if (form.roomNumber[1] == "0" && form.roomNumber[2] == "0") {
      return toast.error("ไม่ลงท้ายด้วย 0")
    }

    try {
      const res = await updateRoom(token, id, form)
      console.log(res)
      toast.success(`แก้ไขข้อมูล ${res.data.roomNumber} สำเร็จ`)
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
        <h1 className="text-xl font-bold mb-4">แก้ไขข้อมูลห้อง</h1>

        <div>
          <label htmlFor="roomNumber" className="block text-sm font-semibold mb-1">เลขห้อง</label>
          <input
            type="number"
            className="border rounded-md p-2 w-full"
            value={form.roomNumber}
            onChange={handleOnChange}
            placeholder="เลขห้อง"
            name="roomNumber"
            id="roomNumber"
            required
          />
        </div>

        <div>
          <label htmlFor="floor" className="block text-sm font-semibold mb-1">ชั้น</label>
          <select
            className="border rounded-md p-2 w-full"
            name="floor"
            onChange={handleOnChange}
            required
            value={form.floor}
            id="floor"
          >
            <option value="" disabled>Select Floor</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>

        <div>
          <label htmlFor="roomStatus" className="block text-sm font-semibold mb-1">สถานะห้อง</label>
          <select
            className="border rounded-md p-2 w-full"
            name="roomStatus"
            onChange={handleOnChange}
            required
            value={form.roomStatus}
            id="roomStatus"
          >
            <option value="" disabled>Select Status</option>
            <option value="AVAILABLE">ว่าง</option>
            <option value="OCCUPIED">มีคนเข้าพัก</option>
            <option value="RESERVED">ถูกจอง</option>
            <option value="CLEANING">กำลังทำความสะอาด</option>
            <option value="REPAIR">กำลังซ่อมแซม</option>
          </select>
        </div>

        <div>
          <label htmlFor="roomTypeId" className="block text-sm font-semibold mb-1">ประเภทห้อง</label>
          <select
            className="border rounded-md p-2 w-full"
            name="roomTypeId"
            onChange={handleOnChange}
            required
            value={form.roomTypeId}
            id="roomTypeId"
          >
            <option value="" disabled>Please Select</option>
            {roomtypes.map((item, index) => (
              <option key={index} value={item.roomTypeId}>{i18n.language === 'th' ? item.name_th : item.name_en}</option>
            ))}
          </select>
        </div>

        <hr className="my-4" />

        <div className="flex gap-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition">
            แก้ไขห้อง
          </button>
          <Link
            to={"/front/room-manage"}
            className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600 transition flex items-center"
          >
            <Undo2 className="mr-2" /> ย้อนกลับ
          </Link>
        </div>
      </form>
    </div>

  )
}
export default RoomManageEdit