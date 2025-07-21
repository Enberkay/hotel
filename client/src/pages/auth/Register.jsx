
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import useAuthStore from "../../store/auth-store";
import { useNavigate } from "react-router-dom"
import { listCustomerType } from "../../api/customerType"
import { useTranslation } from 'react-i18next';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
const API_URL = import.meta.env.VITE_API_URL

const Register = () => {
  const { t, i18n } = useTranslation(['auth', 'user', 'common']);
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const [customerTypes, setCustomerTypes] = useState([])

  // Zod schema
  const schema = z.object({
    prefix: z.string().min(1, t('common:error_required')),
    userName: z.string().min(1, t('common:error_required')),
    userSurName: z.string().min(1, t('common:error_required')),
    userEmail: z.string().min(1, t('common:error_required')).email(t('auth:enter_email')),
    userNumPhone: z.string()
      .min(10, t('auth:error_phone_length'))
      .max(10, t('auth:error_phone_length'))
      .regex(/^0[689][0-9]{8}$/, t('auth:error_phone_start_0')),
    customertypeId: z.string().min(1, t('common:error_required')),
    userPassword: z.string().min(6, t('common:error_required')),
    confirmPassword: z.string().min(6, t('common:error_required')),
    licensePlate: z.string().optional(),
  }).refine((data) => data.userPassword === data.confirmPassword, {
    message: t('auth:error_password_not_match'),
    path: ['confirmPassword'],
  });

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

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
  }, [token, t])

  // Autofill select value when user changes
  useEffect(() => {
    setValue('prefix', '')
    setValue('customertypeId', '')
  }, [setValue])

  const onSubmit = async (data) => {
    try {
      await axios.post(`${API_URL}/register`, data)
      navigate("/")
      toast.success(t('auth:register_success'))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Register failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('auth:register')}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prefix */}
            <div className="mb-4">
              <label className="block text-gray-700">{t('auth:prefix')}</label>
              <select
                {...register('prefix')}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                defaultValue=""
              >
                <option value="" disabled>{t('common:please_select')}</option>
                <option value="not specified">{t('auth:not_specified')}</option>
                <option value="mr">{t('auth:mr')}</option>
                <option value="mrs">{t('auth:mrs')}</option>
                <option value="ms">{t('auth:ms')}</option>
              </select>
              {errors.prefix && <p className="text-red-500 text-xs mt-1">{errors.prefix.message}</p>}
            </div>
            {/* First Name */}
            <div className="mb-4">
              <label className="block text-gray-700">{t('auth:firstName')}</label>
              <input
                type="text"
                {...register('userName')}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder={t('auth:enterFirstName')}
              />
              {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName.message}</p>}
            </div>
            {/* Last Name */}
            <div className="mb-4">
              <label className="block text-gray-700">{t('auth:lastName')}</label>
              <input
                type="text"
                {...register('userSurName')}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder={t('auth:enterLastName')}
              />
              {errors.userSurName && <p className="text-red-500 text-xs mt-1">{errors.userSurName.message}</p>}
            </div>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700">{t('user:email')}</label>
              <input
                type="email"
                {...register('userEmail')}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder={t('auth:enter_email')}
              />
              {errors.userEmail && <p className="text-red-500 text-xs mt-1">{errors.userEmail.message}</p>}
            </div>
            {/* Phone */}
            <div className="mb-4">
              <label className="block text-gray-700">{t('user:phone')}</label>
              <input
                type="text"
                {...register('userNumPhone')}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder={t('auth:enterPhone')}
              />
              {errors.userNumPhone && <p className="text-red-500 text-xs mt-1">{errors.userNumPhone.message}</p>}
            </div>
            {/* Customer Type */}
            <div className="mb-4">
              <label className="block text-gray-700">{t('user:customer_type')}</label>
              <select
                {...register('customertypeId')}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                defaultValue=""
              >
                <option value="" disabled>{t('common:please_select')}</option>
                {customerTypes.map((type) => (
                  <option key={type.customerTypeId} value={type.customerTypeId}>
                    {type.customerTypeName}
                  </option>
                ))}
              </select>
              {errors.customertypeId && <p className="text-red-500 text-xs mt-1">{errors.customertypeId.message}</p>}
            </div>
            {/* Password */}
            <div className="mb-4">
              <label className="block text-gray-700">{t('auth:password')}</label>
              <input
                type="password"
                {...register('userPassword')}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder={t('auth:enter_password')}
              />
              {errors.userPassword && <p className="text-red-500 text-xs mt-1">{errors.userPassword.message}</p>}
            </div>
            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block text-gray-700">{t('auth:confirmPassword')}</label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder={t('auth:enter_confirm_password')}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            {/* License Plate (optional) */}
            <div className="mb-4 md:col-span-2">
              <label className="block text-gray-700">{t('auth:license_plate')}</label>
              <input
                type="text"
                {...register('licensePlate')}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder={t('auth:license_plate')}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-custom-brown text-white p-2 rounded mt-4"
          >
            {t('auth:register')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register