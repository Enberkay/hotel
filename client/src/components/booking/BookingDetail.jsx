import React, { useState, useEffect } from "react"
import useRoomStore from "../../store/room-store"
import dayjs from "dayjs"
import { useParams, useNavigate, Link } from "react-router-dom"
import { readBooking, confirmBooking, checkIn, checkOut } from "../../api/booking"
import { toast } from "react-toastify"
import { Undo2, BedDouble, BedSingle, Bed, Star } from "lucide-react"
import { useTranslation } from 'react-i18next';

const BookingDetail = () => {
    const { t } = useTranslation(['booking', 'room', 'common']);
    const { id } = useParams()
    const navigate = useNavigate()

    const token = useRoomStore((state) => state.token)
    const getRoom = useRoomStore((state) => state.getRoom)
    const rooms = useRoomStore((state) => state.rooms)

    const [form, setForm] = useState([])

    const [selectedRoom, setSelectedRoom] = useState(null)
    const [selectedBookingId, setSelectedBookingId] = useState(null)

    const [showPopup, setShowPopup] = useState(false)

    const { i18n } = useTranslation();

    const fetchBooking = async () => {
        try {
            const res = await readBooking(token, id)
            console.log(res)
            setForm(res.data) //รับ data ที่ read มา set ในตัวแปล form
        } catch (err) {
            console.log("Error fetch data", err)
        }
    }

    useEffect(() => {
        getRoom(token)
        fetchBooking()
    }, [])

    const pairableRooms = [
        ["315", "316"],
        ["415", "416"],
        ["515", "516"],
        ["615", "616"],
    ]

    const formatDateTime = (dateString) => {
        if (!dateString) return "-"
        return dayjs(dateString).format("DD/MM/YYYY HH:mm:ss")
    }

    const formatDate = (dateString) => {
        if (!dateString) return "-"
        return dayjs(dateString).format("DD/MM/YYYY")
    }

    //เลือกห้อง
    const handleConfirm = async () => {
        if (!selectedRoom || !selectedBookingId) {
            toast.error(t('select_room_and_booking_before_confirm'));
            return
        }

        try {
            const res = await confirmBooking(token, selectedBookingId, selectedRoom)
            console.log(res)

            toast.success(t('booking_confirmed_success'));
            setShowPopup(false)
            getRoom(token)
            navigate("/front")
        } catch (err) {
            console.error("Error confirming booking:", err)
            toast.error(t('error_confirming_booking'));
        }
    }

    //CheckIn
    const handleCheckIn = async (bookingId) => {
        if (window.confirm(t('common:are_you_sure'))) {
            try {
                await checkIn(token, bookingId)
                toast.success(t("check_in_success"))
                fetchBooking()
                getRoom(token)
            } catch (err) {
                console.log("Error check-in", err)
                toast.error(t("check_in_failed"))
            }
        }
    }

    //CheckOut
    const handleCheckOut = async (bookingId, roomId, roomNumber, floor) => {
        if (window.confirm(t('common:are_you_sure'))) {
            try {
                const res = await checkOut(token, bookingId)
                toast.success(t("check_out_success"))
                navigate("/front/cleaning-request", { state: { roomId, roomNumber, floor } }) // ส่งข้อมูลห้องไปหน้า cleaning
            } catch (err) {
                console.log("Error check-out", err)
                toast.error(t("check_out_failed"))
            }
        }
    }


    return (
        <div className="container mx-auto mt-10 p-4 bg-white shadow-md">
            <div className="mb-4 text-center px-50 font-bold text-xl">{t('select_room_for_customer')}</div>
            <ul className="space-y-4">
                {form ? (
                    <li className="p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50">
                        <p><strong>{t('booking_id')}:</strong> {form.bookingId || "-"}</p>
                        <p><strong>{t('room_type')}:</strong> {form.roomType ? (i18n.language === 'th' ? form.roomType.name_th : form.roomType.name_en) : '-'}</p>
                        <p><strong>{t('room_price')}:</strong> {form.roomType?.price || 0} {t('baht')}</p>
                        <p><strong>{t('customer_name')}:</strong> {`${form.customer?.user?.prefix || ""} ${form.customer?.user?.userName || ""} ${form.customer?.user?.userSurName || ""}`.trim()}</p>
                        <p><strong>{t('customer_phone')}:</strong> {form.customer?.user?.userNumPhone || "-"}</p>
                        <p><strong>{t('customer_email')}:</strong> {form.customer?.user?.userEmail || "-"}</p>
                        <p><strong>{t('license_plate')}:</strong> {form.customer?.user?.licensePlate || "-"}</p>
                        <p><strong>{t('number_of_guests')}:</strong> {form.count || "-"} {t('people')}</p>
                        <p><strong>{t('check_in_time')}:</strong> {formatDate(form.checkInDate)}</p>
                        <p><strong>{t('check_out_time')}:</strong> {formatDate(form.checkOutDate)}</p>
                        <p><strong>{t('booking_time')}:</strong> {formatDateTime(form.createdAt)}</p>

                        {/* แสดงรายการเสริม */}
                        <p><strong>{t('additional_items')}:</strong></p>
                        {form.BookingAddonListRelation?.length > 0 ? (
                            form.BookingAddonListRelation.map((addonRel, index) => (
                                <div key={addonRel.bookingAddonListId} className="ml-4 p-2 bg-gray-100 rounded-lg">
                                    {addonRel.bookingAddonList?.BookingAddon?.length > 0 ? (
                                        addonRel.bookingAddonList.BookingAddon.map((addonItem) => (
                                            <p key={addonItem.addonId}>
                                                - {addonItem.addon?.addonName} ({addonItem.quantity} x {addonItem.addon?.price} {t('baht')})
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">{t('no_additional_items')}</p>
                                    )}
                                    <p className="font-bold">{t('total_addon_price')}: {addonRel.price} {t('baht')}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">{t('no_additional_items')}</p>
                        )}


                        {/* เพิ่มราคาทั้งหมดและเฉพาะ Addons */}
                        <p><strong>{t('total_addon_price')}:</strong> {form.totalAddon || 0} {t('baht')}</p>
                        <p><strong>{t('total_price')}:</strong> {form.total || 0} {t('baht')}</p>


                        <div>
                            {form.customer?.customerTypeId === 2 &&
                                form.customer?.images?.length > 0 && (
                                    <img
                                        src={form.customer.images[0]?.url || ""}
                                        alt="Customer Image"
                                        className="w-32 h-32 rounded-lg shadow-md border"
                                        onError={(e) => e.target.style.display = 'none'} // ซ่อนรูปถ้าโหลดไม่ได้
                                    />
                                )}
                        </div>


                        <div className="flex gap-2 mt-4">
                            {/* ปุ่มกลับหน้าแรก */}
                            <Link
                                to="/front"
                                className="bg-blue-500 text-white rounded-md p-2 shadow-md hover:scale-105 hover:-translate-y-1 transition duration-200 flex items-center justify-center w-fit"
                            >
                                <Undo2 />
                            </Link>

                            {/* ปุ่มเลือกห้อง จะกดได้เฉพาะ bookingStatusId = 1  เพราะ 1 คือ "รอยืนยัน" */}
                            <button
                                onClick={() => {
                                    setSelectedBookingId(form.bookingId)
                                    setShowPopup(true)
                                }}
                                className={`rounded-md p-2 shadow-md transition duration-200 
                                        ${form.bookingStatus === 'RESERVED'
                                        ? "bg-yellow-500 hover:scale-105 hover:-translate-y-1 cursor-pointer"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                disabled={form.bookingStatus !== 'RESERVED'}
                            >
                                {t('select_room')}
                            </button>

                            {/* ปุ่มเลือกห้อง จะกดได้เฉพาะ bookingStatusId = 2 เพราะ 2 คือ "อนุมัติแล้ว" รอทำการ checkIn ต่อ */}
                            {form.bookingStatus === 'APPROVED' && (
                                <button
                                    className={`rounded-md p-2 shadow-md transition duration-200
                                        ${form.bookingStatus === 'APPROVED'
                                        ? "bg-blue-500 hover:scale-105 hover:-translate-y-1 text-white"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                    onClick={() => handleCheckIn(form.bookingId)}
                                    disabled={form.bookingStatus !== 'APPROVED'} // ปิดการใช้งานเมื่อไม่ใช่สถานะ 2
                                >
                                    {t('check_in')}
                                </button>
                            )}

                            {/* ปุ่มเลือกห้อง จะกดได้เฉพาะ bookingStatudId = 3 เพราะ 3 คือ "checkIn" รอทำการ checkOutและแจ้งทำความสะอาด */}
                            {form.bookingStatus === 'CHECKED_IN' && (
                                <button
                                    className={`rounded-md p-2 shadow-md transition duration-200
                                        ${form.bookingStatus === 'CHECKED_IN'
                                        ? "bg-blue-500 hover:scale-105 hover:-translate-y-1 text-white"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                    onClick={() => handleCheckOut(form.bookingId, form.Room.roomId, form.Room.roomNumber, form.Room.floor)}
                                    disabled={form.bookingStatus !== 'CHECKED_IN'}
                                >
                                    {t('check_out')}
                                </button>
                            )}


                            {/* ปุ่มใหม่ ลิงก์ไปหน้าอ่านการจอง */}

                            {/* ไว้ลิ้งค์ไปหน้าที่จะนำข้อมูลไปสร้างเป็นใบจริงๆพร้อมปริ้นท์ได้ (ถ้าทำทันนะ) */}
                            {/* <Link
                                to={`/front/readbooking/${form.bookingId}`}
                                className="bg-purple-500 text-white rounded-md p-2 shadow-md hover:scale-105 hover:-translate-y-1 transition duration-200"
                                onClick={() => console.log(`Go to readbooking/${form.bookingId}`)}
                            >
                                อ่านการจอง
                            </Link> */}


                            {/* <button
                                to={`/front/readbooking/${form.bookingId}`}
                                className="bg-red-500 text-white rounded-md p-2 shadow-md hover:scale-105 hover:-translate-y-1 transition duration-200"
                                onClick={() => console.log(`ยกเลิก`)}
                            >
                                ยกเลิกการจอง
                            </button> */}
                        </div>

                    </li>
                ) : (
                    <li className="text-center w-full py-6 border border-gray-300">
                        {t('no_booking_data')}
                    </li>
                )}


            </ul>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-20 rounded-lg shadow-lg">
                        <h2 className="text-lg font-bold mb-4">
                            {t('select_room')}
                            {selectedRoom && (
                                <span className="text-blue-700 ml-2">
                                    {t('selected_room_number')} {rooms.find(r => r.roomId === selectedRoom)?.roomNumber}

                                    {/* ตรวจสอบว่าห้องที่เลือกมีคู่หรือไม่ */}
                                    {rooms.find(r => r.roomId === selectedRoom)?.roomTypeId === 3 &&
                                        (() => {
                                            const selectedRoomNumber = rooms.find(r => r.roomId === selectedRoom)?.roomNumber;
                                            const pair = pairableRooms.find(pair => pair.includes(selectedRoomNumber));
                                            const pairedRoom = pair?.find(num => num !== selectedRoomNumber);

                                            return pairedRoom ? ` ${t('and_its_pair')} ${pairedRoom}` : "";
                                        })()
                                    })
                                </span>
                            )}
                        </h2>



                        <div className="flex flex-wrap gap-4 mt-5">
                            {rooms.map((room, index) => {
                                let statusColor = "";
                                // ใช้ room.roomStatus เป็น string แทน roomStatusId
                                switch (room.roomStatus) {
                                    case 'AVAILABLE':
                                        statusColor = statusColors.AVAILABLE;
                                        break;
                                    case 'OCCUPIED':
                                        statusColor = statusColors.OCCUPIED;
                                        break;
                                    case 'RESERVED':
                                        statusColor = statusColors.RESERVED;
                                        break;
                                    case 'CLEANING':
                                        statusColor = statusColors.CLEANING;
                                        break;
                                    case 'REPAIR':
                                        statusColor = statusColors.REPAIR;
                                        break;
                                    default:
                                        statusColor = "bg-black";
                                }

                                const ROOM_TYPE_LABEL = {
                                  SINGLE: 'เตียงเดี่ยว',
                                  DOUBLE: 'เตียงคู่',
                                  SIGNATURE: 'Signature',
                                };
                                const roomTypeName = ROOM_TYPE_LABEL[room.roomType] || "Unknown";
                                const isSelected = selectedRoom === room.roomId;
                                const roomNumber = room.roomNumber || "No Number";

                                // ตรวจสอบว่าห้องที่กำลังเรนเดอร์อยู่เป็นคู่ของห้องที่เลือกหรือไม่
                                const isPairSelected = selectedRoom
                                    && rooms.find(r => r.roomId === selectedRoom)?.roomTypeId === 3
                                    && pairableRooms.some(pair => pair.includes(roomNumber) && pair.includes(rooms.find(r => r.roomId === selectedRoom)?.roomNumber));

                                return (
                                    <button
                                        key={index}
                                        className={`flex flex-col items-center justify-center w-20 h-20 border rounded-lg shadow-md ${statusColor} hover:bg-opacity-80 transition duration-200 
                                                    ${room.roomStatus !== 'AVAILABLE' ? "opacity-50 cursor-not-allowed" : ""} 
                                                    {(isSelected || isPairSelected) ? "border-4 border-yellow-500 bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                                        onClick={() => room.roomStatus === 'AVAILABLE' && setSelectedRoom(room.roomId)}
                                        disabled={room.roomStatus !== 'AVAILABLE'}
                                    >
                                        {roomTypeName === "เตียงเดี่ยว" ? (
                                            <BedSingle size={32} className="text-white" />
                                        ) : roomTypeName === "เตียงคู่" ? (
                                            <BedDouble size={32} className="text-white" />
                                        ) : (
                                            <Bed size={32} className="text-white" />
                                        )}
                                        <p className="text-sm font-semibold text-white">{roomNumber}</p>
                                    </button>
                                )
                            })}

                            {/*แจ้งสี */}
                            <div className="flex justify item-center gap-2">
                                <p className="text-xs text-black mb-8 flex items-center gap-2">
                                    <Star size={20} className="text-green-500 " /> {t('available')}
                                </p>
                                <p className="text-xs text-black mb-8 flex items-center gap-2">
                                    <Star size={20} className="text-gray-500" /> {t('occupied')}
                                </p>
                                <p className="text-xs text-black mb-8 flex items-center gap-2">
                                    <Star size={20} className="text-yellow-500" /> {t('reserved')}
                                </p>
                                <p className="text-xs text-black mb-8 flex items-center gap-2">
                                    <Star size={20} className="text-blue-500" /> {t('cleaning_request')}
                                </p>
                                <p className="text-xs text-black mb-8 flex items-center gap-2">
                                    <Star size={20} className="text-red-500" /> {t('repair_request')}
                                </p>
                            </div>

                            {/* แจ้งไอคอนเตียง */}
                            <div className="flex justify item-center gap-2">
                                <p className="text-xs text-black mb-8 flex items-center gap-2">
                                    <BedSingle size={20} className="text-black" /> {t('single_bed')}
                                </p>
                                <p className="text-xs text-black mb-8 flex items-center gap-2">
                                    <BedDouble size={20} className="text-black" /> {t('double_bed')}
                                </p>
                                <p className="text-xs text-black mb-8 flex items-center gap-2">
                                    <Bed size={20} className="text-black" /> {t('signature_room')}
                                </p>
                            </div>

                        </div>

                        <div className="mt-4 flex justify-between">
                            {/* ปุ่มปิด Popup (อยู่ซ้ายสุด) */}
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                                onClick={() => setShowPopup(false)}
                            >
                                {t('close')}
                            </button>

                            <div className="flex space-x-2">
                                {/* ปุ่มยืนยัน */}
                                <button onClick={handleConfirm} className="px-4 py-2 bg-green-500 text-white rounded">
                                    {t('confirm')}
                                </button>

                                {/* ปุ่มยกเลิกการเลือกห้อง */}
                                <button
                                    className={`px-4 py-2 rounded transition ${selectedRoom ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                    onClick={() => setSelectedRoom(null)}
                                    disabled={!selectedRoom} // ปิดการใช้งานถ้ายังไม่ได้เลือกห้อง
                                >
                                    {t('cancel_room_selection')}
                                </button>
                            </div>
                        </div>



                    </div>
                </div>
            )}
        </div>
    )
}

export default BookingDetail
