import { useEffect, useState, useMemo, useCallback, useRef } from "react"
import { Link } from "react-router-dom"
import useRepairStore from "../../store/repair-store"
import dayjs from "dayjs"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import CountdownTimer from "../../routes/CountdownTimer"
import { useTranslation } from 'react-i18next';

const ListRepairRequest = () => {
    const { t } = useTranslation(['repair', 'common', 'room']);
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

    // Popup component
    const Popup = ({ requests }) => (
        <div className="fixed bottom-4 right-4 bg-white p-4 shadow-lg rounded-lg z-50">
            <h3 className="font-bold">{t("new_repair_requests_popup_title")}</h3>
            <ul>
                {requests.map(req => (
                    <li key={req.requestId}>{t("repair_request_id", { id: req.requestId })}</li>
                ))}
            </ul>
        </div>
    );
    // ฟังก์ชันสำหรับกำหนดสีของสถานะ
    const statusColor = (statusId) => {
        switch (statusId) {
            case 1:
                return "bg-red-100 text-red-600";
            case 2:
                return "bg-yellow-100 text-yellow-600";
            case 3:
                return "bg-green-100 text-green-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const getStatusText = (statusId) => {
        switch (statusId) {
            case 1:
                return t('pending');
            case 2:
                return t('checked');
            case 3:
                return t('completed');
            default:
                return t('unknown_status');
        }
    };

    const handleDateRangeClick = (type) => {
        setDateRangeClick(type);
        if (type === "today") {
            setStartDate(dayjs().toDate());
            setEndDate(dayjs().toDate());
        } else if (type === "week") {
            setStartDate(dayjs().startOf("week").toDate());
            setEndDate(dayjs().endOf("week").toDate());
        } else if (type === "month") {
            setStartDate(dayjs().startOf("month").toDate());
            setEndDate(dayjs().endOf("month").toDate());
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">{t('repair_requests')}</h1>
                {newRequests.length > 0 && <span className="text-red-500">{t('new_repair_requests', { count: newRequests.length })}</span>}
            </div>

            {/* Popup for new requests */}
            {showPopup && <Popup requests={newRequests} />}

            {/* Filter controls */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('common:select_start_date')}</label>
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('common:select_end_date')}</label>
                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('common:status')}</label>
                        <select
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            value={selectedStatus || ""}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">{t('common:all')}</option>
                            <option value="1">{t('common:pending')}</option>
                            <option value="2">{t('checked')}</option>
                            <option value="3">{t('common:completed')}</option>
                        </select>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => handleDateRangeClick("today")} className={`px-4 py-2 rounded-md text-sm font-medium ${dateRangeClick === "today" ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>{t('common:today')}</button>
                        <button onClick={() => handleDateRangeClick("this_week")} className={`px-4 py-2 rounded-md text-sm font-medium ${dateRangeClick === "this_week" ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>{t('common:this_week')}</button>
                        <button onClick={() => handleDateRangeClick("this_month")} className={`px-4 py-2 rounded-md text-sm font-medium ${dateRangeClick === "this_month" ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>{t('common:this_month')}</button>
                    </div>
                </div>
            </div>

            {/* Request list */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-2 px-4 text-left">{t('request_id')}</th>
                                <th className="py-2 px-4 text-left">{t('room:room_number')}</th>
                                <th className="py-2 px-4 text-left">{t('room:floor')}</th>
                                <th className="py-2 px-4 text-left">{t('reporter')}</th>
                                <th className="py-2 px-4 text-left">{t('report_time')}</th>
                                <th className="py-2 px-4 text-left">{t('common:status')}</th>
                                <th className="py-2 px-4 text-left">{t('countdown')}</th>
                                <th className="py-2 px-4 text-left">{t('common:detail')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRepairRequests.length > 0 ? filteredRepairRequests.map((request) => (
                                <tr key={request.requestId} className="border-b">
                                    <td className="py-2 px-4">{request.requestId}</td>
                                    <td className="py-2 px-4">{request.CleaningReport.Room.roomNumber}</td>
                                    <td className="py-2 px-4">{request.CleaningReport.Room.floor}</td>
                                    <td className="py-2 px-4">{request.User.userName}</td>
                                    <td className="py-2 px-4">{formatDateTime(request.createdAt)}</td>
                                    <td className="py-2 px-4">
                                        <span className={statusColor(request.repairStatusId)}>{getStatusText(request.repairStatusId)}</span>
                                    </td>
                                    <td className="py-2 px-4">
                                        <CountdownTimer startTime={request.createdAt} />
                                    </td>
                                    <td className="py-2 px-4">
                                        <Link to={`/maintenance/repair-request/${request.requestId}`} className="text-blue-500 hover:underline">
                                            {t('common:view_detail')}
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">{t('no_repair_requests')}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListRepairRequest;