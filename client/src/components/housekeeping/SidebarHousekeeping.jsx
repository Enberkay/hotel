import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { NavLink } from "react-router-dom"
import {
  ClipboardPlus,
  LogOut,
  House,
  UserRound,
  FileText,
  Menu
} from "lucide-react"
import useAuthStore from "../../store/auth-store"


const SidebarHousekeeping = () => {
  const { logout, user, token, getProfile, profile } = useAuthStore() // ดึง logout จาก store
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    getProfile(token)
  }, [])
  //   console.log(user)

  return (
    <>
      {/* menu จอเล็ก */}
      <div className="bg-gray-100 p-5 lg:p-0 lg:hidden fixed w-full z-50 top-0 left-0 shadow-md">
        <button onClick={() => setSidebarOpen(true)} className=" text-gray-700">
          <Menu size={28} />
        </button>
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50" onClick={() => setSidebarOpen(false)}>

          <div className="fixed top-0 left-0 w-64  bg-white shadow-md flex flex-col p-6 text-black">
            <button onClick={() => setSidebarOpen(false)} className="self-end text-gray-600">✖</button>

            <nav className=" text-black grid gap-y-5 h-screen content-start">
              <div className="h-40 border-b flex items-center justify-center flex-col">
                <UserRound className="w-14 h-14" />
                <h1 className="capitalize text-xl font-bold">{user.userRole}</h1>
                <h2 className="text-sm">{`${profile.userName} ${profile.userSurName}`}</h2>
              </div>
              <div className="grid gap-y-2">
                <Link className="px-3 py-2 shadow-md flex text-black" to="/housekeeping"><FileText className="mr-2" />รายการทำความสะอาด</Link>
                <Link className="px-3 py-2 shadow-md flex text-black items-center" to="/housekeeping/cleaning-report"><ClipboardPlus className="mr-2" />ฟอร์มรายงานผลทำความสะอาด</Link>
                <Link className="px-3 py-2 shadow-md flex text-black items-center" to="/housekeeping/list-cleaning-report"><ClipboardPlus className="mr-2" />ใบรายงานการทำความสะอาด</Link>
                <Link className="px-3 py-2 shadow-md flex text-black" to="/"><House className="mr-2" />Home-Hotel</Link>
              </div>
              <div className="h-72 grid content-end" >
                <button onClick={logout} className="shadow-md px-3 py-2 flex text-red-500"><LogOut className="mr-2" />ออกจากระบบ</button>
              </div>
            </nav>
          </div>

        </div>
      )}

      {/* // จอใหญ่ */}
      <div className="hidden bg-[#6A503D] w-64 h-screen text-white lg:flex flex-col">
        <div
          className="h-40 border-b flex items-center 
            justify-center flex-col  p-5"
        >
          <UserRound className="w-14 h-14" />
          <h1 className="capitalize text-2xl font-bold">{user.userRole}</h1>
          <h2 className="text-xl">{`${profile.userName} ${profile.userSurName}`}</h2>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2 w-64">
          <NavLink
            to="/housekeeping"
            end
            className={({ isActive }) =>
              isActive
                ? "bg-slate-200/30 backdrop-blur-md rounded-md text-[#FEF6B3] px-4 py-2 flex items-center"
                : "text-white px-4 py-2 hover:bg-slate-200/30 backdrop-blur-md hover:text-white rounded flex items-center"
            }
          >
            <FileText className="mr-2" />
            รายการทำความสะอาด
          </NavLink>

          <NavLink
            to="/housekeeping/cleaning-report"
            end
            className={({ isActive }) =>
              isActive
                ? "bg-slate-200/30 backdrop-blur-md rounded-md text-[#FEF6B3] px-4 py-2 flex items-center"
                : "text-white px-4 py-2 hover:bg-slate-200/30 backdrop-blur-md hover:text-white rounded flex items-center"
            }
          >
            <ClipboardPlus className="mr-2" />
            ฟอร์มรายงานผลทำความสะอาด
          </NavLink>

          <NavLink
            to="/housekeeping/list-cleaning-report"
            end
            className={({ isActive }) =>
              isActive
                ? "bg-slate-200/30 backdrop-blur-md rounded-md text-[#FEF6B3] px-4 py-2 flex items-center"
                : "text-white px-4 py-2 hover:bg-slate-200/30 backdrop-blur-md hover:text-white rounded flex items-center"
            }
          >
            <ClipboardPlus className="mr-2" />
            ใบรายงานการทำความสะอาด
          </NavLink>

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "bg-slate-200/30 backdrop-blur-md rounded-md text-[#FEF6B3] px-4 py-2 flex items-center"
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
    </>
  )
}
export default SidebarHousekeeping
