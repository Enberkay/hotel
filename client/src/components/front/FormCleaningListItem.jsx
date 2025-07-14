import React, { useState, useEffect } from "react"
import useHotelStore from "../../store/hotel-store"
import { createCleaningListItem, readCleaningListItem, updateCleaningListItem } from "../../api/cleaningListItem"
import { toast } from "react-toastify"
import { Pencil } from "lucide-react"

const initialState = { itemName: "" }

const FormCleaningListItem = () => {
    const token = useHotelStore((state) => state.token)
    const getCleaningListItem = useHotelStore((state) => state.getCleaningListItem)
    const cleaningListItems = useHotelStore((state) => state.cleaningListItems)

    const [form, setForm] = useState(initialState)
    const [editForm, setEditForm] = useState(initialState)
    const [isEditOpen, setIsEditOpen] = useState(false)

    useEffect(() => {
        getCleaningListItem(token)
    }, [])

    const handleOnChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.itemName) {
            return toast.error("กรุณากรอกชื่อสิ่งของ")
        }
        try {
            const res = await createCleaningListItem(token, form)
            setForm(initialState)
            getCleaningListItem(token)
            toast.success(`เพิ่ม ${res.data.itemName} สำเร็จ`)
        } catch (err) {
            console.log(err)
        }
    }

    const handleEditClick = async (id) => {
        try {
            const res = await readCleaningListItem(token, id)
            setEditForm(res.data)
            setIsEditOpen(true)
        } catch (err) {
            console.log(err)
        }
    }

    const handleUpdate = async () => {
        try {
            await updateCleaningListItem(token, editForm.itemId, editForm)
            setIsEditOpen(false)
            getCleaningListItem(token)
            toast.success("แก้ไขข้อมูลสำเร็จ")
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="container mx-auto p-4 bg-white shadow-md mt-20">
            <h1 className="text-2xl font-bold mb-4">Cleaning List Management</h1>
            <form className="my-4" onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-4">
                    <input
                        type="text"
                        name="itemName"
                        value={form.itemName}
                        onChange={handleOnChange}
                        className="border p-2 rounded-md"
                        placeholder="เพิ่มสิ่งของ"
                        required
                    />
                    <button className="bg-blue-500 text-white p-2 rounded-md">เพิ่ม</button>
                </div>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cleaningListItems.map((item) => (
                    <div key={item.itemId} className="p-4 border rounded-md shadow-md flex justify-between items-center">
                        <h2 className="font-bold">{item.itemName}</h2>
                        <button onClick={() => handleEditClick(item.itemId)} className="text-blue-500">
                            <Pencil />
                        </button>
                    </div>
                ))}
            </div>

            {isEditOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-96">
                        <h2 className="text-xl font-bold mb-4">แก้ไขสิ่งของ</h2>
                        <input
                            type="text"
                            name="itemName"
                            value={editForm.itemName}
                            onChange={(e) => setEditForm({ ...editForm, itemName: e.target.value })}
                            className="border p-2 w-full rounded-md mb-4"
                        />
                        <div className="flex justify-between">
                            <button onClick={() => setIsEditOpen(false)} className="bg-gray-500 text-white p-2 rounded-md">ยกเลิก</button>
                            <button onClick={handleUpdate} className="bg-green-500 text-white p-2 rounded-md">ยืนยัน</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default FormCleaningListItem
