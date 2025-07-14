
import { useState, useEffect } from "react"
import useHotelStore from "../store/hotel-store"
import { currentFront } from "../api/auth"
import LoadingToRedirect from "./LoadingToRedirect"

const ProtectRouteFront = ({ element }) => {
  const [ok, setOk] = useState(false)
  const user = useHotelStore((state) => state.user)
  const token = useHotelStore((state) => state.token)
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