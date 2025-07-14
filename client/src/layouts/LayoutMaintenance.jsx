import { Outlet } from "react-router-dom"
import SidebarMaintenance from "../components/maintenance/SidebarMaintenance"

const LayoutMaintenance = () => {
  return (
    <div className="flex h-screen">
      <div className="h-full">
        <SidebarMaintenance />
      </div>
      <main className="w-full overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
export default LayoutMaintenance