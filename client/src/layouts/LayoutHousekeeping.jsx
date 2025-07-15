import { Outlet } from "react-router-dom"
import SidebarHousekeeping from "../components/shared/HousekeepingSidebar"

const LayoutHousekeeping = () => {
  return (
    <div className="lg:flex lg:h-screen md:h-screen" >
      <SidebarHousekeeping />
      <div className="lg:flex-1 flex flex-col " >
        <main className="lg:flex-1 p-6 bg-gray-100 overflow-y-auto h-screen" >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
export default LayoutHousekeeping