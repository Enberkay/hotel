import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import dayjs from "dayjs"
import useRepairStore from "../../store/repair-store"
import { notedRepairRequest, repairReport } from "../../api/repair"
import { useTranslation } from 'react-i18next';

const FormRepairReport = () => {
    const { t } = useTranslation(['repair', 'common']);
    const navigate = useNavigate()
    const token = useRepairStore((state) => state.token)
    const repairStatuses = useRepairStore((state) => state.repairStatuses)
    const getRepairStatus = useRepairStore((state) => state.getRepairStatus)
    const getRepairRequest = useRepairStore((state) => state.getRepairRequest)
    const repairRequests = useRepairStore((state) => state.repairRequests)

    const [selectedRequest, setSelectedRequest] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [repairDetails, setRepairDetails] = useState({})

    useEffect(() => {
        getRepairRequest(token)
        getRepairStatus(token)
    }, [token])

    const formatDateTime = (dateString) => {
        return dateString ? dayjs(dateString).format("DD/MM/YYYY HH:mm:ss") : "-"
    }

    const pendingRequests = repairRequests.filter(
        (req) => req.repairRequestStatusId === 1 || req.repairRequestStatusId === 2
    )

    const handleSelectRequest = async (req) => {
        if (window.confirm(t('common:are_you_sure'))) {
            try {
                await notedRepairRequest(token, req.requestId)
                setSelectedRequest(req)
                setIsModalOpen(false)
                toast.success(t('select_repair_success'))
            } catch (error) {
                console.error("Error:", error)
                toast.error(t('select_repair_error'))
            }
        }
    }

    const handleOnChange = (e, roomId, field) => {
        setRepairDetails((prevDetails) => ({
            ...prevDetails,
            [roomId]: {
                ...prevDetails[roomId],
                [field]: e.target.value,
            },
        }))
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault()

        if (!selectedRequest) {
            toast.error(t('please_select_repair'))
            return
        }

        const repairData = {
            repairRequestId: selectedRequest.requestId,
            ...repairDetails
        }

        try {
            await repairReport(token, repairData)
            toast.success(t('repair_report_success'))
            navigate('/maintenance/repair-request')
        } catch (error) {
            console.error(error)
            toast.error(t('repair_report_error'))
        }
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">{t('repair_report_form')}</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">{t('select_repair_request')}</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    {t('select_request')}
                </button>

                {selectedRequest && (
                    <div className="mt-4 p-4 border rounded-md bg-gray-50">
                        <p><strong>{t('request_number')}:</strong> {selectedRequest.requestId}</p>
                        <p><strong>{t('request_at')}:</strong> {formatDateTime(selectedRequest.createdAt)}</p>
                        <p><strong>{t('room:room_number')}:</strong> {selectedRequest.CleaningReport.Room.roomNumber}</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
                        <h3 className="text-xl font-bold mb-4">{t('pending_requests')}</h3>
                        <div className="max-h-96 overflow-y-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-2 px-4">{t('request_number')}</th>
                                        <th className="py-2 px-4">{t('request_at')}</th>
                                        <th className="py-2 px-4">{t('room:room_number')}</th>
                                        <th className="py-2 px-4">{t('common:action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingRequests.length > 0 ? (
                                        pendingRequests.map((req) => (
                                            <tr key={req.requestId} className="border-b">
                                                <td className="py-2 px-4">{req.requestId}</td>
                                                <td className="py-2 px-4">{formatDateTime(req.createdAt)}</td>
                                                <td className="py-2 px-4">{req.CleaningReport.Room.roomNumber}</td>
                                                <td className="py-2 px-4">
                                                    <button
                                                        onClick={() => handleSelectRequest(req)}
                                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                                    >
                                                        {t('common:select')}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4">{t('no_pending_requests')}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">
                            {t('common:close')}
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleOnSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">{t('room_details')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">{t('room:room_number')}</label>
                        <p className="mt-1 p-2 border rounded-md bg-gray-100">{selectedRequest?.CleaningReport.Room.roomNumber || "-"}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">{t('room:floor')}</label>
                        <p className="mt-1 p-2 border rounded-md bg-gray-100">{selectedRequest?.CleaningReport.Room.floor || "-"}</p>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium">{t('write_details')}</label>
                    <textarea
                        name="repairedItem"
                        onChange={(e) => setRepairDetails({ ...repairDetails, repairedItem: e.target.value })}
                        className="mt-1 block w-full p-2 border rounded-md"
                        rows="3"
                    ></textarea>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium">{t('common:status')}</label>
                    <select
                        name="repairStatusId"
                        onChange={(e) => setRepairDetails({ ...repairDetails, repairStatusId: parseInt(e.target.value) })}
                        className="mt-1 block w-full p-2 border rounded-md"
                    >
                        <option value="">{t('common:please_select')}</option>
                        {repairStatuses.map((status) => (
                            <option key={status.repairStatusId} value={status.repairStatusId}>
                                {status.repairStatusName}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                    {t('submit_repair_report')}
                </button>
            </form>
        </div>
    )
}

export default FormRepairReport
