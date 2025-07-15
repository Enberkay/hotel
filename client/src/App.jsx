import react, { useEffect } from "react"
import AppRoutes from "./routes/AppRoutes"
import { ToastContainer } from 'react-toastify'
import useAuthStore from "./store/auth-store";

const App = () => {

  useEffect(() => {
    const checkTokenInterval = setInterval(() => {
      useAuthStore.getState().checkAndLogoutIfExpired();
    }, 300000);
    return () => clearInterval(checkTokenInterval);
  }, []);

  return (
    <>
      <ToastContainer />
      <AppRoutes />
    </>
  )
}
export default App