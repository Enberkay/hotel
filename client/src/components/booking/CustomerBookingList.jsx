import React, { useState, useEffect } from "react"
import useBookingStore from "../../store/booking-store"
import useAuthStore from "../../store/auth-store"
import dayjs from "dayjs"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { cancelledBooking } from "../../api/myBooking"
import { toast } from "react-toastify"
import { Menu, X } from "lucide-react" // ไอคอนสำหรับเมนู
import { useTranslation } from 'react-i18next';

const CustomerBookingList = () => {

  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const myBookings = useBookingStore((state) => state.myBookings)
  const getMyBookings = useBookingStore((state) => state.getMyBookings)
  const getProfile = useHotelStore((state) => state.getProfile)
  const Profile = useHotelStore((state) => state.profile)
  const [isMenuOpen, setIsMenuOpen] = useState(false) //ทำResponsive
  const { t } = useTranslation();

  useEffect(() => {
    getMyBookings(token)
    getProfile(token)
    console.log(myBookings)
  }, [])

  //npm install dayjs
  const formatDateTime = (dateString) => {
    if (!dateString) return "-"
    return dayjs(dateString).format("DD/MM/YYYY HH:mm:ss")
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return dayjs(dateString).format("DD/MM/YYYY")
  }

  const handleCancel = async (bookingId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await cancelledBooking(token, bookingId)
        toast.success(t('booking_cancelled_success'))
        getMyBookings(token)
      } catch (err) {
        console.log(err)
        toast.error(t('booking_cancelled_failed'))
      }
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ปุ่ม Toggle Menu บนมือถือ */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="hidden md:hidden fixed top-4 left-4 z-50 bg-[#8b5e34] text-white p-2 rounded-lg shadow-md"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Menu */}
      <aside
        className={`mt-20 lg:mt-0 md:mt-0 fixed inset-y-0  left-0 z-40 w-64 p-6 shadow-md bg-[#f7f3ef] transition-transform transform 
                ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 md:w-1/5`}
      >
        <h2 className="text-xl font-bold mb-6 text-[#5a3e2b]">{t('menu')}</h2>
        <ul className="space-y-4">
          {[
            { to: "/customer/customer-profile", label: t('customer_profile') },
            { to: "/customer/my-bookings", label: t('my_bookings') },
          ].map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-md transition ${isActive
                    ? "bg-[var(--color-brown)] text-white shadow-md"
                    : "hover:bg-[#d7ccc8] text-[#5a3e2b]"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      {/* Content Area */}
      <div className="flex-1 p-6">
        <div className="bg-white p-8 shadow-lg rounded-lg max-w-full md:mx-auto sm:mx-2">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {t('my_bookings')}
          </h2>

          <ul className="space-y-4">
            {myBookings.map((item) => (
              <li
                key={item.bookingId}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
              >
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 md:gap-4 sm:gap-2">
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-[#8b5e34]">
                      ใบจองที่: {item.bookingId}
                    </p>
                    <p>
                      <span className="font-semibold">
                        เบอร์โทร: {Profile.userNumPhone}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">{t('payment_status')}:</span>{" "}
                      {item.paymentStatus?.paymentStatusName}
                    </p>
                    <p>
                      <span className="font-semibold">{t('payment_method')}:</span>{" "}
                      {item.paymentMethod?.paymentMethodName ?? t('not_specified')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">{t('room_type')}:</span>{' '}
                      {item.roomType ? (i18n.language === 'th' ? item.roomType.name_th : item.roomType.name_en) : t('not_specified')}
                    </p>
                    <p>
                      <span className="font-semibold">{t('check_in_date')}:</span>{" "}
                      {formatDate(item.checkInDate)}
                    </p>
                    <p>
                      <span className="font-semibold">{t('check_out_date')}:</span>{" "}
                      {formatDate(item.checkOutDate)}
                    </p>
                    <p>
                      <span className="font-semibold">{t('booking_status')}:</span>{" "}
                      {item.bookingStatus?.bookingStatusName}
                    </p>
                    <p>
                      <span className="font-semibold">{t('room_number')}:</span>{" "}
                      {item.room?.roomNumber ?? t('not_specified')}
                    </p>
                    <p>
                      <span className="font-semibold">{t('floor')}:</span>{" "}
                      {item.room?.floor ?? t('not_specified')}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-100 px-6 py-4 md:flex sm:grid justify-between items-center ">
                  <p className="text-lg font-semibold text-[#5a3e2b]">
                    {t('total_price')}: {item.total} {t('baht')}
                  </p>

                  <div >
                    {item.paymentMethodId === 1 && (
                      <div>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                          onClick={() => console.log("ไปหน้าชำระเงิน")}
                        >
                          {t('pay_now')}
                        </button>

                      </div>
                    )}

                  </div>

                  <div className="flex items-center space-x-4">
                    {item.bookingStatus?.bookingStatusId === 1 && (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                        onClick={() => handleCancel(item.bookingId)}
                      >
                        {t('cancel_booking')}
                      </button>
                    )}
                    {item.bookingStatus?.bookingStatusId === 5 && (
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">{t('cancellation_date')}:</span>{" "}
                        {formatDate(item.cancelledAt)}
                      </p>
                    )}
                    {item.confirmedAt && (
                      <div className="text-sm text-gray-500">
                        <p>
                          <span className="font-semibold">{t('approval_date')}:</span>{" "}
                          {formatDateTime(item.confirmedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
export default CustomerBookingList
