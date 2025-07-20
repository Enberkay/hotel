import React, { useState, useEffect } from "react"
import useAddonStore from "../../store/addon-store";
import useAuthStore from "../../store/auth-store";
import { createAddon, readAddon, updateAddon } from "../../api/addon"
import { toast } from "react-toastify"
import { Pencil } from "lucide-react"
import { useTranslation } from 'react-i18next';

const initialState = { addonName_en: "", addonName_th: "", price: 0 }

const FormAddon = () => {
  const { i18n, t } = useTranslation();
  const token = useAuthStore((state) => state.token);
  const getAddon = useAddonStore((state) => state.getAddon);
  const addons = useAddonStore((state) => state.addons);

  const [form, setForm] = useState(initialState)
  const [editForm, setEditForm] = useState(initialState)
  const [isEditOpen, setIsEditOpen] = useState(false)

  useEffect(() => {
    getAddon(token)
  }, [])

  const handleOnChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.addonName_en || !form.addonName_th || !form.price) {
      return toast.error("กรุณากรอกข้อมูลให้ครบถ้วน")
    }
    try {
      const res = await createAddon(token, form)
      setForm(initialState)
      getAddon(token)
      toast.success(`เพิ่มรายการเสริม ${i18n.language === 'th' ? res.data.addonName_th : res.data.addonName_en} สำเร็จ`)
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

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleUpdate = async () => {
    if (!editForm.addonName_en || !editForm.addonName_th || !editForm.price) {
      return toast.error("กรุณากรอกข้อมูลให้ครบถ้วน")
    }
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
          <input type="text" name="addonName_th" value={form.addonName_th} onChange={handleOnChange} className="border p-2 rounded-md" placeholder="ชื่อรายการเสริม (TH)" required />
          <input type="text" name="addonName_en" value={form.addonName_en} onChange={handleOnChange} className="border p-2 rounded-md" placeholder="Addon Name (EN)" required />
          <input type="number" name="price" value={form.price} onChange={handleOnChange} className="border p-2 rounded-md" placeholder="ราคา" required />
          <button className="bg-blue-500 text-white p-2 rounded-md">Add Addon</button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {addons.map((item) => (
          <div key={item.addonId} className="p-4 border rounded-md shadow-md flex justify-between items-center">
            <div>
              <h2 className="font-bold">{i18n.language === 'th' ? item.addonName_th : item.addonName_en}</h2>
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
            <input type="text" name="addonName_th" value={editForm.addonName_th} onChange={handleEditChange} className="border p-2 w-full rounded-md mb-2" placeholder="ชื่อรายการเสริม (TH)" />
            <input type="text" name="addonName_en" value={editForm.addonName_en} onChange={handleEditChange} className="border p-2 w-full rounded-md mb-2" placeholder="Addon Name (EN)" />
            <input type="number" name="price" value={editForm.price} onChange={handleEditChange} className="border p-2 w-full rounded-md mb-4" placeholder="ราคา" />
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
