import { Outlet } from "react-router-dom"
import SidebarFront from "../components/shared/FrontSidebar"

const LayoutFront = () => {
  return (
    <div className="flex h-screen">
      <div className="h-screen">
        <SidebarFront />
      </div>
      <main className="w-full overflow-auto touch-pan-y h-screen">
        <Outlet />
      </main>
    </div>
  )
}

export default LayoutFront