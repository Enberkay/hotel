import { Outlet } from "react-router-dom"
import SidebarHousekeeping from "../components/shared/HousekeepingSidebar"
import LanguageSwitcher from "../components/shared/LanguageSwitcher";

const LayoutHousekeeping = () => {
  return (
    <div className="flex flex-col h-screen">
      <LanguageSwitcher />
      <div className="flex flex-1">
        <SidebarHousekeeping />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
export default LayoutHousekeeping