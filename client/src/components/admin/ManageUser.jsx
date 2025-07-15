import React, { useState, useEffect } from "react"
import useAuthStore from "../../store/auth-store"
import { createUser, deleteUser } from "../../api/admin"
import { toast } from "react-toastify"
import { Pencil, Trash } from "lucide-react"
import { Link } from "react-router-dom"

const initialState = {
  userEmail: "",
  userPassword: "",
  userName: "",
  userSurName: "",
  userNumPhone: "",
  confirmPassword: "",
  customertypeId: "",
  userRole: "",
  assignedFloor: "",
}

const ManageUser = () => {
  const token = useAuthStore((state) => state.token)
  const getUser = useAuthStore((state) => state.getUser)
  const users = useAuthStore((state) => state.users)

  const [form, setForm] = useState({
    userEmail: "",
    userPassword: "",
    userName: "",
    userSurName: "",
    userNumPhone: "",
    confirmPassword: "",
    customertypeId: "",
    userRole: "",
    assignedFloor: "",
  })

  useEffect(() => {
    getUser(token)
    console.log(users)
  }, [])

  const handleOnChange = (e) => {
    console.log(e.target.name, e.target.value)
    // ...form คือ operator spread
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    // e.preventDefault() ป้องกันการ refresh
    e.preventDefault()
    // console.log(form)

    //check data in form
    if (!form.userEmail || !form.userPassword || !form.confirmPassword) {
      return toast.error("กรุณากรอกข้อมูลให้ครบถ้วน")
    }

    //check matching password
    if (form.userPassword !== form.confirmPassword) {
      return toast.error("Password is not match!!!")
    }

    if (form.userNumPhone[0] !== "0") {
      return toast.error("หมายเลขเบอร์โทรศัพท์ต้องเริ่มต้นด้วย 0")
    }

    if (!["6", "8", "9"].includes(form.userNumPhone[1])) {
      return toast.error("ตัวเลขตัวที่สองต้องเป็น 6, 8 หรือ 9 เท่านั้น")
    }

    if (form.userNumPhone.length !== 10) {
      return toast.error("หมายเลขไม่ถูกต้อง")
    }

    try {
      const res = await createUser(token, form)
      // console.log(initialState)
      //console.log(res)
      setForm(initialState)
      getUser(token)
      toast.success(`เพิ่มพนักสำเร็จ`)
    } catch (err) {
      console.log(err)
      const errMag = err.response?.data?.message
      toast.error(errMag)
    }
  }

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure?")) {
      // console.log("ลบ" + userId)
      try {
        const res = await deleteUser(token, userId)
        console.log(res)
        toast.success(`ลบข้อมูลสำเร็จ`)
        getUser()
      } catch (err) {
        console.log(err)
        const errMag = err.response?.data?.message
        toast.error(errMag)
      }
    }
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow-md">
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-3xl">
        <h1 className="text-xl font-bold mb-6 text-center">เพิ่มพนักงาน</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* First Name */}
          <div className="flex flex-col">
            <label className="font-medium">First Name</label>
            <input
              className="border p-2 rounded-md focus:ring focus:ring-blue-300"
              onChange={handleOnChange}
              name="userName"
              type="text"
              placeholder="Enter first name"
              value={form.userName}
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label className="font-medium">Last Name</label>
            <input
              className="border p-2 rounded-md focus:ring focus:ring-blue-300"
              onChange={handleOnChange}
              name="userSurName"
              type="text"
              placeholder="Enter last name"
              value={form.userSurName}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="font-medium">Email</label>
            <input
              type="email"
              className="border p-2 rounded-md focus:ring focus:ring-blue-300"
              onChange={handleOnChange}
              placeholder="Enter email"
              name="userEmail"
              value={form.userEmail}
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label className="font-medium">Phone Number</label>
            <input
              className="border p-2 rounded-md focus:ring focus:ring-blue-300"
              onChange={handleOnChange}
              name="userNumPhone"
              type="text"
              maxLength={10}
              required
              inputMode="numeric"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "")
              }}
              value={form.userNumPhone}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="font-medium">Password</label>
            <input
              type="password"
              className="border p-2 rounded-md focus:ring focus:ring-blue-300"
              onChange={handleOnChange}
              placeholder="Enter password"
              name="userPassword"
              value={form.userPassword}
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col">
            <label className="font-medium">Confirm Password</label>
            <input
              type="password"
              className="border p-2 rounded-md focus:ring focus:ring-blue-300"
              onChange={handleOnChange}
              placeholder="Confirm password"
              name="confirmPassword"
              value={form.confirmPassword}
            />
          </div>

          {/* Role Selection (เต็มแถว) */}
          <div className="col-span-2 flex flex-col">
            <label className="font-medium">Role</label>
            <select
              className="border p-2 rounded-md focus:ring focus:ring-blue-300"
              name="userRole"
              onChange={handleOnChange}
              required
              value={form.userRole}
            >
              <option value="" disabled>
                Select role
              </option>
              <option value="front">Front</option>
              <option value="housekeeping">Housekeeping</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          {/* เพิ่มช่องใส่ชั้นถ้าเลือกเป็น housekeeping  */}
          {form.userRole === "housekeeping" && (
            <div className="mt-2">
              <label className="font-medium">Floor</label>
              <select
                name="assignedFloor"
                className="border p-2 rounded-md focus:ring focus:ring-blue-300 w-full"
                value={form.assignedFloor}
                onChange={handleOnChange}
                required
              >
                <option value="" disabled>
                  Select floor
                </option>
                <option value="3">Floor 3</option>
                <option value="4">Floor 4</option>
                <option value="5">Floor 5</option>
                <option value="6">Floor 6</option>
              </select>
            </div>
          )}

          {/* Submit Button (เต็มแถว) */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold p-2 rounded-md shadow-md hover:bg-blue-600 transition"
            >
              เพิ่มพนักงาน
            </button>
          </div>
        </form>
      </div>

      <table className="table w-full border border-gray-300 border-collapse">
        <thead>
          <tr className="bg-gray-200 border border-gray-300">
            <th scope="col" className="border border-gray-300 px-4 py-2">
              No
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2">
              ชื่อ
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2">
              นามสกุล
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2">
              เบอร์
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2">
              อีเมลล์
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2">
              บทบาท
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2">
              ชั้น
            </th>
            <th
              scope="col"
              className="border border-gray-300 w-[100px] text-center px-2 py-2"
            >
              จัดการ
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((item, index) => (
              <tr key={index} className="border border-gray-300 text-center">
                <th scope="row" className="border border-gray-300 px-4 py-2">
                  {index + 1}
                </th>
                <td className="border border-gray-300 px-4 py-2">
                  {item.userName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.userSurName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.userNumPhone}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.userEmail}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.userRole}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.userRole === "housekeeping" ? item.assignedFloor : "-"}
                </td>
                <td className="px-4 py-2 flex justify-center gap-2">
                  {item.userRole !== "admin" && (
                    <>
                      <Link
                        to={`/admin/users/${item.userId}`}
                        className="bg-yellow-500 rounded-md p-2 shadow-md hover:scale-105 hover:-translate-y-1 transition duration-200"
                      >
                        <Pencil />
                      </Link>

                      <button
                        className="bg-red-500 rounded-md p-2 shadow-md hover:scale-105 hover:-translate-y-1 transition duration-200"
                        onClick={() => handleDelete(item.userId)}
                      >
                        <Trash className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr className="border border-gray-300">
              <td
                colSpan="7"
                className="text-center py-4 border border-gray-300"
              >
                ไม่มีข้อมูล
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
export default ManageUser
