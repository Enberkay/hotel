import React, { useEffect, useState } from "react"
import { createBookingStatus } from "../../api/bookingStatus"
import useHotelStore from "../../store/hotel-store"
import { toast } from "react-toastify"

const bookingStatusList = ["รอยืนยัน", "อนุมัติแล้ว", "Checked-in", "Checked-out", "ยกเลิก", "ไม่มาแสดงตัว"]

const BookingStatusManager = () => {
    const token = useHotelStore((state) => state.token)
    const bookingStatuses = useHotelStore((state) => state.bookingStatuses)
    const getBookingStatus = useHotelStore((state) => state.getBookingStatus)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getBookingStatus(token)
    }, [token, getBookingStatus])

    const handleAddNextStatus = async () => {
        if (bookingStatuses.length >= bookingStatusList.length) return

        setLoading(true)
        const nextStatus = bookingStatusList[bookingStatuses.length]

        try {
            const res = await createBookingStatus(token, { bookingStatusName: nextStatus })
            getBookingStatus(token)
            toast.success(`เพิ่มสถานะใบจอง: ${res.data.bookingStatusName}`)
        } catch (err) {
            console.error(err)
            toast.error(err.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มสถานะ")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-4 bg-white shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">สถานะใบจอง</h1>
            <div className="flex flex-col items-center space-y-4">
                {bookingStatusList.map((status, index) => (
                    <div
                        key={index}
                        className={`w-64 p-3 rounded-md text-white text-center ${bookingStatuses.some((s) => s.bookingStatusName === status) ? "bg-green-500" : "bg-gray-300"
                            }`}
                    >
                        {status}
                    </div>
                ))}

                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200 disabled:bg-gray-400"
                    onClick={handleAddNextStatus}
                    disabled={bookingStatuses.length >= bookingStatusList.length || loading}
                >
                    {loading ? "กำลังเพิ่ม..." : "เพิ่มสถานะถัดไป"}
                </button>
            </div>
        </div>
    )
}

export default BookingStatusManager
