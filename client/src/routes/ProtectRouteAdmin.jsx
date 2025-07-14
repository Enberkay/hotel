import React, { useState, useEffect } from "react"
import useHotelStore from "../store/hotel-store"
import { currentAdmin } from "../api/auth"
import LoadingToredirect from "./LoadingToRedirect"

const ProtectRouteAdmin = ({ element }) => {
    const [ok, setOk] = useState(false)
    const user = useHotelStore((state) => state.user)
    const token = useHotelStore((state) => state.token)

    useEffect(() => {
        if (user && token) {
            currentAdmin(token)
                .then((res) => setOk(true))
                .catch((err) => setOk(false))
        }
    }, [])
    return ok ? element : <LoadingToredirect />
}

export default ProtectRouteAdmin