import React, { useState, useEffect } from "react"
import useAuthStore from "../store/auth-store"
import { currentAdmin } from "../api/auth"
import LoadingToredirect from "./LoadingToRedirect"

const ProtectRouteAdmin = ({ element }) => {
    const [ok, setOk] = useState(false)
    const user = useAuthStore((state) => state.user)
    const token = useAuthStore((state) => state.token)

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