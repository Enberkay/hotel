import React from "react"
import { NavLink } from "react-router-dom"
import { LayoutDashboard, Users, LogOut, Bed, House, BookPlus, CreditCard, ClipboardPen } from "lucide-react"
import useAuthStore from "../../store/auth-store"

const SidebarAdmin = () => {
    const { logout, user, token, getProfile, profile } = useAuthStore() // ดึง logout จาก store

    return (
        <div className="bg-white w-64 text-gray-500 flex flex-col">
            <div className="h-24 bg-black flex items-center justify-center text-2xl font-bold">
                Admin Panel
            </div>

            <nav className="flex-1 px-2 py-4 space-y-2">
                <NavLink to="/admin" end className={({ isActive }) =>
                    isActive
                        ? "bg-gray-900 rounded-md text-white px-4 py-2 flex items-center"
                        : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
                }>
                    <Users className="mr-2" />
                    ManageUser
                </NavLink>

                <NavLink to="rooms" className={({ isActive }) =>
                    isActive
                        ? "bg-gray-900 rounded-md text-white px-4 py-2 flex items-center"
                        : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
                }>
                    <Bed className="mr-2" />
                    Rooms
                </NavLink>

                <NavLink to="payment-status" className={({ isActive }) =>
                    isActive
                        ? "bg-gray-900 rounded-md text-white px-4 py-2 flex items-center"
                        : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
                }>
                    <CreditCard className="mr-2" />
                    PaymentStatus
                </NavLink>

                <NavLink to="booking-status" className={({ isActive }) =>
                    isActive
                        ? "bg-gray-900 rounded-md text-white px-4 py-2 flex items-center"
                        : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
                }>
                    <BookPlus className="mr-2" />
                    BookingStatus
                </NavLink>

                <NavLink to="cleaning-status" className={({ isActive }) =>
                    isActive
                        ? "bg-gray-900 rounded-md text-white px-4 py-2 flex items-center"
                        : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
                }>
                    <ClipboardPen className="mr-2" />
                    cleaning-status
                </NavLink>

                <NavLink to="repair-status" className={({ isActive }) =>
                    isActive
                        ? "bg-gray-900 rounded-md text-white px-4 py-2 flex items-center"
                        : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
                }>
                    <ClipboardPen className="mr-2" />
                    repair-status
                </NavLink>

                <NavLink to="cleaning-request-status" className={({ isActive }) =>
                    isActive
                        ? "bg-gray-900 rounded-md text-white px-4 py-2 flex items-center"
                        : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
                }>
                    <ClipboardPen className="mr-2" />
                    cleaning-request-status
                </NavLink>

                <NavLink to="cleaning-report-status" className={({ isActive }) =>
                    isActive
                        ? "bg-gray-900 rounded-md text-white px-4 py-2 flex items-center"
                        : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
                }>
                    <ClipboardPen className="mr-2" />
                    cleaning-report-status
                </NavLink>

                <NavLink to="repair-request-status" className={({ isActive }) =>
                    isActive
                        ? "bg-gray-900 rounded-md text-white px-4 py-2 flex items-center"
                        : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
                }>
                    <ClipboardPen className="mr-2" />
                    repair-request-status
                </NavLink>

                <NavLink to="room-status" className={({ isActive }) =>
                    isActive
                        ? "bg-gray-900 rounded-md text-white px-4 py-2 flex items-center"
                        : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
                }>
                    <Bed className="mr-2" />
                    RoomStatus
                </NavLink>

                <NavLink to="/" className={({ isActive }) =>
                    isActive
                        ? "bg-gray-900 rounded-md text-white px-4 py-2 flex items-center"
                        : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
                }>
                    <House className="mr-2" />
                    Home-Hotel
                </NavLink>
            </nav>

            <div>
                <NavLink to="/" onClick={logout} className="text-gray-300 px-4 py-2 hover:bg-red-600 hover:text-white rounded flex items-center">
                    <LogOut className="mr-2" />
                    Logout
                </NavLink>
            </div>
        </div>
    )
}

export default SidebarAdmin
