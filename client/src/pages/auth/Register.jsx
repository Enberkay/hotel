
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import useAuthStore from "../../store/auth-store";
import { useNavigate } from "react-router-dom"
import { listCustomerType } from "../../api/customerType"
import { useTranslation } from 'react-i18next';
const API_URL = import.meta.env.VITE_API_URL

const Register = () => {
  const { t } = useTranslation();
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
        toast.error(t('error_load_customer_type'))
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
      const res = await axios.post(`${API_URL}/register`, form)
      toast.success(t('register_success'))
      navigate("/login")
    } catch (err) {
      const errMag = err.response?.data?.message
      toast.error(errMag)
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-fixed px-4 mt-20"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl p-6 md:p-10 bg-white bg-opacity-95 shadow-2xl rounded-xl">
        <h2 className="text-center text-2xl font-bold mb-6">{t('register')}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block space-y-2">
            <span className="text-gray-700">{t('email')}</span>
            <input
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-brown/50 focus:outline-none"
              onChange={handleOnChange}
              name="userEmail"
              type="email"
              required
              placeholder={t('enter_email')}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-gray-700">{t('prefix')}</span>
            <select
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-brown/50 focus:outline-none"
              onChange={handleOnChange}
              name="prefix"
              required
            >
              <option value="">{t('not_specified')}</option>
              <option value="นาย">{t('mr')}</option>
              <option value="นาง">{t('mrs')}</option>
              <option value="นางสาว">{t('ms')}</option>
            </select>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className="text-gray-700">{t('firstName')}</span>
              <input
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-brown/50 focus:outline-none"
                onChange={handleOnChange}
                name="userName"
                type="text"
                required
                placeholder={t('enterFirstName')}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-gray-700">{t('lastName')}</span>
              <input
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-brown/50 focus:outline-none"
                onChange={handleOnChange}
                name="userSurName"
                type="text"
                required
                placeholder={t('enterLastName')}
              />
            </label>
          </div>
          <label className="block space-y-2">
            <span className="text-gray-700">{t('phone')}</span>
            <input
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-brown/50 focus:outline-none"
              onChange={handleOnChange}
              name="userNumPhone"
              type="text"
              maxLength={10}
              required
              inputMode="numeric"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "")
              }}
              placeholder={t('enterPhone')}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-gray-700">{t('customer_type')}</span>
            <select
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-brown/50 focus:outline-none"
              onChange={handleOnChange}
              name="customertypeId"
              required
              value={form.customertypeId}
            >
              <option value="" disabled>{t('please_select')}</option>
              {customerTypes.map((item, index) => (
                <option key={index} value={item.customerTypeId}>
                  {item.customerTypeName}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className="text-gray-700">{t('password')}</span>
              <input
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-brown/50 focus:outline-none"
                onChange={handleOnChange}
                name="userPassword"
                type="password"
                required
                placeholder={t('enter_password')}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-gray-700">{t('confirmPassword')}</span>
              <input
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-brown/50 focus:outline-none"
                onChange={handleOnChange}
                name="confirmPassword"
                type="password"
                required
                placeholder={t('enter_confirm_password')}
              />
            </label>
          </div>
          <button
            className="flex justify-center mx-auto w-full py-3 bg-brown text-white rounded-lg hover:bg-brown/80 transition"
          >
            {t('register')}
          </button>
        </form>
      </div>
    </div>
  );
}
export default Register