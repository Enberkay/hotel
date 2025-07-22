import { Outlet } from "react-router-dom"
import MainNav from "../components/shared/MainNav"
import LanguageSwitcher from "../components/shared/LanguageSwitcher";

const LayoutCustomer = () => {
  return (
    <div className="flex flex-col h-screen">
      <LanguageSwitcher />
      <div className="flex flex-1">
        <MainNav />
        <main className="w-full overflow-auto mt-20">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
export default LayoutCustomer