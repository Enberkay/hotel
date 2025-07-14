import React, { useState, useEffect } from "react"
import useHotelStore from "../../store/hotel-store"
import { createAddon, readAddon, updateAddon } from "../../api/addon"
import { toast } from "react-toastify"
import { Pencil } from "lucide-react"

const initialState = { addonName: "", price: 0 }

const FormAddon = () => {
  const token = useHotelStore((state) => state.token)
  const getAddon = useHotelStore((state) => state.getAddon)
  const addons = useHotelStore((state) => state.addons)

  const [form, setForm] = useState(initialState)
  const [editForm, setEditForm] = useState(initialState)
  const [isEditOpen, setIsEditOpen] = useState(false)

  useEffect(() => {
    getAddon(token)
  }, [])

  const handleOnChange = (e) => {
    // console.log(e.target.name, e.target.value)
    // ...form คือ operator spread
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.addonName || !form.price) {
      return toast.error("กรุณากรอกข้อมูลให้ครบถ้วน")
    }
    try {
      const res = await createAddon(token, form)
      setForm(initialState)
      getAddon(token)
      toast.success(`เพิ่มรายการเสริม ${res.data.addonName} สำเร็จ`)
    } catch (err) {
      console.log(err)
    }
  }

  const handleEditClick = async (id) => {
    try {
      const res = await readAddon(token, id)
      setEditForm(res.data)
      setIsEditOpen(true)
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdate = async () => {
    try {
      await updateAddon(token, editForm.addonId, editForm)
      setIsEditOpen(false)
      getAddon(token)
      toast.success("แก้ไขข้อมูลสำเร็จ")
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow-md mt-20">
      <h1 className="text-2xl font-bold mb-4">Addon Management</h1>
      <form className="my-4" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4">
          <input type="text" name="addonName" value={form.addonName} onChange={handleOnChange} className="border p-2 rounded-md" placeholder="ชื่อรายการเสริม" required />
          <input type="number" name="price" value={form.price} onChange={handleOnChange} className="border p-2 rounded-md" placeholder="ราคา" required />
          <button className="bg-blue-500 text-white p-2 rounded-md">Add Addon</button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {addons.map((item) => (
          <div key={item.addonId} className="p-4 border rounded-md shadow-md flex justify-between items-center">
            <div>
              <h2 className="font-bold">{item.addonName}</h2>
              <p>{item.price} บาท</p>
            </div>
            <button onClick={() => handleEditClick(item.addonId)} className="text-blue-500">
              <Pencil />
            </button>
          </div>
        ))}
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">แก้ไขรายการเสริม</h2>
            <input type="text" name="addonName" value={editForm.addonName} onChange={(e) => setEditForm({ ...editForm, addonName: e.target.value })} className="border p-2 w-full rounded-md mb-2" />
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
export default FormAddon
