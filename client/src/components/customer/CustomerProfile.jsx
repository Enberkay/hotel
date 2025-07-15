import { useEffect, useState } from "react"
import useHotelStore from "../../store/hotel-store"
import { NavLink } from "react-router-dom"
import { updateProfile } from "../../api/profile"
import { toast } from "react-toastify"
import { Menu, X } from "lucide-react"

const CustomerProfile = () => {
    const token = useHotelStore((state) => state.token)
    const profile = useHotelStore((state) => state.profile)
    const getProfile = useHotelStore((state) => state.getProfile)
    const getCustomerType = useHotelStore((state) => state.getCustomerType)
    const customertypes = useHotelStore((state) => state.customertypes)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const [form, setForm] = useState({}) // ใช้ {} แทน initialState

    useEffect(() => {
        getProfile(token)
        console.log(profile)
        getCustomerType(token)
    }, [token, getProfile])

    useEffect(() => {
        if (profile) {
            setForm(profile)
        }
    }, [profile])

    const handleOnChange = (e) => {
        const { name, value } = e.target

        if (name === "customerType") {
            const selectedType = customertypes.find(type => type.customerTypeId.toString() === value)

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
            return toast.error("หมายเลขเบอร์โทรศัพท์ต้องเริ่มต้นด้วย 0")
        }

        if (!["6", "8", "9"].includes(form.userNumPhone[1])) {
            return toast.error("ตัวเลขตัวที่สองต้องเป็น 6, 8 หรือ 9 เท่านั้น")
        }

        if (form.userNumPhone.length !== 10) {
            return toast.error("หมายเลขไม่ถูกต้อง")
        }

        try {
            await updateProfile(token, form)
            toast.success("แก้ไขข้อมูลเรียบร้อย")
        } catch (err) {
            const errMsg = err.response?.data?.message || "เกิดข้อผิดพลาด"
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
                <h2 className="text-xl font-bold mb-6 text-[#5a3e2b]">เมนู</h2>
                <ul className="space-y-4">
                    {[
                        { to: "/customer/customer-profile", label: "ข้อมูลส่วนตัว" },
                        { to: "/customer/my-bookings", label: "การจองของฉัน" },
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
                        ข้อมูลส่วนตัว
                    </h2>

                    <div className="space-y-4 text-gray-700">
                        {[
                            { label: "คำนำหน้า", name: "prefix", type: "select", options: ["นาย", "นาง", "นางสาว"] },
                            { label: "ชื่อ", name: "userName", type: "text" },
                            { label: "นามสกุล", name: "userSurName", type: "text" },
                            { label: "Email", name: "userEmail", type: "text", disabled: true },
                            { label: "เบอร์โทรศัพท์", name: "userNumPhone", type: "text", maxLength: 10 },
                            { label: "รหัสบัตรประชาชน", name: "idCard", type: "text", disabled: true },
                            { label: "รหัสนักศึกษา", name: "stdId", type: "text", disabled: true },
                            {
                                label: "ประเภทลูกค้า",
                                name: "customerType",
                                type: "select",
                                options: customertypes.map(({ customerTypeId, customerTypeName }) => ({
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
                                        <option value="">-- เลือก --</option>
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

                        {form.Customer?.customerType?.customerTypeId === 2 &&
                            form.Customer?.images?.length > 0 && (
                                <img
                                    src={form.Customer.images[0].url}
                                    alt="Customer Image"
                                    className="w-32 h-32 rounded-lg shadow-md border"
                                />
                            )}
                    </div>

                    {/* Buttons */}
                    <div className="mt-8 flex gap-6 justify-center">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                            บันทึก
                        </button>
                    </div>
                </form>
            </main>
        </div>

    )
}

export default CustomerProfile
