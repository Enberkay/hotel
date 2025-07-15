import React, { useState, useEffect, useCallback, useMemo } from "react"
import useBookingStore from "../../store/booking-store";
import useAuthStore from "../../store/auth-store";
import CountdownTimer from "../../routes/CountdownTimer"
import dayjs from "dayjs"
import { Link } from "react-router-dom"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"


//หมายเหตุ มีการกรอกวันก็จริงแต่อย่าลืมว่าข้อมูลถูกส่งมาทั้งหมด
const BookingList = () => {
    const token = useAuthStore((state) => state.token);
    const getBooking = useBookingStore((state) => state.getBooking);
    const bookings = useBookingStore((state) => state.bookings);

    const [lastBookingIds, setLastBookingIds] = useState([])
    const [newBookings, setNewBookings] = useState([])
    const [showPopup, setShowPopup] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [startDate, setStartDate] = useState(dayjs().toDate())
    const [endDate, setEndDate] = useState(dayjs().toDate())
    const [dateRangeClick, setDateRangeClick] = useState("today")

    const fetchBookings = useCallback(() => {
        getBooking(token)
        console.log(bookings)
    }, [token, getBooking])

    useEffect(() => {
        fetchBookings()
        const interval = setInterval(fetchBookings, 15000)
        return () => clearInterval(interval)
    }, [fetchBookings])

    useEffect(() => {
        const currentIds = bookings.map((b) => b.bookingId)
        if (lastBookingIds.length > 0) {
            const addedBookings = currentIds.filter((id) => !lastBookingIds.includes(id))
            if (addedBookings.length > 0) {
                setNewBookings(addedBookings)
                setShowPopup(true)
                const timer = setTimeout(() => setShowPopup(false), 5000) // ปิดอัตโนมัติใน 5 วินาที
                return () => clearTimeout(timer)
            }
        }
        setLastBookingIds(currentIds)
    }, [bookings])

    const formatDateTime = (dateString, format = "DD/MM/YYYY") => {
        return dateString ? dayjs(dateString).format(format) : "-"
    }

    const setDateRange = (type) => {
        setDateRangeClick(type)
        if (type === "today") {
            setStartDate(dayjs().toDate())
            setEndDate(dayjs().toDate())
        } else if (type === "week") {
            setStartDate(dayjs().startOf("week").toDate())
            setEndDate(dayjs().endOf("week").toDate())
        } else if (type === "month") {
            setStartDate(dayjs().startOf("month").toDate())
            setEndDate(dayjs().endOf("month").toDate())
        } else {
            setStartDate(null)
            setEndDate(null)
        }
    }

    const filteredBookings = useMemo(() => {
        return bookings.filter((item) => {
            const bookingDate = dayjs(item.createdAt)
            const isStatusMatch = selectedStatus !== null ? item.bookingStatus === selectedStatus : true
            const isInDateRange =
                (!startDate || bookingDate.isAfter(dayjs(startDate).startOf("day"))) &&
                (!endDate || bookingDate.isBefore(dayjs(endDate).endOf("day")))
            return isStatusMatch && isInDateRange
        })
    }, [bookings, selectedStatus, startDate, endDate])

    // mapping สีตาม bookingStatus
    const statusColors = {
        PENDING: "bg-red-100 text-red-600",
        APPROVED: "bg-green-100 text-green-600",
        CHECKED_IN: "bg-blue-100 text-blue-600",
        CHECKED_OUT: "bg-gray-200 text-gray-600",
        CANCELLED: "bg-gray-400 text-gray-600",
    }

    return (
        <div className="w-10/12 mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-[var(--color-brown)]" style={{'--color-brown':'#6A503D'}}>PHUPHAN PLACE</h1>
                <CountdownTimer duration={15} onReset={fetchBookings} />
            </div>

            {showPopup && (
                <div className="fixed top-5 right-5 bg-blue-500 text-white px-5 py-2 rounded-md shadow-md">
                    <p>มีการจองใหม่ {newBookings.length} รายการ</p>
                </div>
            )}

            <div className="flex justify-center space-x-4 mb-4">
                <div className="flex space-x-2 mb-4">
                    {[
                        { id: "today", label: "วันนี้" },
                        { id: "week", label: "อาทิตย์นี้" },
                        { id: "month", label: "เดือนนี้" },
                        { id: "all", label: "ทั้งหมด" }
                    ].map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => setDateRange(id)}
                            className={`p-2 border rounded-md transition duration-300 ${dateRangeClick === id ? "bg-brown text-white" : "bg-gray-100 hover:bg-gray-200"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="dd/MM/yyyy"
                    className="p-2 border rounded-md"
                    placeholderText="เลือกวันเริ่มต้น"
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="dd/MM/yyyy"
                    className="p-2 border rounded-md"
                    placeholderText="เลือกวันสิ้นสุด"
                />
            </div>

            <div className="grid grid-cols-6 gap-2 border-b pb-3 border-gray-300 text-center text-lg font-medium text-gray-600">
                {[{ id: null, label: "ทั้งหมด" }, { id: "PENDING", label: "รอยืนยัน" }, { id: "APPROVED", label: "อนุมัติแล้ว" }, { id: "CHECKED_IN", label: "เช็คอินแล้ว" }, { id: "CHECKED_OUT", label: "เช็คเอาท์" }, { id: "CANCELLED", label: "ยกเลิกจอง" }].map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => setSelectedStatus(id)}
                        className={`p-2 rounded-lg transition duration-300 ${selectedStatus === id ? "bg-[var(--color-brown)] text-white" : "hover:bg-gray-100"
                            }`} style={selectedStatus === id ? {'--color-brown':'#6A503D'} : {}}>
                        {label}
                    </button>
                ))}
            </div>

            <div className="mt-4 space-y-4">
                {filteredBookings.length > 0 ? (
                    filteredBookings.map((item) => (
                        <Link
                            key={item.bookingId}
                            to={`/front/booking/${item.bookingId}`}
                            className="block p-5 border rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-200">
                            <div className="flex justify-between items-center">
                                <p className="text-xl font-medium text-gray-800">เลขใบจองที่ {item.bookingId}</p>
                                <span
                                    className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[item.bookingStatus] || "bg-gray-200 text-gray-600"}`}>
                                    {item.bookingStatus}
                                </span>
                            </div>
                            <p className="text-gray-700 mt-2">คุณ {item.customer.user.userName} {item.customer.user.userSurName}</p>
                            <p className="text-gray-600 text-sm">ประเภทห้อง: {item.roomType.roomTypeName}</p>
                            <p className="text-gray-500 text-sm">เข้าพัก: {formatDateTime(item.checkInDate)}</p>
                            <p className="text-gray-500 text-sm">ออก: {formatDateTime(item.checkOutDate)}</p>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-6 text-gray-500">
                        <p className="text-lg">ไม่มีข้อมูลการจอง</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BookingList
