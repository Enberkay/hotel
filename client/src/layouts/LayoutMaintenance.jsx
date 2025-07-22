import { Outlet } from "react-router-dom"
import MaintenanceSidebar from "../components/shared/MaintenanceSidebar"
import LanguageSwitcher from "../components/shared/LanguageSwitcher";

const LayoutMaintenance = () => {
  return (
    <div className="flex flex-col h-screen">
      <LanguageSwitcher />
      <div className="flex flex-1">
        <MaintenanceSidebar />
        <main className="w-full overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
export default LayoutMaintenance