import React, { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import useCleaningStore from "../../store/cleaning-store"
import dayjs from "dayjs"
import { readCleaningReport } from "../../api/cleaning"
import { toast } from "react-toastify"


const CleaningReportDetailListHousekeeping = () => {

  const { id } = useParams()
  const token = useCleaningStore((state) => state.token)
  const [report, setReport] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)

  const fetchCleaningReport = useCallback(async () => {
    try {
      const res = await readCleaningReport(token, id)
      console.log("Cleaning Report Data:", res.data)
      setReport(res.data)
    } catch (err) {
      console.log("Error fetching data", err)
    }
  }, [token, id])

  useEffect(() => {
    fetchCleaningReport()
  }, [fetchCleaningReport])

  const formatDateTime = (dateString, format = "DD/MM/YYYY HH:mm:ss") => {
    return dateString ? dayjs(dateString).format(format) : "-"
  }

  if (!report) return <p className="text-center py-6">Loading...</p>

  return (
    <div className="w-10/12 mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold text-brown mb-4">รายละเอียดรายงานทำความสะอาด</h1>
      <div className="border p-4 rounded-lg shadow-md bg-gray-50">
        <h2 className="text-xl font-semibold">พนักงานทำความสะอาด</h2>
        <p><strong>ชื่อ:</strong> {report.housekeeping?.user?.userName} {report.housekeeping?.user?.userSurName}</p>
        <p><strong>เบอร์โทร:</strong> {report.housekeeping?.user?.userNumPhone}</p>
        <p><strong>เวลาที่รายงาน:</strong> {formatDateTime(report.reportAt)}</p>
      </div>

      <h2 className="text-xl font-semibold mt-6">ห้องที่ทำความสะอาด</h2>
      <div className="mt-4 space-y-4">
        {report.CleaningReportRoom.map(({ room }) => (
          <div key={room.roomId} className="block p-5 border rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-200" onClick={() => setSelectedRoom(room)}>
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium text-gray-800">ห้อง {room.roomNumber} ชั้น {room.floor}</p>
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-600">
                กดเพื่อดูรายการ Check-List
              </span>
            </div>
            <p className="text-gray-600 text-sm">เวลาที่บันทึก: {formatDateTime(room.createdAt)}</p>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-xl font-semibold mb-4">Check-List ห้อง {selectedRoom.roomNumber}</h2>
            <div className="space-y-2">
              {report.CleaningResults.filter(result => result.roomId === selectedRoom.roomId).map((result, index) => (
                <div key={index} className="p-3 border rounded-md bg-gray-50">
                  <div className="flex justify-between items-center">
                    <p><strong>{result.cleaningList.itemName}:</strong></p>
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${result.cleaningStatus.cleaningStatusId === 1
                        ? "bg-green-100 text-green-600" // ปกติ สีเขียว
                        : "bg-red-100 text-red-600" // มีปัญหา สีแดง
                        }`}
                    >
                      {result.cleaningStatus.cleaningStatusName}
                    </span>
                  </div>
                  {/* แสดงหมายเหตุถ้ามี */}
                  {result.description && (
                    <p className="text-sm text-gray-600">หมายเหตุ: {result.description}</p>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelectedRoom(null)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              ปิด
            </button>
          </div>
        </div>
      )}



    </div>
  )
}
export default CleaningReportDetailListHousekeeping