import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import useCleaningStore from "../../store/cleaning-store"
import { useTranslation } from 'react-i18next';


const CleaningChecklist = (props) => {
    const { t } = useTranslation();
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
        <div className=" max-w-3xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-semibold mb-4">{t('cleaning_checklist_title')}</h1>
            <p>{t('request_id')}: {requestId}</p>
            <p>{t('room_id')}: {roomId}</p>

            <ul className="mt-4 border rounded-lg p-4 bg-gray-50">
                {checklist.map((item, index) => (
                    <li
                        key={item.itemId}
                        className="flex flex-col border-b last:border-none py-2 px-3"
                    >
                        <span className="text-gray-800 font-medium">{item.itemName}</span>
                        <div className="flex space-x-4 mt-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={item.cleaningStatusId === 1}
                                    onChange={() => updateChecklist(index, 1)}
                                    className="w-5 h-5 accent-green-500"
                                />
                                <span>{t('normal')}</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={item.cleaningStatusId === 2}
                                    onChange={() => updateChecklist(index, 2)}
                                    className="w-5 h-5 accent-red-500"
                                />
                                <span>{t('problem')}</span>
                            </label>
                        </div>
                        {item.cleaningStatusId === 2 && (
                            <textarea
                                className="w-full mt-2 p-2 border rounded-md"
                                placeholder={t('enter_problem_detail')}
                                value={item.description || ""}
                                onChange={(e) => updateDescription(index, e.target.value)}
                            />
                        )}
                    </li>
                ))}
            </ul>

            <button
                onClick={handleSaveAndGoBack}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 block mx-auto"
            >
                {t('save')}
            </button>
        </div>
    )
}

export default CleaningChecklist
