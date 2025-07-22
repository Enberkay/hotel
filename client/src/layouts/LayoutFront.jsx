import { Outlet } from "react-router-dom"
import SidebarFront from "../components/shared/FrontSidebar"
import LanguageSwitcher from "../components/shared/LanguageSwitcher";

const LayoutFront = () => {
  return (
    <div className="flex flex-col h-screen">
      <LanguageSwitcher />
      <div className="flex flex-1">
        <SidebarFront />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default LayoutFront