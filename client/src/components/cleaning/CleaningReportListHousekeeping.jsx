import { useEffect, useState, useMemo, useCallback } from "react"
import { Link } from "react-router-dom"
import useCleaningStore from "../../store/cleaning-store"
import dayjs from "dayjs"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import CountdownTimer from "../../routes/CountdownTimer"
import { listCleaningReport } from "../../api/cleaning"

const CleaningReportListHousekeeping = () => {
    const token = useCleaningStore((state) => state.token)
    const [cleaningReports, setCleaningReports] = useState([])
    const [startDate, setStartDate] = useState(dayjs().toDate())
    const [endDate, setEndDate] = useState(dayjs().toDate())
    const [dateRangeClick, setDateRangeClick] = useState("today")
    const [selectedStatus, setSelectedStatus] = useState(null)

    const fetchCleaningReports = useCallback(async () => {
        try {
            // console.log("Fetching Cleaning Reports...")
            const response = await listCleaningReport(token)

            // console.log("Full API Response:", response) // ตรวจสอบทั้งหมด
            // console.log("response.data:", response.data) // ตรวจสอบเฉพาะ data

            if (Array.isArray(response.data)) {
                setCleaningReports(response.data) //ใช้ response.data ตรงๆ
            } else {
                console.error("response.data is not an array!", response.data)
                setCleaningReports([])
            }
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
            if (!item || item.cleaningReportStatusId === undefined) return false
            const reportDate = dayjs(item.reportAt)
            const isStatusMatch = selectedStatus !== null ? item.cleaningReportStatusId === selectedStatus : true
            const isInDateRange =
                (!startDate || reportDate.isAfter(dayjs(startDate).startOf("day"))) &&
                (!endDate || reportDate.isBefore(dayjs(endDate).endOf("day")))
            return isStatusMatch && isInDateRange
        })
    }, [cleaningReports, selectedStatus, startDate, endDate])

    return (
        <>
            {/* จอเล็ก */}
            <div className="lg:hidden md:hidden bg-white shadow-md rounded-lg py-5 px-4 mt-14 min-h-screen h-full">
                <header className="grid justify-items-center gap-2 py-2">
                    <div className="text-2xl font-semibold text-brown">
                        <h1>PHUPHAN PLACE</h1>
                    </div>

                    <DatePicker selected={startDate} onChange={(date) =>
                        setStartDate(date)} dateFormat="dd/MM/yyyy"
                        className="text-center p-2 border rounded-md shadow-md" placeholderText="เลือกวันเริ่มต้น"
                    />
                    <DatePicker selected={endDate} onChange={(date) =>
                        setEndDate(date)} dateFormat="dd/MM/yyyy"
                        className="text-center p-2 border rounded-md shadow-md" placeholderText="เลือกวันสิ้นสุด"
                    />

                    <div className="grid grid-cols-2 gap-x-2 text-md">
                        <select
                            value={dateRangeClick}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="text-center  p-2 border rounded-md bg-gray-100 transition duration-300 shadow-md"
                        >
                            <option value="all">ทั้งหมด</option>
                            <option value="today">วันนี้</option>
                            <option value="week">อาทิตย์นี้</option>
                            <option value="month">เดือนนี้</option>
                        </select>
                        <select
                            value={selectedStatus !== null ? String(selectedStatus) : ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedStatus(value === "" ? null : parseInt(value, 10));
                            }}
                            className="w-full p-2 rounded-lg border bg-gray-100 transition duration-300 shadow-md"
                        >
                            <option value="">ทั้งหมด</option>
                            <option value="1">รอดำเนินการ</option>
                            <option value="2">รับเรื่องแล้ว</option>
                            <option value="3">เสร็จสิ้น</option>
                        </select>
                    </div>
                    <CountdownTimer duration={15} onReset={fetchCleaningReports} />
                </header>

                <hr className="my-2" />

                <main>
                    <div className="mt-4 space-y-4">
                        {filteredCleaningReports.length > 0 ? (
                            filteredCleaningReports.map((item, index) => (
                                <div key={index} className="flex bg-gray-50 rounded-md p-5 shadow-md">
                                    <Link
                                        to={`/housekeeping/list-cleaning-report/${item.reportId}`}
                                        key={item.reportId}
                                        className=""
                                    >
                                        <div >
                                            <p className="font-semibold my-2">
                                                รายงานทำความสะอาดที่ {item.reportId}
                                            </p>
                                            <span
                                                className={`px-3 py-1 text-sm font-semibold rounded-md
                                                ${item.cleaningReportStatusId === 1
                                                        ? "bg-red-100 text-red-600"
                                                        : "bg-green-100 text-green-600"
                                                    }`}
                                            >
                                                {item.cleaningReportStatusId === 1 ? "รอการตรวจสอบ" : "ตรวจสอบแล้ว"}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm my-2">
                                            ผู้รายงาน:{" "}
                                            {item.housekeeping?.user
                                                ? `${item.housekeeping.user.userName ?? "-"} ${item.housekeeping.user.userSurName ?? ""}`
                                                : "-"}
                                        </p>
                                        <p className="text-gray-600 text-xs">
                                            เวลาที่รายงาน: {formatDateTime(item.reportAt)}
                                        </p>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-gray-500">
                                <p className="text-lg">ไม่มีข้อมูลรายงานการทำความสะอาด</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>



            {/* จอใหญ่ */}
            <div className="hidden 2xl:flex 2xl:flex-col md:grid md:grid-cols-1 w-10/12 mx-auto md:mt-14 xl:mt-8 p-6 bg-white shadow-md rounded-lg ">
                <div className="flex justify-between items-center mb-6 ">
                    <h1 className="text-3xl font-semibold text-brown">PHUPHAN PLACE</h1>
                    <CountdownTimer duration={15} onReset={fetchCleaningReports} />
                </div>

                <div className=" 2xl:grid 2xl:grid-cols-5 2xl:gap-x-2 xl:flex xl:flex-wrap xl:justify-evenly xl:gap-y-2  md:grid md:grid-cols-1 md:gap-y-2">
                    <div className="2xl:col-end-5 2xl:col-span-1 2xl:flex 2xl:space-x-5 2xl:justify-center xl:order-last md:grid md:grid-cols-2 md:justify-items-center md:space-x-2">
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy" className="p-2 border rounded-md" placeholderText="เลือกวันเริ่มต้น" />
                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="dd/MM/yyyy" className="p-2 border rounded-md" placeholderText="เลือกวันสิ้นสุด" />
                    </div>

                    <div className="2xl:col-start-1 2xl:col-span-2 md:grid md:grid-cols-4 md:gap-2 md:border-b-0 pb-3 border-gray-300 text-center text-lg font-medium text-gray-600">
                        {[{ id: "today", label: "วันนี้" }, { id: "week", label: "อาทิตย์นี้" }, { id: "month", label: "เดือนนี้" }, { id: "all", label: "ทั้งหมด" }].map(({ id, label }) => (
                            <button key={id} onClick={() => setDateRange(id)} className={`p-2 border rounded-md transition duration-300 ${dateRangeClick === id ? "bg-brown text-white" : "bg-gray-100 hover:bg-gray-200"}`}>
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="2xl:col-start-2 2xl:col-span-3 2xl:order-last xl:order-last grid grid-cols-3 gap-2 xl:border-b-0 pb-3 border-gray-300 text-center text-lg font-medium text-gray-600">
                        {[{ id: null, label: "ทั้งหมด" }, { id: 1, label: "รอการตรวจสอบ" }, { id: 2, label: "ตรวจสอบแล้ว" }].map(({ id, label }) => (
                            <button key={id} onClick={() => setSelectedStatus(id)}
                                className={`w-full p-2 rounded-lg transition duration-300 ${selectedStatus === id ? "bg-brown text-white" : "hover:bg-gray-100"}`}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <hr className="my-2" />

                <div className="mt-4 space-y-4">
                    {filteredCleaningReports.length > 0 ? (
                        filteredCleaningReports.map((item) => (
                            <Link
                                to={`/housekeeping/list-cleaning-report/${item.reportId}`}
                                key={item.reportId}
                                className="block p-5 border rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-200"
                            >
                                <div className="flex justify-between items-center">
                                    <p className="text-xl font-medium text-gray-800">
                                        รายงานทำความสะอาดที่ {item.reportId}
                                    </p>
                                    <span
                                        className={`px-3 py-1 text-sm font-semibold rounded-full ${item.cleaningReportStatusId === 1
                                            ? "bg-red-100 text-red-600"
                                            : "bg-green-100 text-green-600"
                                            }`}
                                    >
                                        {item.cleaningReportStatusId === 1 ? "รอการตรวจสอบ" : "ตรวจสอบแล้ว"}
                                    </span>
                                </div>
                                <p className="text-gray-700 mt-2">
                                    ผู้รายงาน:{" "}
                                    {item.housekeeping?.user
                                        ? `${item.housekeeping.user.userName ?? "-"} ${item.housekeeping.user.userSurName ?? ""}`
                                        : "-"}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    เวลาที่รายงาน: {formatDateTime(item.reportAt)}
                                </p>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-6 text-gray-500">
                            <p className="text-lg">ไม่มีข้อมูลรายงานการทำความสะอาด</p>
                        </div>
                    )}
                </div>

            </div>
        </>
    )
}

export default CleaningReportListHousekeeping
