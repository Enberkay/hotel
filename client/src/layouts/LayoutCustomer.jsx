import { Outlet } from "react-router-dom"
import MainNav from "../components/MainNav"

const LayoutCustomer = () => {
  return (
    <div className="flex h-screen">
      <MainNav />
      <main className="w-full overflow-auto mt-20">
        <Outlet />
      </main>
    </div>

  )
}
export default LayoutCustomer