import React, { useState, useEffect } from "react"
import { createCustomerType, readCustomerType, updateCustomerType } from "../../api/customerType"
import useAuthStore from "../../store/auth-store"
import useCustomerTypeStore from "../../store/customer-type-store"
import { toast } from "react-toastify"
import { Pencil } from "lucide-react"

const initialState = {
  customerTypeName: "",
  discount: 0,
}

const FormCustomerType = () => {
  const token = useAuthStore((state) => state.token)
  const getCustomerType = useCustomerTypeStore((state) => state.getCustomerType)
  const customerTypes = useCustomerTypeStore((state) => state.customerTypes)

  const [form, setForm] = useState(initialState)
  const [editForm, setEditForm] = useState(initialState)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    getCustomerType(token)
  }, [])

  const handleOnChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.customerTypeName) return toast.error("กรุณากรอกข้อมูลให้ครบถ้วน")
    try {
      const res = await createCustomerType(token, form)
      setForm(initialState)
      getCustomerType(token)
      toast.success(`เพิ่มประเภทลูกค้า ${res.data.customerTypeName} สำเร็จ`)
    } catch (err) {
      toast.error(err.response?.data?.message)
    }
  }

  const handleEditClick = async (id) => {
    try {
      const res = await readCustomerType(token, id)
      setEditForm(res.data)
      setEditId(id)
      setIsEditOpen(true)
    } catch (err) {
      toast.error("ไม่สามารถโหลดข้อมูลได้")
    }
  }

  const handleUpdate = async () => {
    try {
      await updateCustomerType(token, editId, editForm)
      setIsEditOpen(false)
      getCustomerType(token)
      toast.success("อัปเดตข้อมูลสำเร็จ")
    } catch (err) {
      toast.error("ไม่สามารถอัปเดตข้อมูลได้")
    }
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow-md mt-20">
      <h1 className="text-2xl font-bold mb-4">Customer Type Management</h1>
      <form className="my-4" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4">
          <input type="text" name="customerTypeName" value={form.customerTypeName} onChange={handleOnChange} className="border p-2 rounded-md" placeholder="ชื่อประเภทลูกค้า" required />
          <input type="number" name="discount" value={form.discount} onChange={handleOnChange} className="border p-2 rounded-md" placeholder="ส่วนลด" required />
          <button className="bg-blue-500 text-white p-2 rounded-md">Add Customer Type</button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {customerTypes.map((item) => (
          <div key={item.customerTypeId} className="p-4 border rounded-md shadow-md flex justify-between items-center">
            <div>
              <h2 className="font-bold">{item.customerTypeName}</h2>
              <p>{item.discount} บาท</p>
            </div>
            <button onClick={() => handleEditClick(item.customerTypeId)} className="text-blue-500">
              <Pencil />
            </button>
          </div>
        ))}
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">แก้ไขประเภทลูกค้า</h2>
            <input type="text" name="customerTypeName" value={editForm.customerTypeName} onChange={(e) => setEditForm({ ...editForm, customerTypeName: e.target.value })} className="border p-2 w-full rounded-md mb-2" />
            <input type="number" name="discount" value={editForm.discount} onChange={(e) => setEditForm({ ...editForm, discount: e.target.value })} className="border p-2 w-full rounded-md mb-4" />
            <div className="flex justify-between">
              <button onClick={() => setIsEditOpen(false)} className="bg-gray-500 text-white p-2 rounded-md">ยกเลิก</button>
              <button onClick={handleUpdate} className="bg-green-500 text-white p-2 rounded-md">บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormCustomerType
