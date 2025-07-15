import React, { useState, useEffect, useCallback, useMemo } from "react"
import useHotelStore from "../../store/hotel-store"
import CountdownTimer from "../../routes/CountdownTimer"
import dayjs from "dayjs"
import { Link } from "react-router-dom"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { allListCleaningReport } from "../../api/cleaning"

const ListAllCleaningReport = () => {
    const token = useHotelStore((state) => state.token)
    const [cleaningReports, setCleaningReports] = useState([])
    const [startDate, setStartDate] = useState(dayjs().toDate())
    const [endDate, setEndDate] = useState(dayjs().toDate())
    const [dateRangeClick, setDateRangeClick] = useState("today")
    const [selectedStatus, setSelectedStatus] = useState(null)

    const fetchCleaningReports = useCallback(async () => {
        try {
            console.log("Fetching Cleaning Reports...")
            const response = await allListCleaningReport(token)

            console.log("Full API Response:", response)
            console.log("response.data:", response.data)

            // ตรวจสอบว่า response.data เป็น array หรือไม่
            setCleaningReports(Array.isArray(response.data) ? response.data : [])
        } catch (error) {
            console.error("Error fetching cleaning reports:", error)
            setCleaningReports([])
        }
    }, [token])


    useEffect(() => {
        fetchCleaningReports()
        const interval = setInterval(fetchCleaningReports, 15000)
        return () => clearInterval(interval)
    }, [fetchCleaningReports])

    const formatDateTime = (dateString, format = "DD/MM/YYYY HH:mm:ss") => {
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

    const filteredCleaningReports = useMemo(() => {
        return cleaningReports.filter((item) => {
            const requestDate = dayjs(item.reportAt)
            const isStatusMatch = selectedStatus !== null ? item.cleaningReportStatusId === selectedStatus : true
            const isInDateRange =
                (!startDate || requestDate.isAfter(dayjs(startDate).startOf("day"))) &&
                (!endDate || requestDate.isBefore(dayjs(endDate).endOf("day")))
            return isStatusMatch && isInDateRange
        })
    }, [cleaningReports, selectedStatus, startDate, endDate])

    // mapping สีตาม cleaningReportStatus
    const statusColors = {
        PENDING: "bg-red-100 text-red-600",
        VERIFIED: "bg-green-100 text-green-600",
    }

    return (
        <div className="w-10/12 mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-brown">PHUPHAN PLACE</h1>
                <CountdownTimer duration={15} onReset={fetchCleaningReports} />
            </div>

            <div className="flex justify-center space-x-4 mb-4">
                {[{ id: "today", label: "วันนี้" }, { id: "week", label: "อาทิตย์นี้" }, { id: "month", label: "เดือนนี้" }, { id: "all", label: "ทั้งหมด" }].map(({ id, label }) => (
                    <button key={id} onClick={() => setDateRange(id)} className={`p-2 border rounded-md transition duration-300 ${dateRangeClick === id ? "bg-brown text-white" : "bg-gray-100 hover:bg-gray-200"}`}>
                        {label}
                    </button>
                ))}
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy" className="p-2 border rounded-md" placeholderText="เลือกวันเริ่มต้น" />
                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="dd/MM/yyyy" className="p-2 border rounded-md" placeholderText="เลือกวันสิ้นสุด" />
            </div>

            <div className="grid grid-cols-3 gap-2 border-b pb-3 border-gray-300 text-center text-lg font-medium text-gray-600">
                {[{ id: null, label: "ทั้งหมด" }, { id: 1, label: "รอการตรวจสอบ" }, { id: 2, label: "ตรวจสอบแล้ว" }].map(({ id, label }) => (
                    <button key={id} onClick={() => setSelectedStatus(id)}
                        className={`w-full p-2 rounded-lg transition duration-300 ${selectedStatus === id ? "bg-brown text-white" : "hover:bg-gray-100"}`}>
                        {label}
                    </button>
                ))}
            </div>

            <div className="mt-4 space-y-4">
                {filteredCleaningReports.length > 0 ? (
                    filteredCleaningReports.map((item) => {
                        // ดึงข้อมูลพนักงานทำความสะอาด ถ้ามี
                        const cleaner = item.housekeeping?.user || {}

                        return (
                            <Link
                                to={`/front/list-cleaning-report/${item.reportId}`}
                                key={item.reportId}
                                className="block p-5 border rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-200"
                            >
                                <div className="flex justify-between items-center">
                                    <p className="text-xl font-medium text-gray-800">
                                        รายงานทำความสะอาดที่ {item.reportId}
                                    </p>
                                    <span
                                        className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[item.cleaningReportStatus] || "bg-gray-200 text-gray-600"}`}
                                    >
                                        {item.cleaningReportStatus}
                                    </span>
                                </div>
                                <p className="text-gray-700 mt-2">
                                    ผู้ทำความสะอาด: {cleaner.prefix || ""} {cleaner.userName || "ไม่ระบุ"} {cleaner.userSurName || ""}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    เบอร์โทร: {cleaner.userNumPhone || "ไม่มีข้อมูล"}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    เวลาบันทึก: {formatDateTime(item.reportAt)}
                                </p>
                            </Link>
                        )
                    })
                ) : (
                    <div className="text-center py-6 text-gray-500">
                        <p className="text-lg">ไม่มีข้อมูลรายงานทำความสะอาด</p>
                    </div>
                )}
            </div>

        </div>
    )
}

export default ListAllCleaningReport
