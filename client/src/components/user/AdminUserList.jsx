import React, { useState, useEffect } from "react"
import useAuthStore from "../../store/auth-store"
import { createUser, deleteUser } from "../../api/admin"
import { toast } from "react-toastify"
import { Pencil, Trash } from "lucide-react"
import { Link } from "react-router-dom"
import { useTranslation } from 'react-i18next';

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

const AdminUserList = () => {
  const { t } = useTranslation();
  const token = useAuthStore((state) => state.token)
  const getAllUsers = useAuthStore((state) => state.getAllUsers)
  const users = useAuthStore((state) => state.users)

  const [form, setForm] = useState(initialState)

  useEffect(() => {
    getAllUsers(token)
  }, [token])

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.userEmail || !form.userPassword || !form.confirmPassword) {
      return toast.error(t('error_required'))
    }
    if (form.userPassword !== form.confirmPassword) {
      return toast.error(t('error_password_not_match'))
    }
    if (form.userNumPhone[0] !== "0") {
      return toast.error(t('error_phone_start_0'))
    }
    if (!["6", "8", "9"].includes(form.userNumPhone[1])) {
      return toast.error(t('error_phone_second_digit'))
    }
    if (form.userNumPhone.length !== 10) {
      return toast.error(t('error_phone_length'))
    }
    try {
      const res = await createUser(token, form)
      setForm(initialState)
      getAllUsers(token)
      toast.success(t('add_user_success'))
    } catch (err) {
      const errMag = err.response?.data?.message
      toast.error(errMag)
    }
  }

  const handleDelete = async (userId) => {
    if (window.confirm(t('confirm_delete'))) {
      try {
        const res = await deleteUser(token, userId)
        toast.success(t('delete_success'))
        getAllUsers(token)
      } catch (err) {
        const errMag = err.response?.data?.message
        toast.error(errMag)
      }
    }
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow-md">
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-3xl">
        <h1 className="text-xl font-bold mb-6 text-center">{t('add_user')}</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-medium">{t('firstName')}</label>
            <input
              className="border p-2 rounded-md focus:ring focus:ring-blue-300"
              onChange={handleOnChange}
              name="userName"
              type="text"
              placeholder={t('enterFirstName')}
              value={form.userName}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">{t('lastName')}</label>
            <input
              className="border p-2 rounded-md focus:ring focus:ring-blue-300"
              onChange={handleOnChange}
              name="userSurName"
              type="text"
              placeholder={t('enterLastName')}
              value={form.userSurName}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">{t('email')}</label>
            <input
              type="email"
              className="border p-2 rounded-md focus:ring focus:ring-blue-300"
              onChange={handleOnChange}
              placeholder={t('enter_email')}
              name="userEmail"
              value={form.userEmail}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">{t('phone')}</label>
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
              placeholder={t('enterPhone')}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">{t('password')}</label>
            <input
              type="password"
              className="border p-2 rounded-md focus:ring focus:ring-blue-300"
              onChange={handleOnChange}
              placeholder={t('enter_password')}
              name="userPassword"
              value={form.userPassword}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">{t('confirmPassword')}</label>
            <input
              type="password"
              className="border p-2 rounded-md focus:ring focus:ring-blue-300"
              onChange={handleOnChange}
              placeholder={t('enter_confirm_password')}
              name="confirmPassword"
              value={form.confirmPassword}
            />
          </div>
          {/* Role Selection (เต็มแถว) */}
          <div className="col-span-2 flex flex-col">
            <label className="font-medium">{t('role')}</label>
            <select
              className="border p-2 rounded-md focus:ring focus:ring-blue-300"
              name="userRole"
              onChange={handleOnChange}
              required
              value={form.userRole}
            >
              <option value="" disabled>{t('select_role')}</option>
              <option value="front">{t('front')}</option>
              <option value="housekeeping">{t('housekeeping')}</option>
              <option value="maintenance">{t('maintenance')}</option>
            </select>
          </div>

          {/* เพิ่มช่องใส่ชั้นถ้าเลือกเป็น housekeeping  */}
          {form.userRole === "housekeeping" && (
            <div className="mt-2">
              <label className="font-medium">{t('floor')}</label>
              <select
                name="assignedFloor"
                className="border p-2 rounded-md focus:ring focus:ring-blue-300 w-full"
                value={form.assignedFloor}
                onChange={handleOnChange}
                required
              >
                <option value="" disabled>{t('select_floor')}</option>
                <option value="3">{t('floor_3')}</option>
                <option value="4">{t('floor_4')}</option>
                <option value="5">{t('floor_5')}</option>
                <option value="6">{t('floor_6')}</option>
              </select>
            </div>
          )}

          {/* Submit Button (เต็มแถว) */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold p-2 rounded-md shadow-md hover:bg-blue-600 transition"
            >
              {t('add_user')}
            </button>
          </div>
        </form>
      </div>

      <table className="table w-full border border-gray-300 border-collapse">
        <thead>
          <tr className="bg-gray-200 border border-gray-300">
            <th scope="col" className="border border-gray-300 px-4 py-2">
              {t('no')}
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2">
              {t('name')}
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2">
              {t('surname')}
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2">
              {t('phone')}
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2">
              {t('email')}
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2">
              {t('role')}
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2">
              {t('floor')}
            </th>
            <th
              scope="col"
              className="border border-gray-300 w-[100px] text-center px-2 py-2"
            >
              {t('manage')}
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
                {t('no_data')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
export default AdminUserList
