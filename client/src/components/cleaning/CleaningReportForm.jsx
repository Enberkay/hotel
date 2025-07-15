import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import dayjs from "dayjs"
import useCleaningStore from "../../store/cleaning-store"
import { cleaningReport, notedCleaningRequest } from "../../api/cleaning"

const CleaningReportForm = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const requestIdFromState = location.state?.requestId

    const token = useCleaningStore((state) => state.token)
    const getCleaningRequest = useCleaningStore((state) => state.getCleaningRequest)
    const cleaningRequests = useCleaningStore((state) => state.cleaningRequests)
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        getCleaningRequest(token)
        console.log(cleaningRequests)
    }, [token])

    // โหลดค่าจาก sessionStorage เมื่อเปิดหน้า
    useEffect(() => {
        const savedRequest = sessionStorage.getItem("selectedRequest")
        if (savedRequest) {
            setSelectedRequest(JSON.parse(savedRequest))
        } else if (requestIdFromState) {
            const foundRequest = cleaningRequests.find(req => req.requestId === requestIdFromState)
            setSelectedRequest(foundRequest || null)
        }
    }, [requestIdFromState, cleaningRequests])

    // บันทึกค่า selectedRequest ใน sessionStorage
    useEffect(() => {
        if (selectedRequest) {
            sessionStorage.setItem("selectedRequest", JSON.stringify(selectedRequest))
        }
    }, [selectedRequest])

    const formatDateTime = (dateString) => {
        return dateString ? dayjs(dateString).format("DD/MM/YYYY HH:mm:ss") : "-"
    }

    const handleStartChecklist = (roomId, requestId) => {
        navigate("/housekeeping/checklist-cleaning-report", { state: { roomId, requestId } })
    }

    const pendingRequests = cleaningRequests.filter(req => req.cleaningRequestStatusId === 1 || req.cleaningRequestStatusId === 2)


    //ฟังชั่นสำหรับเลือกใบแจ้งทำความสะอาด
    const handleSelectRequest = async (req) => {
        toast(
            ({ closeToast }) => (
                <div className="text-center">
                    <p className="font-semibold">⚠️ ยืนยันเลือกใบแจ้งหมายเลข {req.requestId}?</p>
                    <div className="flex justify-center gap-3 mt-3">
                        <button
                            className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                            onClick={closeToast}
                        >
                            ❌ ยกเลิก
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                            onClick={async () => {
                                closeToast()
                                try {
                                    await notedCleaningRequest(token, req.requestId)
                                    setSelectedRequest(req)
                                    setIsModalOpen(false)
                                    toast.success("บันทึกใบแจ้งทำความสะอาดเรียบร้อย!")
                                } catch (error) {
                                    console.error("เกิดข้อผิดพลาด:", error)
                                    toast.error("ไม่สามารถบันทึกใบแจ้งทำความสะอาดได้")
                                }
                            }}
                        >
                            ✅ ยืนยัน
                        </button>
                    </div>
                </div>
            ),
            { autoClose: false, closeOnClick: false, position: "top-center" }
        )
    }


    //ฟังชั่นสำหรับรายงานผล
    const handleSubmitReport = async () => {
        if (!selectedRequest) {
            return toast.warning("กรุณาเลือกใบแจ้งทำความสะอาด")
        }

        const requestId = selectedRequest.requestId
        const rooms = selectedRequest.CleaningRequestRoom.map(detail => {
            const storageKey = `roomId_${detail.roomId}`
            let storedChecklist = sessionStorage.getItem(storageKey)

            try {
                storedChecklist = storedChecklist ? JSON.parse(storedChecklist) : []
            } catch (err) {
                console.error(`Error parsing checklist data for room ${detail.roomId}:`, err)
                storedChecklist = []
            }

            return {
                roomId: detail.roomId,
                results: storedChecklist
            }
        })

        if (!requestId || rooms.length === 0 || rooms.every(room => room.results.length === 0)) {
            return toast.warning("ข้อมูลไม่ครบถ้วน")
        }

        try {
            console.log("ส่งข้อมูลไปที่ API:", { token, requestId, rooms })

            const response = await cleaningReport(token, requestId, rooms)

            setSelectedRequest(null)
            rooms.forEach(room => sessionStorage.removeItem(`roomId_${room.roomId}`))
            sessionStorage.removeItem("selectedRequest")

            toast.success("รายงานการทำความสะอาดสำเร็จ!")
            navigate("/housekeeping")
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการส่งข้อมูล:", error)

            if (error.response) {
                console.error("API Error Response:", error.response.data)
                toast.error(`API Error: ${error.response.data.message || "ไม่สามารถส่งข้อมูลได้"}`)
            } else {
                toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ API")
            }
        }
    }




    return (
        <div className="mt-14 md:max-w-4xl md:mx-auto md:mt-14 lg:8 p-6 bg-white shadow-lg rounded-lg sm:p-4 md:p-6 lg:p-8 xl:p-10">
            <h1 className="text-2xl font-semibold mb-4 text-center sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                ทำใบรายงานทำความสะอาด
            </h1>

            {!selectedRequest && (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm md:text-base lg:text-lg block mx-auto"
                >
                    เลือกใบแจ้งทำความสะอาด
                </button>
            )}



            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-2">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                        <h2 className="text-xl font-semibold mb-4 text-center">เลือกใบแจ้งทำความสะอาด</h2>
                        <ul className="border p-4 rounded-lg bg-gray-100 max-h-60 overflow-auto text-sm md:text-base">
                            {pendingRequests.length === 0 ? (
                                <p className="text-gray-500 text-center">ไม่มีใบแจ้งที่รออยู่</p>
                            ) : (
                                pendingRequests.map((req) => (
                                    <li
                                        key={req.requestId}
                                        className={`p-3 border-b last:border-none cursor-pointer hover:bg-gray-200 
                                            ${req.cleaningRequestStatusId === 2 ? "bg-yellow-100" : ""}`}
                                        onClick={() => handleSelectRequest(req)}
                                    >
                                        <span className="font-semibold">หมายเลข:</span> {req.requestId} |
                                        <span className="ml-2 font-semibold">แจ้งเมื่อ:</span> {formatDateTime(req.requestAt)}
                                    </li>
                                ))
                            )}
                        </ul>
                        <button
                            onClick={() => {
                                setIsModalOpen(false)
                                setTimeout(() => getCleaningRequest(token), 300) // หน่วง 300ms ก่อนเรียก API
                            }}
                            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition block mx-auto w-full sm:w-auto"
                        >
                            ปิด
                        </button>
                    </div>
                </div>
            )}



            {selectedRequest && (
                <>
                    <div className="border p-4 rounded-lg bg-gray-100 mt-4 text-sm md:text-base">
                        <p><span className="font-semibold">หมายเลขใบแจ้ง:</span> {selectedRequest.requestId}</p>
                        <p><span className="font-semibold">เวลาที่แจ้ง:</span> {formatDateTime(selectedRequest.requestAt)}</p>
                    </div>

                    <h2 className="text-lg font-semibold mt-4 mb-2">รายละเอียดห้อง</h2>
                    {selectedRequest.CleaningRequestRoom.map((detail, index) => (
                        <div key={index} className="border p-4 rounded-lg bg-gray-50 mb-2 text-sm md:text-base">
                            <p><span className="font-semibold">ห้องหมายเลข:</span> {detail.room.roomNumber}</p>
                            <p><span className="font-semibold">ชั้น:</span> {detail.room.floor}</p>
                            <p><span className="font-semibold">รายละเอียด:</span> {detail.description || "ไม่มีรายละเอียด"}</p>
                            <button
                                onClick={() => handleStartChecklist(detail.roomId, selectedRequest.requestId)}
                                className="block text-center bg-green-600 text-white py-2 px-4 rounded-md mt-2 hover:bg-green-700 w-full sm:w-auto"
                            >
                                เริ่มทำใบรายงาน
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={() => {
                            setSelectedRequest(null)
                            sessionStorage.removeItem("selectedRequest")
                            setTimeout(() => getCleaningRequest(token), 300)
                        }}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition block mx-auto w-full sm:w-auto"
                    >
                        ปิดใบนี้ลง
                    </button>
                    <button
                        onClick={() => {
                            toast(
                                ({ closeToast }) => (
                                    <div className="text-center">
                                        <p className="font-semibold">⚠️ ยืนยันส่งรายงานทำความสะอาด?</p>
                                        <div className="flex justify-center gap-3 mt-3">
                                            <button
                                                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                                                onClick={closeToast}
                                            >
                                                ❌ ยกเลิก
                                            </button>
                                            <button
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg"
                                                onClick={() => {
                                                    closeToast()
                                                    handleSubmitReport() // เรียกฟังก์ชันส่งรายงาน
                                                }}
                                            >
                                                ✅ ยืนยัน
                                            </button>
                                        </div>
                                    </div>
                                ),
                                { autoClose: false, closeOnClick: false, position: "top-center" }
                            )
                            
                        }}
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition block mx-auto w-full sm:w-auto"
                    >
                        รายงานผลการทำความสะอาด
                    </button>

                </>
            )}
        </div>
    )
}

export default CleaningReportForm
