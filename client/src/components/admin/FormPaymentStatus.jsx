import React, { useEffect, useState } from "react"
import { createPaymentStatus } from "../../api/paymentStatus"
import useHotelStore from "../../store/hotel-store"
import { toast } from "react-toastify"

const paymentStatusList = ["รอชำระเงิน", "ชำระแล้ว", "ปฏิเสธ", "ถูกยกเลิก"]

const PaymentStatusManager = () => {
  const token = useHotelStore((state) => state.token)
  const paymentStatuses = useHotelStore((state) => state.paymentStatuses)
  const getPaymentStatus = useHotelStore((state) => state.getPaymentStatus)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getPaymentStatus(token)
  }, [token, getPaymentStatus])

  const handleAddNextStatus = async () => {
    if (paymentStatuses.length >= paymentStatusList.length) return

    setLoading(true)
    const nextStatus = paymentStatusList[paymentStatuses.length]

    try {
      const res = await createPaymentStatus(token, { paymentStatusName: nextStatus })
      getPaymentStatus(token)
      toast.success(`เพิ่มสถานะการชำระเงิน: ${res.data.paymentStatusName}`)
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มสถานะ")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow-md text-center">
      <h1 className="text-2xl font-bold mb-4">สถานะการชำระเงิน</h1>
      <div className="flex flex-col items-center space-y-4">
        {paymentStatusList.map((status, index) => (
          <div
            key={index}
            className={`w-64 p-3 rounded-md text-white text-center ${paymentStatuses.some((s) => s.paymentStatusName === status) ? "bg-green-500" : "bg-gray-300"
              }`}
          >
            {status}
          </div>
        ))}

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200 disabled:bg-gray-400"
          onClick={handleAddNextStatus}
          disabled={paymentStatuses.length >= paymentStatusList.length || loading}
        >
          {loading ? "กำลังเพิ่ม..." : "เพิ่มสถานะถัดไป"}
        </button>
      </div>
    </div>
  )
}

export default PaymentStatusManager
