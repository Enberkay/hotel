
// สำหรับ redirect เท่ๆ เฉยๆ

import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

const LoadingToredirect = () => {

    const [count, setCount] = useState(3)
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((currentCount) => {
                if (currentCount === 1) {
                    clearInterval(interval)
                    setRedirect(true)
                }
                return currentCount - 1
            })

        }, 1000)

        return () => clearInterval(interval)
    }, []) // [] กัน infinity loop

    if (redirect) {
        return <Navigate to={"/"} />
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                <h2 className="text-xl font-semibold text-red-500">Access Denied</h2>
                <p className="mt-2 text-gray-600">Redirecting in <span className="font-bold">{count}</span> seconds...</p>
                <div className="mt-4 w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-red-500 transition-all ease-linear"
                        style={{ width: `${(count / 3) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    )
}
export default LoadingToredirect