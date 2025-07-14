import React, { useEffect } from "react"
import { NavLink } from "react-router-dom"
import { List, CircleUserRound, LogOut, House } from "lucide-react"
import useHotelStore from "../../store/hotel-store"

const SidebarMaintenance = () => {
    const { logout, user, profile, getProfile, token } = useHotelStore() // ดึง logout จาก store

    useEffect(() => {
        getProfile(token)
    }, [])

    return (
        <div className="bg-[#6A503D] w-64 h-screen text-white flex flex-col">
            <div className="h-40 border-b flex items-center justify-center flex-col p-5">
                <CircleUserRound className="w-14 h-14" />
                <h1 className="capitalize text-2xl font-bold">{user.userRole}</h1>
                <h2 className="text-xl">{`${profile.userName} ${profile.userSurName}`}</h2>
            </div>

            <nav className="flex-1 px-2 py-4 space-y-2 w-64">
                <NavLink
                    to={"/maintenance"}
                    end
                    className={({ isActive }) =>
                        isActive
                            ? "bg-slate-200/30 backdrop-blur-md rounded-md text-[#FEF6B3] px-4 py-2 flex items-center"
                            : "text-white px-4 py-2 hover:bg-slate-200/30 backdrop-blur-md hover:text-white rounded flex items-center"
                    }
                >
                    <List className="mr-2" />
                    รายการแจ้งซ่อม
                </NavLink>

                <NavLink
                    to={"repair-report"}
                    end
                    className={({ isActive }) =>
                        isActive
                            ? "bg-slate-200/30 backdrop-blur-md rounded-md text-[#FEF6B3] px-4 py-2 flex items-center"
                            : "text-white px-4 py-2 hover:bg-slate-200/30 backdrop-blur-md hover:text-white rounded flex items-center"
                    }
                >
                    <List className="mr-2" />
                    รายงานผลการซ่อม
                </NavLink>

                <NavLink
                    to={"/"}
                    className={({ isActive }) =>
                        isActive
                            ? "bg-slate-200/30 backdrop-blur-md rounded-md text-whit px-4 py-2 flex items-center"
                            : "text-white px-4 py-2 hover:bg-slate-200/30 backdrop-blur-md hover:text-white rounded flex items-center"
                    }
                >
                    <House className="mr-2" />
                    Home-Hotel
                </NavLink>

            </nav>
            <div>
                <NavLink
                    to="/"
                    onClick={logout}
                    className=" text-gray-300 px-4 py-2 hover:bg-red-600 flex items-center hover:text-white rounded"
                >
                    <LogOut className="mr-2" />
                    Logout
                </NavLink>
            </div>
        </div>
    )
}
export default SidebarMaintenance