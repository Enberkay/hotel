import React, { useState, useEffect } from "react"
import useHotelStore from "../../store/hotel-store"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { toast } from "react-toastify"
import { createBooking } from "../../api/booking"
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"
import Select from "react-select"

const initialState = {
  count: "1",
  roomTypeId: "",
  licensePlate: "",
  checkInDate: null,
  checkOutDate: null,
  paymentMethodId: "",
}

const FormBooking = () => {
  const navigate = useNavigate()
  const token = useHotelStore((state) => state.token)
  const profile = useHotelStore((state) => state.profile)
  const getProfile = useHotelStore((state) => state.getProfile)
  const getRoomType = useHotelStore((state) => state.getRoomType)
  const roomtypes = useHotelStore((state) => state.roomTypes)
  const getAddon = useHotelStore((state) => state.getAddon)
  const addons = useHotelStore((state) => state.addons)

  // const getPaymentMethod = useHotelStore((state) => state.getPaymentMethod)
  // const paymentMethods = useHotelStore((state) => state.paymentMethods)

  const [form, setForm] = useState(initialState)
  const [selectedAddons, setSelectedAddons] = useState(null)
  const [addonPrice, setAddonPrice] = useState([])
  const [selectedOption, setSelectedOption] = useState([])

  useEffect(() => {
    getRoomType(token)
    getAddon(token)
    getProfile(token)
    // getPaymentMethod(token)
  }, [])

  useEffect(() => {
    if (
      form.checkOutDate &&
      dayjs(form.checkOutDate).isBefore(dayjs(form.checkInDate).add(1, "day"))
    ) {
      setForm((prev) => ({ ...prev, checkOutDate: null }))
    }
  }, [form.checkInDate])

  //เลือกประเภทการชำระ
  // const handlePaymentChange = (event) => {
  //   setForm((prev) => ({
  //     ...prev,
  //     paymentMethodId: event.target.value, // อัปเดตค่าที่เลือก
  //   }))
  // }

  //เลือกประเภทห้อง
  const roomOptions = roomtypes.map((roomtype) => ({
    value: roomtype.roomTypeId,
    label: `${roomtype.roomTypeName}`,
    price: roomtype.price,
  }))

  //เลือกประเภทห้อง
  const handleOnChangeRoomType = (selectedOption) => {
    setSelectedOption(selectedOption)
    setForm({ ...form, roomTypeId: selectedOption.value })

    // รีเซ็ตค่า Add-ons ทันทีที่เปลี่ยนประเภทห้อง
    setAddonPrice([])
    setSelectedAddons(null) // รีเซ็ตค่า
  }

  //เลือกวันเข้า วันออก
  const handleDateChange = (date, field) => {
    setForm((prev) => ({
      ...prev,
      [field]: date,
    }))
  }

  //เลือกจำนวนคนห้องธรรมดา
  const handleCountChange = (e) => {
    let value = parseInt(e.target.value, 10) || 1
    const maxCount = selectedOption?.value === 3 ? 4 : 2
    value = Math.max(1, Math.min(maxCount, value))
    setForm({ ...form, count: value.toString() })
  }

  // ✅ ตั้งค่า ComboBox Add-ons
  const addonOptions = addons.map((addon) => ({
    value: addon.addonId,
    label: `${addon.addonName}`,
    price: addon.price,
  }))

  const formAddons = addonPrice.map((addon) => ({
    addonId: addon.value,
    quantity: 1, // ตั้งค่าให้เป็น 1 ตาม payload ที่ต้องการ
  }))

  // การเพิ่มรายการ Add-on
  const handleAdd = () => {
    // ตรวจสอบว่ามี Add-on ถูกเลือกแล้วหรือยัง
    if (!selectedAddons) {
      return // ถ้าไม่มีการเลือก Add-on ก็ไม่ต้องทำอะไร
    }

    console.log(selectedAddons?.value)

    const maxCount = selectedOption?.value === 3 ? 4 : 2 // ค่าจำนวนคนสูงสุดที่ห้องรองรับ
    const isAddingPeopleAddon = selectedAddons?.value === 2

    // ถ้า Add-on คือการเพิ่มคน
    if (isAddingPeopleAddon) {
      if (parseInt(form.count, 10) < maxCount) {
        return toast.warning(`คุณสามารถเพิ่มคนฟรีได้อีก!`)
      }
    }

    // เพิ่ม Add-on ถ้ายังไม่มีอยู่แล้ว
    if (!addonPrice.some((item) => item.value === selectedAddons.value)) {
      setAddonPrice([...addonPrice, selectedAddons])
      setSelectedAddons(null)
    }
  }

  // การลบรายการ Add-on
  const handleRemove = (addonId) => {
    setAddonPrice(addonPrice.filter((addon) => addon.value !== addonId))
  }

  //คำนวณราคาห้องต่อวัน
  const checkIn = new Date(form.checkInDate)
  const checkOut = new Date(form.checkOutDate)
  const daysBooked =
    form.checkInDate && form.checkOutDate
      ? Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      : 0

  // คำนวณค่าใช้จ่าย
  const totalAddonPrice = addonPrice.reduce(
    (sum, addons) => sum + addons.price,
    0
  )
  const totalRoomPrice =
    roomtypes.find((room) => room.roomTypeId === form.roomTypeId)?.price || 0

  //คำนวณส่วนลด
  const roomTotal = Math.max(totalRoomPrice * daysBooked, 0)
  const totalBeforeDiscount = totalAddonPrice + roomTotal

  const discount = profile.Customer?.customerType?.discount || 0

  // คำนวณราคาสุดท้าย โดยใช้ Math.max เพื่อไม่ให้ค่าติดลบ
  const totalPrice = Math.max(totalBeforeDiscount - discount, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.checkInDate || !form.checkOutDate) {
      return toast.error("กรุณาเลือกวันก่อน")
    }

    if (dayjs(form.checkOutDate).isBefore(dayjs(form.checkInDate))) {
      return toast.error("วันออกต้องมากกว่าวันเข้า")
    }

    if (!form.roomTypeId) {
      return toast.error("กรุณาเลือกประเภทห้อง")
    }

    // if (!form.paymentMethodId) {
    //   return toast.error("กรุณาเลือกประเภทการชำระเงิน")
    // }

    const payload = {
      ...form,
      checkInDate: form.checkInDate ? form.checkInDate.toISOString() : null,
      checkOutDate: form.checkOutDate ? form.checkOutDate.toISOString() : null,
      addon: formAddons,
    }

    // console.log(payload)

    try {
      const res = await createBooking(token, payload)
      console.log(res)
      setForm(initialState)
      toast.success(`จองสำเร็จรอการยืนยัน`)
      navigate("/customer/my-bookings")
    } catch (err) {
      console.log(err)
      const errMsg = err.response?.data?.message
      toast.error(errMsg)
    }
  }

  return (
    <div className="flex justify-center">
      <div className="mx-10 p-6 bg-white w-full lg:w-10/12 xl:w-8/12 max-w-6xl border shadow-md mt-24">
        {/* หัวข้อ */}
        <h2 className="text-2xl font-bold text-black text-center">
          การจัดการการจอง
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col ">
          {/* วันที่เข้าพัก - วันที่ออก */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-2 text-gray-700 text-sm md:text-base">
                วันที่เข้าพัก
              </label>
              <DatePicker
                selected={form.checkInDate}
                onChange={(date) => handleDateChange(date, "checkInDate")}
                minDate={new Date()}
                placeholderText="เลือกวันที่เข้าพัก"
                dateFormat="dd/MM/yyyy"
                className="p-3 border rounded-md shadow-sm w-full bg-light-yellow"
                popperPlacement="bottom-start"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-gray-700 text-sm md:text-base">
                วันที่ออก
              </label>
              <DatePicker
                selected={form.checkOutDate}
                onChange={(date) => handleDateChange(date, "checkOutDate")}
                minDate={
                  form.checkInDate
                    ? dayjs(form.checkInDate).add(1, "day").toDate()
                    : new Date()
                }
                placeholderText="เลือกวันที่ออก"
                dateFormat="dd/MM/yyyy"
                className="p-3 border rounded-md shadow-sm w-full bg-light-yellow"
                popperPlacement="bottom-end"
              />
            </div>
          </div>

          {/* ประเภทห้อง */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              ประเภทห้อง
            </label>
            <Select
              options={roomOptions}
              onChange={handleOnChangeRoomType}
              placeholder="เลือกประเภทห้อง"
              className="mb-2 w-[200px]"
              classNamePrefix="select"

            />
          </div>

          {/* ฟอร์มการจอง */}
          <div className="bg-white p-4 rounded-md border-2 border-black mt-4">
            <h3 className="text-lg font-semibold mb-2">ข้อมูลผู้ใช้</h3>
            <p>
              <strong>ชื่อ:</strong> {profile.prefix} {profile.userName}{" "}
              {profile.userSurName}
            </p>
            <p>
              <strong>อีเมล:</strong> {profile.userEmail}
            </p>
            <p>
              <strong>ทะเบียนรถ:</strong> {profile.licensePlate}
            </p>
            <p>
              <strong>เบอร์โทร:</strong> {profile.userNumPhone}
            </p>
            <p>
              <strong>ประเภทลูกค้า:</strong>{" "}
              {profile.Customer?.customerType?.customerTypeName}
            </p>
          </div>

          {/* จำนวนคนที่เข้าพัก */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              จำนวนคนที่เข้าพัก (มากสุด {selectedOption?.value === 3 ? "4" : "2"}{" "}
              คน)
            </label>
            <input
              type="number"
              min="1"
              max={selectedOption?.value === 3 ? "4" : "2"}
              value={form.count}
              name="count"
              onChange={handleCountChange}
              className="w-400px p-3 border rounded-md shadow-sm"
            />
          </div>

          {/* Add-ons */}
          <div className=" mt-4">
            <h3 className=" text-lg font-semibold mb-2">รายการเสริม</h3>
            <div className="flex items-center gap-2">
              <Select
                key={selectedOption?.value} // ใช้ key เพื่อบังคับให้ Select รีเรนเดอร์ใหม่
                options={addonOptions}
                value={selectedAddons} // ใช้ selectedAddons เป็น null เพื่อให้ placeholder กลับมาแสดง
                onChange={setSelectedAddons}
                placeholder="เลือกรายการเสริม"
                className="w-[200px]"
                classNamePrefix="select"
              />
              <span
                className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded cursor-pointer"
                onClick={handleAdd}
              >
                Add
              </span>
            </div>

            <p className="text-red-500 text-sm">
              *รายการเสริมทุกประเภทจะได้อย่างละ 1 อย่าง
            </p>

            {/*ตารางadd-on*/}
            <table className="mt-4 w-full border border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">รายการ</th>
                  <th className="p-2 text-center">ราคา</th>
                  <th className="p-2 text-right"> </th>
                </tr>
              </thead>
              <tbody>
                {addonPrice.map((addon, index) => (
                  <tr key={addon.value} className="border-b">
                    <td className="p-2">
                      {index + 1}. {addon.label}
                    </td>
                    <td className="p-2 text-center">{addon.price}.-</td>
                    <td className="p-2 text-right">
                      <span
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleRemove(addon.value)}
                      >
                        ลบ
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 border-t pt-2">
              <div className="flex justify-between py-1">
                <strong>ราคารวมรายการเสริม</strong>
                <span>฿ {totalAddonPrice}</span>
              </div>
              {checkIn && checkOut && (
                <div className="flex justify-between py-1">
                  <strong>ราคาห้อง</strong>
                  {totalRoomPrice && daysBooked > 0 ? (
                    <span>
                      ฿ {roomTotal} ( ฿{totalRoomPrice} x {daysBooked} วัน)
                    </span>
                  ) : (
                    <span>กรุณาเลือกวัน</span>
                  )}
                </div>
              )}
              <div className="flex justify-between py-1 text-red-500">
                <strong>ส่วนลด</strong>
                {totalRoomPrice &&
                  daysBooked &&
                  totalRoomPrice > 0 &&
                  daysBooked > 0 ? (
                  <span>฿ -{discount}</span>
                ) : null}
              </div>
              <div className="flex justify-between py-1">
                <strong>ราคารวมทั้งหมด</strong>
                <span>฿ {totalPrice}</span>
              </div>
            </div>
          </div>

          {/* <div>
            <p>
              <strong>ประเภทการชำระเงิน</strong>
            </p>
            {paymentMethods.map((value) => (
              <div key={value.paymentMethodId} className="mx-5">
                <span className="ml-3">{value.paymentMethodName}</span>
                <input
                  className="ml-5"
                  type="radio"
                  name="paymentMethodId"
                  value={value.paymentMethodId}
                  onChange={handlePaymentChange}
                  checked={
                    form.paymentMethodId === value.paymentMethodId.toString()
                  }
                />
              </div>
            ))}
          </div> */}

          <div className="text-center">
            <button
              type="submit"
              className="bg-brown hover:bg-light-yellow text-white font-bold py-2 px-6 rounded-md shadow-md"
            >
              ยืนยันการจอง
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormBooking
