import { Outlet } from "react-router-dom"
import MaintenanceSidebar from "../components/shared/MaintenanceSidebar"

const LayoutMaintenance = () => {
  return (
    <div className="flex h-screen">
      <div className="h-full">
        <MaintenanceSidebar />
      </div>
      <main className="w-full overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
export default LayoutMaintenance