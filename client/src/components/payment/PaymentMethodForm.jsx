import React, { useState, useEffect } from "react"
import usePaymentStore from "../../store/payment-store"
import { createPaymentMethod, readPaymentMethod, updatePaymentMethod } from "../../api/paymentMethod"
import { toast } from "react-toastify"
import { Pencil } from "lucide-react"

const initialState = { paymentMethodName: "" }

const FormPaymentMethod = () => {
    const token = usePaymentStore((state) => state.token)
    const getPaymentMethod = usePaymentStore((state) => state.getPaymentMethod)
    const paymentMethods = usePaymentStore((state) => state.paymentMethods)

    const [form, setForm] = useState(initialState)
    const [editForm, setEditForm] = useState(initialState)
    const [isEditOpen, setIsEditOpen] = useState(false)

    useEffect(() => {
        getPaymentMethod(token)
    }, [])

    const handleOnChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.paymentMethodName) {
            return toast.error("กรุณากรอกข้อมูลให้ครบถ้วน")
        }
        try {
            const res = await createPaymentMethod(token, form)
            setForm(initialState)
            getPaymentMethod(token)
            toast.success(`เพิ่มสถานะการชำระเงิน ${res.data.paymentMethodName} สำเร็จ`)
        } catch (err) {
            console.log(err)
        }
    }

    const handleEditClick = async (id) => {
        try {
            const res = await readPaymentMethod(token, id)
            setEditForm(res.data)
            setIsEditOpen(true)
        } catch (err) {
            console.log(err)
        }
    }

    const handleUpdate = async () => {
        try {
            await updatePaymentMethod(token, editForm.paymentMethodId, editForm)
            setIsEditOpen(false)
            getPaymentMethod(token)
            toast.success("แก้ไขข้อมูลสำเร็จ")
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="container mx-auto p-4 bg-white shadow-md mt-20">
            <h1 className="text-2xl font-bold mb-4">Payment Method Management</h1>
            <form className="my-4" onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-4">
                    <input
                        type="text"
                        name="paymentMethodName"
                        value={form.paymentMethodName}
                        onChange={handleOnChange}
                        className="border p-2 rounded-md"
                        placeholder="ชื่อสถานะการชำระเงิน"
                        required
                    />
                    <button className="bg-blue-500 text-white p-2 rounded-md">Add Payment Method</button>
                </div>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentMethods.map((item) => (
                    <div key={item.paymentMethodId} className="p-4 border rounded-md shadow-md flex justify-between items-center">
                        <div>
                            <h2 className="font-bold">{item.paymentMethodName}</h2>
                        </div>
                        <button onClick={() => handleEditClick(item.paymentMethodId)} className="text-blue-500">
                            <Pencil />
                        </button>
                    </div>
                ))}
            </div>

            {isEditOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-96">
                        <h2 className="text-xl font-bold mb-4">แก้ไขสถานะการชำระเงิน</h2>
                        <input
                            type="text"
                            name="paymentMethodName"
                            value={editForm.paymentMethodName}
                            onChange={(e) => setEditForm({ ...editForm, paymentMethodName: e.target.value })}
                            className="border p-2 w-full rounded-md mb-4"
                        />
                        <div className="flex justify-between">
                            <button onClick={() => setIsEditOpen(false)} className="bg-gray-500 text-white p-2 rounded-md">
                                ยกเลิก
                            </button>
                            <button onClick={handleUpdate} className="bg-green-500 text-white p-2 rounded-md">
                                ยืนยัน
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FormPaymentMethod
