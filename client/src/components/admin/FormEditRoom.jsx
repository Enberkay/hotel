import React, { useState, useEffect } from "react"
import useHotelStore from "../../store/hotel-store"
import { readRoom, updateRoom } from "../../api/room"
import { toast } from "react-toastify"
import { useParams, useNavigate, Link } from "react-router-dom"

const initialState = {
  roomNumber: "",
  roomStatusId: "",
  roomTypeId: "",
  floor: ""
}

const FormEditRoom = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  const token = useHotelStore((state) => state.token)
  const getRoomType = useHotelStore((state) => state.getRoomType)
  const roomtypes = useHotelStore((state) => state.roomTypes)
  const getRoomStatus = useHotelStore((state) => state.getRoomStatus)
  const roomStatuses = useHotelStore((state) => state.roomStatuses)

  const [form, setForm] = useState(initialState)

  const fetchRoom = async (token, id) => {
    try {
      const res = await readRoom(token, id)
      // console.log(res)
      setForm(res.data) //รับ data ที่ read มา set ในตัวแปล form

    } catch (err) {
      console.log("Error fetch data", err)
    }
  }

  useEffect(() => {
    getRoomType(token)
    getRoomStatus(token)
    fetchRoom(token, id)
  }, [])



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
      // console.log(res)
      toast.success(`แก้ไขข้อมูล ${res.data.roomNumber} สำเร็จ`)
      navigate("/admin/rooms")
    } catch (err) {
      console.log(err)
      const errMag = err.response?.data?.message
      toast.error(errMag)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} >
        <h1>แก้ไขข้อมูลห้อง</h1>
        <input
          type="number"
          className="border"
          value={form.roomNumber}
          onChange={handleOnChange}
          placeholder="เลขห้อง"
          name="roomNumber" //name ตรงนี้ต้องตรงกับตรง const initialState
        />
        <select
          className="border"
          name="floor"
          onChange={handleOnChange}
          required
          value={form.floor}
        >
          <option value="" disabled>Select Floor</option>
          <option value="3" >3</option>
          <option value="4" >4</option>
          <option value="5" >5</option>
          <option value="6" >6</option>
        </select>

        <select
          className="border"
          name="roomStatusId"
          onChange={handleOnChange}
          required
          value={form.roomStatusId}
        >
          <option value="" disabled >Select Status</option>
          {
            roomStatuses.map((item, index) =>
              <option key={index} value={item.roomStatusId} >{item.roomStatusName}</option>
            )
          }
        </select>
        <select
          className="border"
          name="roomTypeId"
          onChange={handleOnChange}
          required
          value={form.roomTypeId}
        >
          <option value="" disabled >Please Select</option>
          {
            roomtypes.map((item, index) =>
              <option key={index} value={item.roomTypeId}>{item.roomTypeName}</option>
            )
          }
        </select>

        <div className="flex gap-2 mt-4">
          <Link
            to={"/admin/rooms"}
            className="bg-gray-500 text-white rounded-md p-2 shadow-md hover:scale-105 hover:-translate-y-1 transition duration-200"
          >
            ย้อนกลับ
          </Link>

          <button
            className="bg-blue-500 text-white p-2 rounded-md shadow-md hover:scale-105 hover:-translate-y-1 transition duration-200"
          >
            แก้ไขห้อง
          </button>
        </div>

      </form>
    </div>
  )
}

export default FormEditRoom