import React, { useState, useEffect } from "react"
import useAuthStore from "../../store/auth-store";
import useRoomStore from "../../store/room-store";
import useAddonStore from "../../store/addon-store";
import usePaymentStore from "../../store/payment-store";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { toast } from "react-toastify"
import { createBooking } from "../../api/booking"
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"
import Select from "react-select"
import { useTranslation } from 'react-i18next';

const initialState = {
  count: "1",
  roomTypeId: "",
  licensePlate: "",
  checkInDate: null,
  checkOutDate: null,
}

const BookingForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const profile = useAuthStore((state) => state.profile)
  const getProfile = useAuthStore((state) => state.getProfile)
  const getRoomType = useRoomStore((state) => state.getRoomType)
  const roomtypes = useRoomStore((state) => state.roomTypes)
  const getAddon = useAddonStore((state) => state.getAddon)
  const addons = useAddonStore((state) => state.addons)

  // const getPaymentMethod = usePaymentStore((state) => state.getPaymentMethod)
  // const paymentMethods = usePaymentStore((state) => state.paymentMethods)

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

  //เลือกประเภทห้อง
  const roomOptions = roomtypes.map((roomtype) => ({
    value: roomtype.roomTypeId,
    label: i18n.language === 'th' ? roomtype.name_th : roomtype.name_en,
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
    label: i18n.language === 'th' ? addon.addonName_th : addon.addonName_en,
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

    if (!form.roomTypeId || !form.checkInDate || !form.checkOutDate) {
      return toast.error(t('error_required'))
    }

    if (dayjs(form.checkOutDate).isBefore(dayjs(form.checkInDate))) {
      return toast.error(t('check_out_after_check_in'))
    }

    if (!form.roomTypeId) {
      return toast.error(t('error_select_room_type'))
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
      toast.success(t('booking_success'))
      navigate("/my-bookings")
    } catch (err) {
      console.log(err)
      const errMsg = err.response?.data?.message
      toast.error(errMsg)
    }
  }

  return (
    <div className="flex justify-center">
      <div className="mx-10 p-6 bg-white w-full lg:w-10/12 xl:w-8/12 max-w-6xl border shadow-md mt-24">
        <h2 className="text-2xl font-bold text-black text-center">
          {t('booking_management')}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-2 text-gray-700 text-sm md:text-base">
                {t('check_in_date')}
              </label>
              <DatePicker
                selected={form.checkInDate}
                onChange={(date) => handleDateChange(date, "checkInDate")}
                minDate={new Date()}
                placeholderText={t('select_check_in_date')}
                dateFormat="dd/MM/yyyy"
                className="p-3 border rounded-md shadow-sm w-full bg-light-yellow"
                popperPlacement="bottom-start"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-gray-700 text-sm md:text-base">
                {t('check_out_date')}
              </label>
              <DatePicker
                selected={form.checkOutDate}
                onChange={(date) => handleDateChange(date, "checkOutDate")}
                minDate={form.checkInDate || new Date()}
                placeholderText={t('select_check_out_date')}
                dateFormat="dd/MM/yyyy"
                className="p-3 border rounded-md shadow-sm w-full bg-light-yellow"
                popperPlacement="bottom-start"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t('room_type')}
            </label>
            <Select
              options={roomOptions}
              onChange={handleOnChangeRoomType}
              placeholder={t('select_room_type')}
              className="mb-2 w-[200px]"
              classNamePrefix="select"
            />
          </div>

          <div className="bg-white p-4 rounded-md border-2 border-black mt-4">
            <h3 className="text-lg font-semibold mb-2">{t('user_info')}</h3>
            <p>
              <strong>{t('name')}:</strong> {profile.prefix} {profile.userName} {profile.userSurName}
            </p>
            <p>
              <strong>{t('email')}:</strong> {profile.userEmail}
            </p>
            <p>
              <strong>{t('license_plate')}:</strong> {profile.licensePlate}
            </p>
            <p>
              <strong>{t('phone')}:</strong> {profile.userNumPhone}
            </p>
            <p>
              <strong>{t('customer_type')}:</strong> {profile.Customer?.customerType?.customerTypeName}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t('guest_count', { max: selectedOption?.value === 3 ? 4 : 2 })}
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

          <div className="text-center">
            <button
              type="submit"
              className="bg-[var(--color-brown)] hover:bg-[var(--color-light-yellow)] text-white font-bold py-2 px-6 rounded-md shadow-md"
              style={{'--color-brown':'#6A503D','--color-light-yellow':'#FEF6B3'}}
            >
              {t('confirm_booking')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingForm
