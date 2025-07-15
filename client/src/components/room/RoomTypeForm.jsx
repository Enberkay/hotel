import React, { useState, useEffect } from "react"
import useRoomStore from "../../store/room-store"
import { createRoomType, readRoomType, updateRoomType } from "../../api/roomType"
import { toast } from "react-toastify"
import { Pencil } from "lucide-react"

const initialState = { roomTypeName: "", price: 0 }

const RoomTypeForm = () => {
    const token = useRoomStore((state) => state.token)
    const getRoomType = useRoomStore((state) => state.getRoomType)
    const roomTypes = useRoomStore((state) => state.roomTypes)

    const [form, setForm] = useState(initialState)
    const [editForm, setEditForm] = useState(initialState)
    const [isEditOpen, setIsEditOpen] = useState(false)

    useEffect(() => {
        getRoomType(token)
    }, [])

    const handleOnChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.roomTypeName || !form.price) {
            return toast.error("กรุณากรอกข้อมูลให้ครบถ้วน")
        }
        try {
            const res = await createRoomType(token, form)
            setForm(initialState)
            getRoomType(token)
            toast.success(`เพิ่มประเภทห้อง ${res.data.roomTypeName} สำเร็จ`)
        } catch (err) {
            console.log(err)
        }
    }

    const handleEditClick = async (id) => {
        try {
            const res = await readRoomType(token, id)
            setEditForm(res.data)
            setIsEditOpen(true)
        } catch (err) {
            console.log(err)
        }
    }

    const handleUpdate = async () => {
        try {
            await updateRoomType(token, editForm.roomTypeId, editForm)
            setIsEditOpen(false)
            getRoomType(token)
            toast.success("แก้ไขข้อมูลสำเร็จ")
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="container mx-auto p-4 bg-white shadow-md">
            <h1 className="text-2xl font-bold mb-4">Room Type Management</h1>
            <form className="my-4" onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-4">
                    <input type="text" name="roomTypeName" value={form.roomTypeName} onChange={handleOnChange} className="border p-2 rounded-md" placeholder="ชื่อประเภทห้อง" required />
                    <input type="number" name="price" value={form.price} onChange={handleOnChange} className="border p-2 rounded-md" placeholder="ราคา" required />
                    <button className="bg-blue-500 text-white p-2 rounded-md">Add Room Type</button>
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roomTypes.map((item) => (
                    <div key={item.roomTypeId} className="p-4 border rounded-md shadow-md flex justify-between items-center">
                        <div>
                            <h2 className="font-bold">{item.roomTypeName}</h2>
                            <p>{item.price} บาท</p>
                        </div>
                        <button onClick={() => handleEditClick(item.roomTypeId)} className="text-blue-500">
                            <Pencil />
                        </button>
                    </div>
                ))}
            </div>

            {isEditOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-96">
                        <h2 className="text-xl font-bold mb-4">แก้ไขประเภทห้อง</h2>
                        <input type="text" name="roomTypeName" value={editForm.roomTypeName} onChange={(e) => setEditForm({ ...editForm, roomTypeName: e.target.value })} className="border p-2 w-full rounded-md mb-2" />
                        <input type="number" name="price" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className="border p-2 w-full rounded-md mb-4" />
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
export default RoomTypeForm
