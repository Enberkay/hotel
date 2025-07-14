import react, { useEffect } from "react"
import AppRoutes from "./routes/AppRoutes"
import { ToastContainer } from 'react-toastify'
import useHotelStore from "./store/hotel-store"

const App = () => {

  useEffect(() => {
    const checkTokenInterval = setInterval(() => {
      useHotelStore.getState().checkAndLogoutIfExpired()
    }, 300000) // ตรวจสอบทุก 5 นาที (300,000 ms)

    return () => clearInterval(checkTokenInterval) // ล้าง Interval เมื่อ Component ถูก Unmount
  }, [])

  return (
    <>
      <ToastContainer />
      <AppRoutes />
    </>
  )
}
export default App