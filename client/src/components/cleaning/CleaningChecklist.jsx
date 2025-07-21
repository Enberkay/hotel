import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import useCleaningStore from "../../store/cleaning-store"
import { useTranslation } from 'react-i18next';


const CleaningChecklist = (props) => {
    const { t } = useTranslation(['cleaning', 'common']);
    const location = useLocation()
    const navigate = useNavigate()
    const token = useCleaningStore((state) => state.token)
    const getCleaningListItem = useCleaningStore((state) => state.getCleaningListItem)
    const cleaningListItems = useCleaningStore((state) => state.cleaningListItems)

    const { requestId, roomId } = location.state || {}
    const storageKey = `roomId_${roomId}`

    const [checklist, setChecklist] = useState([])

    useEffect(() => {
        const storedChecklist = sessionStorage.getItem(storageKey)
        if (storedChecklist) {
            setChecklist(JSON.parse(storedChecklist))
        } else {
            getCleaningListItem(token)
        }
    }, [roomId, token])

    useEffect(() => {
        if (cleaningListItems.length > 0) {
            setChecklist(cleaningListItems)
            sessionStorage.setItem(storageKey, JSON.stringify(cleaningListItems))
        }
    }, [cleaningListItems])

    const updateChecklist = (index, newStatus) => {
        const updatedChecklist = [...checklist]
        updatedChecklist[index].cleaningStatusId = newStatus
        if (newStatus === 1) {
            updatedChecklist[index].description = ""
        }
        setChecklist(updatedChecklist)
        sessionStorage.setItem(storageKey, JSON.stringify(updatedChecklist))
    }

    const updateDescription = (index, text) => {
        const updatedChecklist = [...checklist]
        updatedChecklist[index].description = text
        setChecklist(updatedChecklist)
        sessionStorage.setItem(storageKey, JSON.stringify(updatedChecklist))
    }

    const handleSaveAndGoBack = () => {
        sessionStorage.setItem(storageKey, JSON.stringify(checklist))
        navigate(-1)
    }

    if (!requestId || !roomId) {
        return <p className="text-center mt-5 text-red-500">ไม่พบข้อมูลที่ต้องทำความสะอาด</p>
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">{t('checklist_item')}</th>
                            <th className="py-2 px-4 border-b">{t('common:status')}</th>
                            <th className="py-2 px-4 border-b">{t('common:detail')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {checklist.map((item, index) => (
                            <tr key={item.cleaningListItemId}>
                                <td className="py-2 px-4 border-b">{item.cleaningListItemName}</td>
                                <td className="py-2 px-4 border-b">
                                    <select
                                        value={item.cleaningStatusId}
                                        onChange={(e) => updateChecklist(index, parseInt(e.target.value))}
                                        className="p-2 border rounded"
                                    >
                                        <option value={1}>{t('status_normal')}</option>
                                        <option value={2}>{t('status_problem')}</option>
                                    </select>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {item.cleaningStatusId === 2 && (
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => updateDescription(index, e.target.value)}
                                            className="p-2 border rounded w-full"
                                            placeholder={t('enter_problem_detail')}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between mt-4">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    {t('common:back')}
                </button>
                <button
                    onClick={() => props.onSubmit(checklist)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {t('common:submit')}
                </button>
            </div>
        </>
    )
}

export default CleaningChecklist
