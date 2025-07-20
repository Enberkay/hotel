import { useEffect, useState } from "react"
import useAuthStore from "../../store/auth-store"
import { NavLink } from "react-router-dom"
import { updateProfile } from "../../api/profile"
import { toast } from "react-toastify"
import { Menu, X } from "lucide-react"
import { listCustomerType } from "../../api/customerType"
import { useTranslation } from 'react-i18next';

const CustomerProfile = () => {
    const { t } = useTranslation();
    const user = useAuthStore((state) => state.user)
    const token = useAuthStore((state) => state.token)
    const profile = useAuthStore((state) => state.profile)
    const getProfile = useAuthStore((state) => state.getProfile)
    const [customerTypes, setCustomerTypes] = useState([])
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [form, setForm] = useState({})

    useEffect(() => {
        getProfile(token)
        async function fetchCustomerTypes() {
            try {
                const res = await listCustomerType(token)
                setCustomerTypes(res.data)
            } catch (err) {
                toast.error(t("customer_type_load_error"))
            }
        }
        if (token) fetchCustomerTypes()
    }, [token, getProfile])

    useEffect(() => {
        if (profile) {
            setForm(profile)
        }
    }, [profile])

    const handleOnChange = (e) => {
        const { name, value } = e.target

        if (name === "customerType") {
            const selectedType = customerTypes.find(type => type.customerTypeId.toString() === value)

            setForm(prev => ({
                ...prev,
                Customer: {
                    ...prev.Customer,
                    customerType: selectedType
                }
            }))
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        if (form.userNumPhone[0] !== "0") {
            return toast.error(t("phone_number_start_with_0"))
        }

        if (!["6", "8", "9"].includes(form.userNumPhone[1])) {
            return toast.error(t("phone_number_second_digit_6_8_9"))
        }

        if (form.userNumPhone.length !== 10) {
            return toast.error(t("phone_number_incorrect"))
        }

        try {
            await updateProfile(token, form)
            toast.success(t("profile_update_success"))
        } catch (err) {
            const errMsg = err.response?.data?.message || t("profile_update_error")
            toast.error(errMsg)
        }
    }

    const handleCancel = () => {
        setForm(profile || {}) // ป้องกัน undefined
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
                <form
                    onSubmit={handleSubmit}
                    className="bg-[#B29433] bg-opacity-30 p-8 shadow-lg rounded-lg w-full max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                        {t("customer_profile")}
                    </h2>

                    <div className="space-y-4 text-gray-700">
                        {[
                            { label: t("prefix"), name: "prefix", type: "select", options: ["นาย", "นาง", "นางสาว"] },
                            { label: t("first_name"), name: "userName", type: "text" },
                            { label: t("last_name"), name: "userSurName", type: "text" },
                            { label: t("email"), name: "userEmail", type: "text", disabled: true },
                            { label: t("phone_number"), name: "userNumPhone", type: "text", maxLength: 10 },
                            { label: t("id_card"), name: "idCard", type: "text", disabled: true },
                            { label: t("student_id"), name: "stdId", type: "text", disabled: true },
                            {
                                label: t("customer_type"),
                                name: "customerType",
                                type: "select",
                                options: customerTypes.map(({ customerTypeId, customerTypeName }) => ({
                                    value: customerTypeId,
                                    label: customerTypeName,
                                })),
                                disabled: true,
                            },
                        ].map(({ label, name, type, options, disabled, maxLength }) => (
                            <div key={name}>
                                <label className="font-semibold">{label}</label>
                                {type === "select" ? (
                                    <select
                                        name={name}
                                        value={form[name] ?? ""}
                                        onChange={handleOnChange}
                                        disabled={disabled}
                                        className="border p-2 w-full rounded-md"
                                    >
                                        <option value="">-- {t("select_option")} --</option>
                                        {options.map((opt, i) => (
                                            <option key={i} value={typeof opt === "string" ? opt : opt.value}>
                                                {typeof opt === "string" ? opt : opt.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={type}
                                        name={name}
                                        value={form[name] ?? ""}
                                        onChange={handleOnChange}
                                        disabled={disabled}
                                        maxLength={maxLength}
                                        className="border p-2 w-full rounded-md"
                                        onInput={name === "userNumPhone" ? (e) => (e.target.value = e.target.value.replace(/\D/g, "")) : undefined}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="mt-8 flex gap-6 justify-center">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                        >
                            {t("cancel")}
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                            {t("save")}
                        </button>
                    </div>
                </form>
            </main>
        </div>

    )
}

export default CustomerProfile
