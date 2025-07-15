import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { readCleaningRequest, notedCleaningRequest } from "../../api/cleaning"
import useHotelStore from "../../store/hotel-store"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"

const ListCleaningRequestDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const token = useHotelStore((state) => state.token)
    const [requestDetail, setRequestDetail] = useState(null)

    // ฟังก์ชันดึงข้อมูลใบแจ้งทำความสะอาด
    const fetchCleaningRequest = async () => {
        try {
            const res = await readCleaningRequest(token, id)
            setRequestDetail(res.data)
        } catch (err) {
            console.log("Error fetching data", err)
        }
    }

    useEffect(() => {
        fetchCleaningRequest()
    }, [token, id])

    // ฟังก์ชันแปลงวันที่
    const formatDateTime = (dateString) => {
        return dateString ? dayjs(dateString).format("DD/MM/YYYY HH:mm:ss") : "-"
    }

    if (!requestDetail) {
        return <p className="text-center mt-5 text-gray-500">กำลังโหลดข้อมูล...</p>
    }

    const handleNoted = async (requestId) => {
        await notedCleaningRequest(token, requestId)
    }

    // ฟังก์ชันกดปุ่ม "ทำใบรายงานทำความสะอาด"
    const handleCreateCleaningReport = async (requestId) => {
        if (window.confirm("คุณต้องการทำใบรายงานทำความสะอาดสำหรับใบแจ้งนี้ใช่หรือไม่?")) {
            await handleNoted(requestId)
            navigate("/housekeeping/cleaning-report", { state: { requestId } })
        }
    }

    return (
        <>
            {/* จอเล็ก */}
            <div className="lg:hidden md:hidden bg-white shadow-md rounded-lg py-5 px-4 mt-14">
                <header className="grid justify-items-center gap-2 py-2">
                    <div className="text-lg font-semibold text-[var(--color-brown)]" style={{'--color-brown':'#6A503D'}}>
                        <h1>รายละเอียดใบแจ้งทำความสะอาด</h1>
                    </div>
                </header>
                <main>
                    <div className="border p-4 rounded-lg bg-gray-100 mb-4">
                        <p><span >หมายเลขใบแจ้ง:</span> {requestDetail.requestId}</p>
                        <p><span >สถานะ:</span>
                            <span className={`px-3 py-1 text-sm rounded-full 
                        ${requestDetail.cleaningRequestStatus.cleaningRequestStatusId === 1 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                                {requestDetail.cleaningRequestStatus.cleaningRequestStatusName}
                            </span>
                        </p>
                        <p><span >เวลาที่แจ้ง:</span> {formatDateTime(requestDetail.requestAt)}</p>
                    </div>

                    <div className="grid gap-2 py-2">
                        <h2 className="text-lg font-semibold text-[var(--color-brown)]" style={{'--color-brown':'#6A503D'}}>รายละเอียดห้อง</h2>
                        {requestDetail.CleaningRequestRoom.map((detail, index) => (
                            <div key={index} className="border p-4 rounded-lg bg-gray-50 mb-2">
                                <p><span>ห้องหมายเลข:</span> {detail.room.roomNumber}</p>
                                <p><span>ชั้น:</span> {detail.room.floor}</p>
                                <p><span>รายละเอียด:</span> {detail.description || "ไม่มีรายละเอียด"}</p>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h2 className="text-lg mt-4 mb-2">ข้อมูลผู้แจ้ง</h2>
                        <div className="border p-4 rounded-lg bg-gray-50">
                            <p><span >ชื่อ:</span> {requestDetail.front.user.userName} {requestDetail.front.user.userSurName}</p>
                            <p><span >เบอร์โทร:</span> {requestDetail.front.user.userNumPhone}</p>
                        </div>
                    </div>

                    <div className="grid h-30 content-end">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-center bg-neutral-400 text-white py-2 px-4 rounded-md mt-4 w-full"
                        >
                            ย้อนกลับ
                        </button>
                        <button
                            onClick={() => handleCreateCleaningReport(requestDetail.requestId)}
                            className="text-center bg-blue-600 text-white py-2 px-4 rounded-md mt-4 w-full"
                        >
                            ทำใบรายงานทำความสะอาด
                        </button>
                    </div>
                </main>
            </div>

            {/* {จอใหญ่} */}
            <div className="hidden lg:flex md:flex xl:flex flex-col max-w-3xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg md:mt-14 ">
                <h1 className="text-2xl font-semibold text-[var(--color-brown)]" style={{'--color-brown':'#6A503D'}} mb-4>รายละเอียดใบแจ้งทำความสะอาด</h1>

                <div className="border p-4 rounded-lg bg-gray-100 mb-4">
                    <p><span className="font-semibold">หมายเลขใบแจ้ง:</span> {requestDetail.requestId}</p>
                    <p><span className="font-semibold">สถานะ:</span>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full 
                        ${requestDetail.cleaningRequestStatus.cleaningRequestStatusId === 1 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                            {requestDetail.cleaningRequestStatus.cleaningRequestStatusName}
                        </span>
                    </p>
                    <p><span className="font-semibold">เวลาที่แจ้ง:</span> {formatDateTime(requestDetail.requestAt)}</p>
                </div>

                <h2 className="text-lg font-semibold mb-2">รายละเอียดห้อง</h2>
                {requestDetail.CleaningRequestRoom.map((detail, index) => (
                    <div key={index} className="border p-4 rounded-lg bg-gray-50 mb-2">
                        <p><span className="font-semibold">ห้องหมายเลข:</span> {detail.room.roomNumber}</p>
                        <p><span className="font-semibold">ชั้น:</span> {detail.room.floor}</p>
                        <p><span className="font-semibold">รายละเอียด:</span> {detail.description || "ไม่มีรายละเอียด"}</p>
                    </div>
                ))}

                <h2 className="text-lg font-semibold mt-4 mb-2">ข้อมูลผู้แจ้ง</h2>
                <div className="border p-4 rounded-lg bg-gray-50">
                    <p><span className="font-semibold">ชื่อ:</span> {requestDetail.front.user.userName} {requestDetail.front.user.userSurName}</p>
                    <p><span className="font-semibold">เบอร์โทร:</span> {requestDetail.front.user.userNumPhone}</p>
                </div>

                <div className="grid h-50 content-end">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-center bg-neutral-400 text-white py-2 px-4 rounded-md mt-4 w-full"
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        onClick={() => handleCreateCleaningReport(requestDetail.requestId)}
                        className="text-center bg-blue-600 text-white py-2 px-4 rounded-md mt-4 w-full"
                    >
                        ทำใบรายงานทำความสะอาด
                    </button>
                </div>
            </div>
        </>
    )
}

export default ListCleaningRequestDetail
