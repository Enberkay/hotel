import { useEffect, useState } from "react"
import useAuthStore from "../../store/auth-store"
import { NavLink } from "react-router-dom"
import { updateProfile } from "../../api/profile"
import { toast } from "react-toastify"
import { Menu, X } from "lucide-react"
import { listCustomerType } from "../../api/customerType"
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const CustomerProfile = () => {
    const { t } = useTranslation(['user', 'common']);
    const token = useAuthStore((state) => state.token)
    const profile = useAuthStore((state) => state.profile)
    const getProfile = useAuthStore((state) => state.getProfile)
    const [customerTypes, setCustomerTypes] = useState([])
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Zod schema
    const schema = z.object({
        userName: z.string().min(1, { message: t('common:error_required') }),
        userSurName: z.string().min(1, { message: t('common:error_required') }),
        userNumPhone: z.string()
            .min(10, { message: t('user:phone_number_incorrect') })
            .max(10, { message: t('user:phone_number_incorrect') })
            .regex(/^0[689][0-9]{8}$/, { message: t('user:phone_number_start_with_0') }),
        customerType: z.string().min(1, { message: t('common:error_required') }),
    });

    const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(schema),
        mode: 'onTouched',
        defaultValues: {
            userName: '',
            userSurName: '',
            userNumPhone: '',
            customerType: '',
        }
    });

    useEffect(() => {
        getProfile(token)
        async function fetchCustomerTypes() {
            try {
                const res = await listCustomerType(token)
                setCustomerTypes(res.data)
            } catch (err) {
                toast.error(t("error_load_customer_type"))
            }
        }
        if (token) fetchCustomerTypes()
    }, [token, getProfile, t])

    useEffect(() => {
        if (profile) {
            reset({
                userName: profile.userName || '',
                userSurName: profile.userSurName || '',
                userNumPhone: profile.userNumPhone || '',
                customerType: profile.Customer?.customerType?.customerTypeId?.toString() || '',
            })
        }
    }, [profile, reset])

    const onSubmit = async (data) => {
        try {
            await updateProfile(token, {
                ...profile,
                userName: data.userName,
                userSurName: data.userSurName,
                userNumPhone: data.userNumPhone,
                Customer: {
                    ...profile.Customer,
                    customerType: customerTypes.find(type => type.customerTypeId.toString() === data.customerType)
                }
            })
            getProfile(token)
            toast.success(t("common:update_success"))
        } catch (err) {
            toast.error(t("common:error_update"))
        }
    }

    return (
        <div className="min-h-screen flex bg-gray-100">
             {/* ปุ่ม Toggle Menu บนมือถือ */}
             <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hidden md:hidden fixed top-4 left-4 z-50 bg-[#8b5e34] text-white p-2 rounded-lg shadow-md"
            >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={`mt-20 lg:mt-0 md:mt-0 fixed inset-y-0 left-0 z-40 w-64 p-6 shadow-md bg-[#f7f3ef] transition-transform transform 
                ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:w-1/5`}
            >
                <h2 className="text-xl font-bold mb-6 text-[#5a3e2b]">{t("menu")}</h2>
                <ul className="space-y-4">
                    {[
                        { to: "/customer/customer-profile", label: t("customer_profile") },
                        { to: "/customer/my-bookings", label: t("my_bookings") },
                    ].map(({ to, label }) => (
                        <li key={to}>
                            <NavLink
                                to={to}
                                className={({ isActive }) =>
                                    `block px-4 py-3 rounded-md transition ${isActive
                                        ? "bg-[var(--color-brown)] text-white shadow-md"
                                        : "hover:bg-[#d7ccc8] text-[#5a3e2b]"
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex justify-center p-6">
                <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">{t('edit_profile')}</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="block text-gray-700">{t('name')}</label>
                            <input
                                type="text"
                                {...register('userName')}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                            />
                            {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName.message}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">{t('lastName')}</label>
                            <input
                                type="text"
                                {...register('userSurName')}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                            />
                            {errors.userSurName && <p className="text-red-500 text-xs mt-1">{errors.userSurName.message}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">{t('phone')}</label>
                            <input
                                type="text"
                                {...register('userNumPhone')}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                            />
                            {errors.userNumPhone && <p className="text-red-500 text-xs mt-1">{errors.userNumPhone.message}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">{t('customer_type')}</label>
                            <Controller
                                control={control}
                                name="customerType"
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="w-full p-2 border border-gray-300 rounded mt-1"
                                    >
                                        <option value="">{t('common:please_select')}</option>
                                        {customerTypes.map((type) => (
                                            <option key={type.customerTypeId} value={type.customerTypeId}>
                                                {type.customerTypeName}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                            {errors.customerType && <p className="text-red-500 text-xs mt-1">{errors.customerType.message}</p>}
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={isSubmitting}>
                                {isSubmitting ? t('common:loading') : t('common:save')}
                            </button>
                            <NavLink to="/customer/my-bookings" className="bg-gray-300 px-4 py-2 rounded">
                                {t('common:cancel')}
                            </NavLink>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default CustomerProfile
