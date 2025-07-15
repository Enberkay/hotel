import React, { useState, useEffect } from "react"
import useAuthStore from "../../store/auth-store"
import { toast } from "react-toastify"
import { useParams, useNavigate, Link } from "react-router-dom"
import { readUser, updateUser } from "../../api/admin"

const initialState = {
  userEmail: "",
  userName: "",
  userSurName: "",
  userNumPhone: "",
  userRole: "",
  assignedFloor: ""
}

const ManageEditUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const [form, setForm] = useState(initialState)

  useEffect(() => {
    fetchUser(token, id)
  }, [])

  const fetchUser = async (token, id) => {
    try {
      const res = await readUser(token, id)
      setForm(res.data)
    } catch (err) {
      console.log("Error fetching data", err)
    }
  }

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.userNumPhone[0] !== "0" || !["6", "8", "9"].includes(form.userNumPhone[1]) || form.userNumPhone.length !== 10) {
      return toast.error("หมายเลขโทรศัพท์ไม่ถูกต้อง")
    }

    try {
      const res = await updateUser(token, id, form)
      toast.success(`แก้ไขข้อมูลสำเร็จ`)
      navigate("/admin")
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-2xl">
      <h1 className="text-xl font-bold mb-6 text-center">แก้ไขข้อมูลผู้ใช้</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex flex-col">
          <label className="font-medium">Email</label>
          <input type="email" className="border p-2 rounded-md" value={form.userEmail} onChange={handleOnChange} name="userEmail" />
        </div>
        <div className="flex flex-col">
          <label className="font-medium">ชื่อ</label>
          <input type="text" className="border p-2 rounded-md" value={form.userName} onChange={handleOnChange} name="userName" />
        </div>
        <div className="flex flex-col">
          <label className="font-medium">นามสกุล</label>
          <input type="text" className="border p-2 rounded-md" value={form.userSurName} onChange={handleOnChange} name="userSurName" />
        </div>
        <div className="col-span-2 flex flex-col">
          <label className="font-medium">เบอร์โทรศัพท์</label>
          <input type="text" className="border p-2 rounded-md" value={form.userNumPhone} onChange={handleOnChange} name="userNumPhone" maxLength={10} />
        </div>
        {form.userRole === "housekeeping" && (
          <div className="col-span-2 flex flex-col">
            <label className="font-medium">ชั้นที่รับผิดชอบ</label>
            <select name="assignedFloor" value={form.assignedFloor} onChange={handleOnChange} className="border p-2 rounded-md">
              <option disabled value="">เลือกชั้น</option>
              {["3", "4", "5", "6"].map((floor) => (
                <option key={floor} value={floor}>{floor}</option>
              ))}
            </select>
          </div>
        )}
        <div className="col-span-2 flex justify-between mt-4">
          <Link to="/admin" className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
            ย้อนกลับ
          </Link>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            แก้ไขพนักงาน
          </button>
        </div>
      </form>
    </div>
  )
}

export default ManageEditUser
