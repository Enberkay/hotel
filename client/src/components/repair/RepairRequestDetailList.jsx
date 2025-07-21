import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { readRepairRequest, notedRepairRequest } from "../../api/repair"
import useRepairStore from "../../store/repair-store"
import dayjs from "dayjs"
import { useTranslation } from 'react-i18next';

const ListRepairRequestDetail = () => {
    const { t } = useTranslation(['repair', 'common', 'user', 'room']);
    const navigate = useNavigate()
    const token = useRepairStore((state) => state.token)
    const [requestDetail, setRequestDetail] = useState(null)

    const fetchRepairRequests = async () => {
        try {
            const res = await readRepairRequest(token, id)
            console.log(res)
            setRequestDetail(res.data)
        } catch (err) {
            console.log("Error fetching data", err)
        }
    }

    useEffect(() => {
        fetchRepairRequests()
    }, [token, id])

    // ฟังก์ชันแปลงวันที่
    const formatDateTime = (dateString) => {
        return dateString ? dayjs(dateString).format("DD/MM/YYYY HH:mm:ss") : "-"
    }

    const handleNoted = async (requestId) => {
        await notedRepairRequest(token, requestId)
    }

    // ฟังก์ชันกดปุ่ม "ทำใบรายงานทำความสะอาด"
    const handleCreateRepairReport = async (requestId) => {
        if (window.confirm(t('common:are_you_sure_create_report'))) {
            await handleNoted(requestId)
            navigate("/maintenance/repair-report", { state: { requestId } })
        }
    }

    if (!requestDetail) {
        return <p className="text-center mt-5 text-gray-500">{t('common:loading')}</p>
    }

    return (
        <>
            {/* จอเล็ก */}
            <div className="sm:hidden">
                <div className="p-4 bg-white shadow-md rounded-lg">
                    <h2 className="text-xl font-bold mb-4">{t('repair_request_details')}</h2>
                    <div className="space-y-2">
                        <p><strong>{t('request_status')}:</strong> {requestDetail.RepairStatus.repairStatusName}</p>
                        <p><strong>{t('room:room_number')}:</strong> {requestDetail.CleaningReport.Room.roomNumber}</p>
                        <p><strong>{t('room:floor')}:</strong> {requestDetail.CleaningReport.Room.floor}</p>
                        <p><strong>{t('reporter_info')}:</strong> {requestDetail.User.userName} ({requestDetail.User.userNumPhone})</p>
                        <p><strong>{t('report_time')}:</strong> {formatDateTime(requestDetail.createdAt)}</p>
                        <p><strong>{t('common:detail')}:</strong> {requestDetail.CleaningReport.description}</p>
                    </div>
                    <div className="mt-4 flex justify-between">
                        <button onClick={() => navigate(-1)} className="bg-gray-500 text-white px-4 py-2 rounded">{t('common:back')}</button>
                        <button onClick={() => handleCreateRepairReport(requestDetail.requestId)} className="bg-blue-500 text-white px-4 py-2 rounded">{t('create_repair_report')}</button>
                    </div>
                </div>
            </div>

            {/* จอใหญ่ */}
            <div className="hidden sm:block container mx-auto p-6">
                <div className="bg-white shadow-lg rounded-xl p-8">
                    <h1 className="text-3xl font-bold mb-6">{t('repair_request_details')}</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-600">{t('request_status')}</h2>
                                <p className="text-xl">{requestDetail.RepairStatus.repairStatusName}</p>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-600">{t('reporter_info')}</h2>
                                <p>{t('user:name')}: {requestDetail.User.userName} {requestDetail.User.userSurName}</p>
                                <p>{t('user:phone')}: {requestDetail.User.userNumPhone}</p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-600">{t('room:room_details')}</h2>
                                <p>{t('room:room_number')}: {requestDetail.CleaningReport.Room.roomNumber}</p>
                                <p>{t('room:floor')}: {requestDetail.CleaningReport.Room.floor}</p>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-600">{t('report_time')}</h2>
                                <p>{formatDateTime(requestDetail.createdAt)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-gray-600">{t('common:detail')}</h2>
                        <p className="mt-2 p-4 bg-gray-100 rounded-lg">{requestDetail.CleaningReport.description}</p>
                    </div>
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            onClick={() => navigate('/maintenance/repair-request')}
                            className="bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-400 transition"
                        >
                            {t('common:back')}
                        </button>
                        <button
                            onClick={() => handleCreateRepairReport(requestDetail.requestId)}
                            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
                        >
                            {t('create_repair_report')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ListRepairRequestDetail;