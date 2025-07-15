
import { useState, useEffect } from "react"
import useAuthStore from "../store/auth-store"
import { currentFront } from "../api/auth"
import LoadingToRedirect from "./LoadingToRedirect"

const ProtectRouteFront = ({ element }) => {
  const [ok, setOk] = useState(false)
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  //   console.log(token)

  useEffect(() => {
    if (user && token) {
      // send to backend
      currentFront(token)
        .then((res) => setOk(true))
        .catch((err) => setOk(false))

    }
  }, [])

  return ok ? element : <LoadingToRedirect />
}
export default ProtectRouteFront