
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import useAuthStore from "../../store/auth-store";
import { useNavigate } from "react-router-dom"
import { listCustomerType } from "../../api/customerType"
import { useTranslation } from 'react-i18next';
const API_URL = import.meta.env.VITE_API_URL

const Register = () => {
  const { t } = useTranslation(['auth', 'user']);
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const [customerTypes, setCustomerTypes] = useState([])
  const [form, setForm] = useState({
    userEmail: "",
    userPassword: "",
    userName: "",
    userSurName: "",
    userNumPhone: "",
    confirmPassword: "",
    customertypeId: "",
    prefix: "",
    licensePlate: "",
  })

  useEffect(() => {
    async function fetchCustomerTypes() {
      try {
        const res = await listCustomerType(token)
        setCustomerTypes(res.data)
      } catch (err) {
        toast.error(t('user:error_load_customer_type'))
      }
    }
    if (token) fetchCustomerTypes()
  }, [token])

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.userEmail || !form.userPassword || !form.confirmPassword) {
      return toast.error(t('error_required'))
    }
    if (form.userPassword !== form.confirmPassword) {
      return toast.error(t('error_password_not_match'))
    } else {
      // Validate phone number format
      const phoneRegex = /^[0][6,8,9][0-9]{8}$/
      if (!phoneRegex.test(form.userNumPhone)) {
        if (form.userNumPhone.charAt(0) !== "0") {
          return toast.error(t('error_phone_start_0'))
        }
        if (!["6", "8", "9"].includes(form.userNumPhone.charAt(1))) {
          return toast.error(t('error_phone_second_digit'))
        }
        if (form.userNumPhone.length !== 10) {
          return toast.error(t('error_phone_length'))
        }
      }
    }
    try {
      const res = await axios.post(`${API_URL}/register`, form)
      navigate("/")
      toast.success(t('register_success'))
    } catch (err) {
      console.log(err.response.data)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('register')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Prefix */}
            <div className="mb-4">
              <label className="block text-gray-700">{t('prefix')}</label>
              <select
                name="prefix"
                onChange={handleOnChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              >
                <option value="" disabled selected>{t('common:please_select')}</option>
                <option value="not specified">{t('not_specified')}</option>
                <option value="mr">{t('mr')}</option>
                <option value="mrs">{t('mrs')}</option>
                <option value="ms">{t('ms')}</option>
              </select>
            </div>

            {/* First Name */}
            <div className="mb-4">
              <label className="block text-gray-700">{t('firstName')}</label>
              <input
                type="text"
                name="userName"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder={t('enterFirstName')}
                onChange={handleOnChange}
              />
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <label className="block text-gray-700">{t('lastName')}</label>
              <input
                type="text"
                name="userSurName"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder={t('enterLastName')}
                onChange={handleOnChange}
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700">{t('user:email')}</label>
              <input
                type="email"
                name="userEmail"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder={t('enter_email')}
                onChange={handleOnChange}
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-gray-700">{t('user:phone')}</label>
              <input
                type="text"
                name="userNumPhone"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder={t('enterPhone')}
                onChange={handleOnChange}
              />
            </div>

            {/* Customer Type */}
            <div className="mb-4">
              <label className="block text-gray-700">{t('user:customer_type')}</label>
              <select
                name="customertypeId"
                onChange={handleOnChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              >
                <option value="" disabled selected>{t('common:please_select')}</option>
                {customerTypes.map((type) => (
                  <option key={type.customerTypeId} value={type.customerTypeId}>
                    {type.customerTypeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-gray-700">{t('password')}</label>
              <input
                type="password"
                name="userPassword"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder={t('enter_password')}
                onChange={handleOnChange}
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block text-gray-700">{t('confirmPassword')}</label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder={t('enter_confirm_password')}
                onChange={handleOnChange}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-custom-brown text-white p-2 rounded mt-4"
          >
            {t('register')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register