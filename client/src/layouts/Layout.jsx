import React from 'react'
import { Outlet } from "react-router-dom"
import MainNav from "../components/shared/MainNav"

const Layout = () => {
  return (
    <div className="flex h-screen">
      <MainNav />
      <main className="w-full overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout