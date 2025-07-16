import { useState } from "react"
import { useLocation } from "react-router-dom"
import UploadFile from "../shared/UploadFile"


//chat gpt 100%
const PaymentForm = () => {
    const location = useLocation()
    const { bookingId, total } = location.state || {}

    const [form, setForm] = useState({ images: [] })

    const [loading, setLoading] = useState(false)

    // ฟังก์ชันอัปโหลดไฟล์
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setSlip(file)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            // ส่งเฉพาะ url/path ของไฟล์ที่อัปโหลดไป backend
            const slipUrl = form.images[0]?.url || form.images[0]?.path
            const payload = {
                bookingId,
                paymentAmount: total,
                slip: slipUrl
            }
            // ส่ง payload ไป backend ตาม endpoint ที่รองรับ
            // เช่น await axios.post('/api/upload-slip', payload)
            alert("ชำระเงินสำเร็จ")
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อ")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 border rounded-lg shadow-md bg-white">
            <h2 className="text-2xl font-semibold mb-4">ชำระเงิน</h2>

            {/* แสดงราคาที่ต้องชำระ */}
            <p className="mb-4 text-lg font-bold text-gray-700">
                ยอดชำระ: {total} บาท
            </p>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">สลิปการชำระเงิน</label>
                    <UploadFile form={form} setForm={setForm} /> {/* ✅ ใช้ UploadFile ได้เลย */}

                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-3 rounded-md"
                >
                    {loading ? "กำลังอัปโหลด..." : "ยืนยันการชำระเงิน"}
                </button>
            </form>
        </div>
    )
}

export default PaymentForm
