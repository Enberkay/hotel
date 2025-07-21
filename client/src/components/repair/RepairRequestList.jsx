import { useEffect, useState, useMemo, useCallback, useRef } from "react"
import { Link } from "react-router-dom"
import useRepairStore from "../../store/repair-store"
import dayjs from "dayjs"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import CountdownTimer from "../../routes/CountdownTimer"
import { useTranslation } from 'react-i18next';

const ListRepairRequest = () => {
    const { t } = useTranslation();
    const token = useRepairStore((state) => state.token)
    const getRepairRequest = useRepairStore((state) => state.getRepairRequest)
    const repairRequests = useRepairStore((state) => state.repairRequests)

    const [startDate, setStartDate] = useState(dayjs().toDate())
    const [endDate, setEndDate] = useState(dayjs().toDate())
    const [dateRangeClick, setDateRangeClick] = useState("today")
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [showPopup, setShowPopup] = useState(false)
    const [newRequests, setNewRequests] = useState([])

    const prevRequestsRef = useRef([])

    const fetchRepairRequests = useCallback(() => {
        getRepairRequest(token)
    }, [token, getRepairRequest])

    useEffect(() => {
        fetchRepairRequests()
        console.log("cleaningRequests:", repairRequests)
        const interval = setInterval(fetchRepairRequests, 15000)
        return () => clearInterval(interval)
    }, [fetchRepairRequests])

    useEffect(() => {
        if (!Array.isArray(repairRequests)) return
        if (prevRequestsRef.current.length > 0 && repairRequests.length > prevRequestsRef.current.length) {
            const newItems = repairRequests.slice(prevRequestsRef.current.length)
            setNewRequests(newItems)
            setShowPopup(true)
            setTimeout(() => setShowPopup(false), 5000)
        }
        prevRequestsRef.current = repairRequests
    }, [repairRequests])

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

    const filteredRepairRequests = useMemo(() => {
        return repairRequests.filter((item) => {
            if (!item || item.repairRequestStatusId === undefined) return false
            const requestDate = dayjs(item.reportAt)
            const isStatusMatch = selectedStatus !== null ? item.repairRequestStatusId === selectedStatus : true
            const isInDateRange =
                (!startDate || requestDate.isAfter(dayjs(startDate).startOf("day"))) &&
                (!endDate || requestDate.isBefore(dayjs(endDate).endOf("day")))
            return isStatusMatch && isInDateRange
        })
    }, [repairRequests, selectedStatus, startDate, endDate])

    return (
        <>

            {/* จอเล็ก */}
            <div className="lg:hidden md:hidden bg-white shadow-md rounded-lg py-5 px-4 mt-14 min-h-screen h-full">
                <header className="grid justify-items-center gap-2 py-2">
                    {showPopup && (
                        <div className="bg-blue-500 px-1 text-white rounded-md shadow-md">
                            <p>{t('new_repair_requests', { count: newRequests.length })}</p>
                        </div>
                    )}

                    <div className="text-2xl font-semibold text-brown">
                        <h1>{t('phuphan_place')}</h1>
                    </div>

                    <DatePicker selected={startDate} onChange={(date) =>
                        setStartDate(date)} dateFormat="dd/MM/yyyy"
                        className="text-center p-2 border rounded-md shadow-md" placeholderText={t('select_start_date')}
                    />
                    <DatePicker selected={endDate} onChange={(date) =>
                        setEndDate(date)} dateFormat="dd/MM/yyyy"
                        className="text-center p-2 border rounded-md shadow-md" placeholderText={t('select_end_date')}
                    />

                    <div className="grid grid-cols-2 gap-x-2 text-md">
                        <select
                            value={dateRangeClick}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="text-center  p-2 border rounded-md bg-gray-100 transition duration-300 shadow-md"
                        >
                            <option value="all">{t('all')}</option>
                            <option value="today">{t('today')}</option>
                            <option value="week">{t('this_week')}</option>
                            <option value="month">{t('this_month')}</option>
                        </select>
                        <select
                            value={selectedStatus !== null ? String(selectedStatus) : ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedStatus(value === "" ? null : parseInt(value, 10));
                            }}
                            className="w-full p-2 rounded-lg border bg-gray-100 transition duration-300 shadow-md"
                        >
                            <option value="">{t('all')}</option>
                            <option value="1">{t('pending')}</option>
                            <option value="2">{t('checked')}</option>
                            <option value="3">{t('completed')}</option>
                        </select>
                    </div>
                    <CountdownTimer duration={15} onReset={fetchRepairRequests} />
                </header>

                <hr className="my-2" />

                <main>
                    <div className="mt-4 space-y-4">
                        {filteredRepairRequests.length > 0 ? (
                            filteredRepairRequests.map((item, index) => (
                                <div key={index} className="flex bg-gray-50 rounded-md p-5 shadow-md">
                                    <Link
                                        to={`/maintenance/repair-request/${item.requestId}`}
                                        key={item.requestId}
                                        className=""
                                    >
                                        <div>
                                            <p className="font-semibold my-2">{t('repair_request_id', { id: item.requestId })}</p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 text-sm font-semibold rounded-md ${(() => {
                                                switch (item.repairRequestStatusId) {
                                                    case 1:
                                                        return "bg-red-100 text-red-600";
                                                    case 2:
                                                        return "bg-yellow-100 text-yellow-600";
                                                    case 3:
                                                        return "bg-green-100 text-green-600";
                                                    default:
                                                        return "bg-gray-100 text-gray-600";
                                                }
                                            })()}`}
                                        >
                                            {(() => {
                                                switch (item.repairRequestStatusId) {
                                                    case 1:
                                                        return t('pending');
                                                    case 2:
                                                        return t('checked');
                                                    case 3:
                                                        return t('completed');
                                                    default:
                                                        return t('unknown_status');
                                                }
                                            })()}
                                        </span>
                                        <p className="text-gray-700 text-sm my-2">{t('reporter')}: {item.front?.user ? `${item.front.user.userName ?? "-"} ${item.front.user.userSurName ?? ""}` : "-"}</p>
                                        <p className="text-gray-600 text-xs">{t('report_time')}: {formatDateTime(item.requestAt)}</p>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-gray-500">
                                <p className="text-lg">{t('no_repair_requests')}</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>









            {/* จอใหญ่ */}
            <div className="hidden 2xl:flex 2xl:flex-col md:grid md:grid-cols-1 w-10/12 mx-auto md:mt-14 xl:mt-8 p-6 bg-white shadow-md rounded-lg ">
                <div className="flex justify-between items-center mb-6 ">
                    <h1 className="text-3xl font-semibold text-brown">{t('phuphan_place')}</h1>
                    <CountdownTimer duration={15} onReset={fetchRepairRequests} />
                </div>

                {showPopup && (
                    <div className="fixed top-5 right-5 bg-blue-500 text-white px-5 py-2 rounded-md shadow-md">
                        <p>{t('new_repair_requests', { count: newRequests.length })}</p>
                    </div>
                )}

                <div className=" 2xl:grid 2xl:grid-cols-5 2xl:gap-x-2 xl:flex xl:flex-wrap xl:justify-evenly xl:gap-y-2  md:grid md:grid-cols-1 md:gap-y-2">
                    <div className="2xl:col-end-5 2xl:col-span-1 2xl:flex 2xl:space-x-5 2xl:justify-center xl:order-last md:grid md:grid-cols-2 md:justify-items-center md:space-x-2">
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy" className="p-2 border rounded-md" placeholderText={t('select_start_date')} />
                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="dd/MM/yyyy" className="p-2 border rounded-md" placeholderText={t('select_end_date')} />
                    </div>

                    <div className="2xl:col-start-1 2xl:col-span-2 md:grid md:grid-cols-4 md:gap-2 md:border-b-0 pb-3 border-gray-300 text-center text-lg font-medium text-gray-600">
                        {[{ id: "today", label: t('today') }, { id: "week", label: t('this_week') }, { id: "month", label: t('this_month') }, { id: "all", label: t('all') }].map(({ id, label }) => (
                            <button key={id} onClick={() => setDateRange(id)} className={`p-2 border rounded-md transition duration-300 ${dateRangeClick === id ? "bg-brown text-white" : "bg-gray-100 hover:bg-gray-200"}`}>{label}</button>
                        ))}
                    </div>

                    <div className="2xl:col-start-2 2xl:col-span-3 2xl:order-last xl:order-last grid grid-cols-4 gap-2 xl:border-b-0 pb-3 border-gray-300 text-center text-lg font-medium text-gray-600">
                        {[{ id: null, label: t('all') }, { id: 1, label: t('pending') }, { id: 2, label: t('checked') }, { id: 3, label: t('completed')}].map(({ id, label }) => (
                            <button key={id} onClick={() => setSelectedStatus(id)}
                                className={`w-full p-2 rounded-lg transition duration-300 ${selectedStatus === id ? "bg-brown text-white" : "hover:bg-gray-100"}`}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <hr className="my-2" />

                <div className="mt-4 space-y-4">
                    {filteredRepairRequests.length > 0 ? (
                        filteredRepairRequests.map((item) => (
                            <Link
                                to={`/maintenance/repair-request/${item.requestId}`}
                                key={item.requestId}
                                className="block p-5 border rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-200"
                            >
                                <div className="flex justify-between items-center">
                                    <p className="text-xl font-medium text-gray-800">{t('repair_request_id', { id: item.requestId })}</p>
                                    <span
                                        className={`px-3 py-1 text-sm font-semibold rounded-full ${(() => {
                                            switch (item.repairRequestStatusId) {
                                                case 1:
                                                    return "bg-red-100 text-red-600";
                                                case 2:
                                                    return "bg-yellow-100 text-yellow-600";
                                                case 3:
                                                    return "bg-green-100 text-green-600";
                                                default:
                                                    return "bg-gray-100 text-gray-600";
                                            }
                                        })()}`}
                                    >
                                        {(() => {
                                            switch (item.repairRequestStatusId) {
                                                case 1:
                                                    return t('pending');
                                                case 2:
                                                    return t('checked');
                                                case 3:
                                                    return t('completed');
                                                default:
                                                    return t('unknown_status');
                                            }
                                        })()}
                                    </span>
                                </div>
                                <p className="text-gray-700 mt-2">{t('reporter')}: {item.front?.user ? `${item.front.user.userName ?? "-"} ${item.front.user.userSurName ?? ""}` : "-"}</p>
                                <p className="text-gray-600 text-sm">{t('report_time')}: {formatDateTime(item.requestAt)}</p>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-6 text-gray-500">
                            <p className="text-lg">{t('no_repair_requests')}</p>
                        </div>
                    )}
                </div>

            </div>
        </>
    )
}
export default ListRepairRequest