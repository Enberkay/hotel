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
  const { t } = useTranslation(['booking', 'common']);

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
    if (window.confirm(t('common:are_you_sure'))) {
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out bg-white w-64 shadow-lg z-30`}>
        <div className="p-4">
          <h2 className="text-xl font-bold">{t('my_bookings')}</h2>
          <nav className="mt-4">
            <ul>
              <li><NavLink to="/customer/customer-profile" className="block py-2 px-4 rounded hover:bg-gray-200">{t('user:profile')}</NavLink></li>
              <li><NavLink to="/customer/my-bookings" className="block py-2 px-4 rounded hover:bg-gray-200">{t('my_bookings')}</NavLink></li>
              <li><NavLink to="/" className="block py-2 px-4 rounded hover:bg-gray-200">{t('common:back_to_home')}</NavLink></li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden fixed top-4 right-4 bg-white p-2 rounded-full shadow z-40">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
        <h1 className="text-2xl font-bold mb-6">{t('my_bookings')}</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">{t('booking_id')}</th>
                  <th className="py-2 px-4 text-left">{t('room:room_type')}</th>
                  <th className="py-2 px-4 text-left">{t('check_in')}</th>
                  <th className="py-2 px-4 text-left">{t('check_out')}</th>
                  <th className="py-2 px-4 text-left">{t('booking_status')}</th>
                  <th className="py-2 px-4 text-left">{t('common:actions')}</th>
                </tr>
              </thead>
              <tbody>
                {myBookings && myBookings.length > 0 ? (
                  myBookings.map((booking, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{booking.bookingId}</td>
                      <td className="py-2 px-4">{booking.Room.RoomType.roomTypeName_th}</td>
                      <td className="py-2 px-4">{formatDate(booking.checkInDate)}</td>
                      <td className="py-2 px-4">{formatDate(booking.checkOutDate)}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${booking.bookingStatusId === 1
                          ? "bg-yellow-200 text-yellow-800"
                          : booking.bookingStatusId === 2
                            ? "bg-green-200 text-green-800"
                            : booking.bookingStatusId === 3
                              ? "bg-blue-200 text-blue-800"
                              : "bg-red-200 text-red-800"
                          }`}>
                          {booking.BookingStatus.bookingStatusName}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {booking.bookingStatusId === 1 && (
                          <button
                            onClick={() => handleCancel(booking.bookingId)}
                            className="text-red-500 hover:underline"
                          >
                            {t('common:cancel')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">{t('common:no_data')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerBookingList
