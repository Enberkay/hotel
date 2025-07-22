import React from "react"
import { Outlet } from "react-router-dom"
import AdminSidebar from "../components/shared/AdminSidebar"
import LanguageSwitcher from "../components/shared/LanguageSwitcher";

const LayoutAdmin = () => {
  return (
    <div className="flex flex-col h-screen">
      <LanguageSwitcher />
      <div className="flex flex-1">
        <div className="h-full">
          <AdminSidebar />
        </div>
        <main className="w-full overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default LayoutAdmin;
