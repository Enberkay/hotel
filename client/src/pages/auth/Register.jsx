
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import useAuthStore from "../../store/auth-store";
import { useNavigate } from "react-router-dom"
import { listCustomerType } from "../../api/customerType"
const API_URL = import.meta.env.VITE_API_URL
import UploadFile from "../shared/UploadFile"
import image from "../../assets/Images/test3.png"

const Register = () => {

  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const [customerTypes, setCustomerTypes] = useState([])

  const [form, setForm] = useState({
    //object
    userEmail: "",
    userPassword: "",
    userName: "",
    userSurName: "",
    userNumPhone: "",
    confirmPassword: "",
    customertypeId: "",
    prefix: "",
    licensePlate: "",
    images: []
  })


  useEffect(() => {
    async function fetchCustomerTypes() {
      try {
        const res = await listCustomerType(token)
        setCustomerTypes(res.data)
      } catch (err) {
        toast.error("ไม่สามารถโหลดประเภทลูกค้าได้")
      }
    }
    if (token) fetchCustomerTypes()
  }, [token])

  const handleOnChange = (e) => {
    console.log(e.target.name, e.target.value)
    setForm({
      // "..." is copy old data
      ...form,
      // key:value
      [e.target.name]: e.target.value

    })
  }

  const handleSubmit = async (e) => {
    // e.preventDefault() ป้องกันการ refresh
    e.preventDefault()
    // console.log(form)

    //check data in form 
    if (!form.userEmail || !form.userPassword || !form.confirmPassword) {
      return toast.error("กรุณากรอกข้อมูลให้ครบถ้วน")
    }

    //check matching password
    if (form.userPassword !== form.confirmPassword) {
      return toast.error("รหัสผ่านไม่ตรงกัน!!!")

    }

    if (form.userNumPhone[0] !== "0") {
      return toast.error("หมายเลขเบอร์โทรศัพท์ต้องเริ่มต้นด้วย 0")
    }

    if (!["6", "8", "9"].includes(form.userNumPhone[1])) {
      return toast.error("ตัวเลขตัวที่สองต้องเป็น 6, 8 หรือ 9 เท่านั้น")
    }

    if (form.userNumPhone.length !== 10) {
      return toast.error("หมายเลขไม่ถูกต้อง")
    }

    // ตรวจสอบว่าหากเลือกประเภทลูกค้าเป็น Student (customertypeId === "2") ต้องอัปโหลดรูปภาพ
    if (form.customertypeId === "2" && form.images.length === 0) {
      return toast.error("กรุณาอัปโหลดรูปภาพ")
    }

    //Send to Backend
    try {
      // console.log(form)
      const res = await axios.post(`${API_URL}/register`, form)
      console.log(res)
      toast.success("สมัครเรียบร้อย")
      navigate("/login")

    } catch (err) {

      console.log(err.response?.data?.message)

      // ? is optional chaining เปลี่ยนจาก error เป็น undifine
      const errMag = err.response?.data?.message
      toast.error(errMag)
      console.log(err)
    }

  }


  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-fixed px-4 mt-20"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl p-6 md:p-10 bg-white bg-opacity-95 shadow-2xl rounded-xl">
        <h2 className="text-center text-2xl font-bold mb-6">ลงทะเบียน</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block space-y-2">
            <span className="text-gray-700">Email</span>
            <input
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-brown/50 focus:outline-none"
              onChange={handleOnChange}
              name="userEmail"
              type="email"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-gray-700">คำนำหน้า</span>
            <select
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-brown/50 focus:outline-none"
              onChange={handleOnChange}
              name="prefix"
              required
            >
              <option value="">ไม่ระบุ</option>
              <option value="นาย">นาย</option>
              <option value="นาง">นาง</option>
              <option value="นางสาว">นางสาว</option>
            </select>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className="text-gray-700">ชื่อ</span>
              <input
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-brown/50 focus:outline-none"
                onChange={handleOnChange}
                name="userName"
                type="text"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-gray-700">นามสกุล</span>
              <input
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-brown/50 focus:outline-none"
                onChange={handleOnChange}
                name="userSurName"
                type="text"
                required
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-gray-700">หมายเลขโทรศัพท์</span>
            <input
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-brown/50 focus:outline-none"
              onChange={handleOnChange}
              name="userNumPhone"
              type="text"
              maxLength={10}
              required
              inputMode="numeric"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
              }}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-gray-700">ทะเบียนรถ</span>
            <span className="inline text-red-600 ml-2">* ถ้ามี</span>
            <input
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-brown/50 focus:outline-none"
              onChange={handleOnChange}
              name="licensePlate"
              type="text"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-gray-700">ประเภทลูกค้า</span>
            <select
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-brown/50 focus:outline-none"
              onChange={handleOnChange}
              name="customertypeId"
              required
              value={form.customertypeId}
            >
              <option value="" disabled>กรุณาเลือก</option>
              {customerTypes.map((item, index) => (
                <option key={index} value={item.customerTypeId}>
                  {item.customerTypeName}
                </option>
              ))}
            </select>
          </label>

          {form.customertypeId === "2" && <UploadFile form={form} setForm={setForm} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className="text-gray-700">Password</span>
              <input
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-brown/50 focus:outline-none"
                onChange={handleOnChange}
                name="userPassword"
                type="password"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-gray-700">Confirm Password</span>
              <input
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-brown/50 focus:outline-none"
                onChange={handleOnChange}
                name="confirmPassword"
                type="password"
                required
              />
            </label>
          </div>

          <button
            className="flex justify-center mx-auto w-full py-3 bg-brown text-white rounded-lg hover:bg-brown/80 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>

  );


}
export default Register