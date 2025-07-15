import React, { useEffect, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import useAuthStore from "../../store/auth-store"
import { CircleUserRound, Menu } from "lucide-react"
import logo from "/src/assets/Images/Logo.png"

const MainNav = () => {
    const { user, token, logout, isTokenExpired } = useAuthStore()
    const [role, setRole] = useState("guest")
    const navigate = useNavigate()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        if (isTokenExpired()) {
            if (role !== "guest") {
                logout()
                setRole("guest")
            }
        } else if (user && token) {
            setRole(user.userRole)
            console.log(user)
        } else {
            setRole("guest")
        }
    }, [user, token])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".dropdown-menu") && !e.target.closest(".user-icon")) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    }, [])

    const handleBookingClick = (e) => {
        if (!token) {
            e.preventDefault()
            navigate("/login")
        }
    }

    return (
        <nav className="bg-white shadow-md fixed w-full z-50 top-0 left-0">
            <div className="container mx-auto flex items-center justify-between h-20 px-6">

                {/* เมนู (เฉพาะจอเล็ก) */}
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-700">
                    <Menu size={28} />
                </button>

                {/* โลโก้: ตรงกลางเฉพาะจอเล็ก / ซ้ายสุดเมื่อจอใหญ่ */}
                <div className="flex-1 flex justify-center lg:justify-start">
                    <Link to="/">
                        <img src={logo} className="w-24 h-auto" alt="Logo" />
                    </Link>
                </div>


                {/* ไอคอนผู้ใช้ (เฉพาะจอเล็ก ถ้าล็อกอิน) */}
                {role !== "guest" && (
                    <div className="lg:hidden relative">
                        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="user-icon">
                            <CircleUserRound size={28} className="text-gray-700 cursor-pointer" />
                        </button>
                        {dropdownOpen && (
                            <div className="dropdown-menu absolute right-0 mt-2 w-44 bg-white shadow-md rounded-md">
                                <div className="py-2">
                                    {role === "customer" && <Link to="/customer/customer-profile" className="block px-4 py-2 hover:bg-gray-100">โปรไฟล์</Link>}
                                    {role === "customer" && <Link to="/customer/my-bookings" className="block px-4 py-2 hover:bg-gray-100">การจองของฉัน</Link>}
                                    <button onClick={logout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">ออกจากระบบ</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}


                {/* เมนูหลัก (เฉพาะจอใหญ่) */}
                <div className="hidden lg:flex items-center gap-6 text-gray-800">
                    <Link to="/chamber">ห้องพัก</Link>
                    <Link to="/meeting-room">ห้องประชุม</Link>
                    <Link to="/restaurant">ห้องอาหาร</Link>
                    {(role === "customer" || role === "guest") && (
                        <Link
                            to={token ? "/book-room" : "/login"}
                            onClick={handleBookingClick}>จองห้องพัก</Link>)}
                    {/* <Link to={token ? "/book-room" : "/login"} onClick={handleBookingClick}>จองห้องพัก</Link> */}
                    <Link to="/contact">ติดต่อ</Link>

                    {role === "admin" && <Link to="/admin">เมนู Admin</Link>}
                    {role === "front" && <Link to="/front">เมนู Front</Link>}
                    {role === "housekeeping" && <Link to="/housekeeping">เมนูแม่บ้าน</Link>}
                    {role === "maintenance" && <Link to="/maintenance">เมนูช่างซ่อม</Link>}

                    {role !== "guest" ? (
                        <div className="relative">
                            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="user-icon">
                                <CircleUserRound size={28} className="text-gray-700 cursor-pointer" />
                            </button>
                            {dropdownOpen && (
                                <div className="dropdown-menu absolute right-0 mt-2 w-44 bg-white shadow-md rounded-md">
                                    <div className="py-2">
                                        {role === "customer" && <Link to="/customer/customer-profile" className="block px-4 py-2 hover:bg-gray-100">โปรไฟล์</Link>}
                                        {role === "customer" && <Link to="/customer/my-bookings" className="block px-4 py-2 hover:bg-gray-100">การจองของฉัน</Link>}
                                        <button onClick={logout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">ออกจากระบบ</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>

            {/* Sidebar (เฉพาะจอเล็ก) */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50" onClick={() => setSidebarOpen(false)}>
                    <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-md flex flex-col p-6">
                        <button onClick={() => setSidebarOpen(false)} className="self-end text-gray-600">✖</button>
                        <nav className="mt-4 space-y-4">
                            <Link to="/" className="block px-4 text-gray-800 hover:text-gray-600" onClick={() => setSidebarOpen(false)}>หน้าหลัก</Link>
                            <Link to="/chamber" className="block px-4 text-gray-800 hover:text-gray-600" onClick={() => setSidebarOpen(false)}>ห้องพัก</Link>
                            <Link to="/meeting-room" className="block px-4 text-gray-800 hover:text-gray-600" onClick={() => setSidebarOpen(false)}>ห้องประชุม</Link>
                            <Link to="/restaurant" className="block px-4 text-gray-800 hover:text-gray-600" onClick={() => setSidebarOpen(false)}>ห้องอาหาร</Link>
                            {(role === "customer" || role === "guest") && (
                                <Link
                                    to={token ? "/book-room" : "/login"}
                                    className="block px-4 text-gray-800 hover:text-gray-600"
                                    onClick={handleBookingClick}>จองห้องพัก</Link>)}
                            <Link to="/contact" className="block px-4 text-gray-800 hover:text-gray-600" onClick={() => setSidebarOpen(false)}>ติดต่อ</Link>
                            {role === "admin" && <Link to="/admin" className="block px-4">เมนู Admin</Link>}
                            {role === "front" && <Link to="/front" className="block px-4">เมนู Front</Link>}
                            {role === "housekeeping" && <Link to="/housekeeping" className="block px-4">เมนูแม่บ้าน</Link>}
                            {role === "maintenance" && <Link to="/maintenance" className="block px-4">เมนูช่างซ่อม</Link>}
                            {role === "guest" ? (
                                <>
                                    <Link to="/login" className="block px-4 text-[#28A745] hover:text-gray-600" onClick={() => setSidebarOpen(false)}>Login</Link>
                                    <Link to="/register" className="block px-4 text-[#FFA500] hover:text-gray-600" onClick={() => setSidebarOpen(false)}>Register</Link>
                                </>
                            ) : (
                                <>
                                    {role === "customer" && <Link to="/customer/customer-profile" className="block px-4 text-gray-800 hover:text-gray-600" onClick={() => setSidebarOpen(false)}>โปรไฟล์</Link>}
                                    {role === "customer" && <Link to="/customer/my-bookings" className="block px-4 text-gray-800 hover:text-gray-600" onClick={() => setSidebarOpen(false)}>การจองของฉัน</Link>}
                                    <button onClick={logout} className="block px-4 text-red-600 hover:text-red-400 text-left w-full">ออกจากระบบ</button>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default MainNav
