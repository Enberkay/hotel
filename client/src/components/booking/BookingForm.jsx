import React, { useEffect, useState } from "react"
import useAuthStore from "../../store/auth-store";
import useRoomStore from "../../store/room-store";
import useAddonStore from "../../store/addon-store";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { toast } from "react-toastify"
import { createBooking } from "../../api/booking"
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"
import Select from "react-select"
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const BookingForm = () => {
  const { t, i18n } = useTranslation(['booking', 'room', 'user', 'common']);
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const profile = useAuthStore((state) => state.profile)
  const getProfile = useAuthStore((state) => state.getProfile)
  const getRoomType = useRoomStore((state) => state.getRoomType)
  const roomtypes = useRoomStore((state) => state.roomTypes)
  const getAddon = useAddonStore((state) => state.getAddon)
  const addons = useAddonStore((state) => state.addons)

  // Zod schema
  const schema = z.object({
    checkInDate: z.date({ required_error: t('common:error_required') }),
    checkOutDate: z.date({ required_error: t('common:error_required') })
      .refine((val, ctx) => val && ctx.parent.checkInDate && dayjs(val).isAfter(dayjs(ctx.parent.checkInDate)), {
        message: t('check_out_after_check_in'),
      }),
    roomTypeId: z.string().min(1, { message: t('error_select_room_type') }),
    count: z.string()
      .refine(val => parseInt(val, 10) >= 1, { message: t('common:error_required') })
      .refine((val, ctx) => {
        // max guest: roomTypeId === 3 ? 4 : 2
        const max = ctx.parent.roomTypeId === '3' ? 4 : 2;
        return parseInt(val, 10) <= max;
      }, { message: t('error_guest_count_max') }),
    licensePlate: z.string().optional(),
  });

  const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      checkInDate: null,
      checkOutDate: null,
      roomTypeId: '',
      count: '1',
      licensePlate: '',
    }
  });

  const [selectedOption, setSelectedOption] = useState(null)
  const [addonPrice, setAddonPrice] = useState([])
  const [selectedAddons, setSelectedAddons] = useState(null)

  useEffect(() => {
    getRoomType(token)
    getAddon(token)
    getProfile(token)
  }, [])

  // RoomType options
  const roomOptions = roomtypes.map((roomtype) => ({
    value: roomtype.roomTypeId,
    label: i18n.language === 'th' ? roomtype.name_th : roomtype.name_en,
    price: roomtype.price,
  }))

  // Addon options
  const addonOptions = addons.map((addon) => ({
    value: addon.addonId,
    label: i18n.language === 'th' ? addon.addonName_th : addon.addonName_en,
    price: addon.price,
  }))

  // Handle RoomType select
  const handleOnChangeRoomType = (selected) => {
    setSelectedOption(selected)
    setValue('roomTypeId', selected.value)
    setAddonPrice([])
    setSelectedAddons(null)
  }

  // Handle Addon add/remove
  const handleAdd = () => {
    if (!selectedAddons) return
    if (!addonPrice.some((item) => item.value === selectedAddons.value)) {
      setAddonPrice([...addonPrice, selectedAddons])
      setSelectedAddons(null)
    }
  }
  const handleRemove = (addonId) => {
    setAddonPrice(addonPrice.filter((addon) => addon.value !== addonId))
  }

  // Calculate prices
  const checkIn = watch('checkInDate') ? new Date(watch('checkInDate')) : null
  const checkOut = watch('checkOutDate') ? new Date(watch('checkOutDate')) : null
  const daysBooked = checkIn && checkOut ? Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)) : 0
  const totalAddonPrice = addonPrice.reduce((sum, addons) => sum + addons.price, 0)
  const totalRoomPrice = roomtypes.find((room) => room.roomTypeId === (selectedOption?.value || ''))?.price || 0
  const roomTotal = Math.max(totalRoomPrice * daysBooked, 0)
  const totalBeforeDiscount = totalAddonPrice + roomTotal
  const discount = profile.Customer?.customerType?.discount || 0
  const totalPrice = Math.max(totalBeforeDiscount - discount, 0)

  // Addon payload
  const formAddons = addonPrice.map((addon) => ({ addonId: addon.value, quantity: 1 }))

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      checkInDate: data.checkInDate ? data.checkInDate.toISOString() : null,
      checkOutDate: data.checkOutDate ? data.checkOutDate.toISOString() : null,
      addon: formAddons,
    }
    try {
      await createBooking(token, payload)
      toast.success(t('booking_success'))
      navigate("/my-bookings")
    } catch (err) {
      toast.error(err.response?.data?.message)
    }
  }

  return (
    <div className="flex justify-center">
      <div className="mx-10 p-6 bg-white w-full lg:w-10/12 xl:w-8/12 max-w-6xl border shadow-md mt-24">
        <h2 className="text-2xl font-bold text-black text-center">
          {t('booking_management')}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-2 text-gray-700 text-sm md:text-base">
                {t('check_in_date')}
              </label>
              <Controller
                control={control}
                name="checkInDate"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    minDate={new Date()}
                    placeholderText={t('select_check_in_date')}
                    dateFormat="dd/MM/yyyy"
                    className="p-3 border rounded-md shadow-sm w-full bg-light-yellow"
                    popperPlacement="bottom-start"
                    autoFocus
                  />
                )}
              />
              {errors.checkInDate && <p className="text-red-500 text-xs mt-1">{t(errors.checkInDate.message)}</p>}
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-gray-700 text-sm md:text-base">
                {t('check_out_date')}
              </label>
              <Controller
                control={control}
                name="checkOutDate"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    minDate={watch('checkInDate') || new Date()}
                    placeholderText={t('select_check_out_date')}
                    dateFormat="dd/MM/yyyy"
                    className="p-3 border rounded-md shadow-sm w-full bg-light-yellow"
                    popperPlacement="bottom-start"
                  />
                )}
              />
              {errors.checkOutDate && <p className="text-red-500 text-xs mt-1">{t(errors.checkOutDate.message)}</p>}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t('room_type')}
            </label>
            <Controller
              control={control}
              name="roomTypeId"
              render={({ field }) => (
                <Select
                  options={roomOptions}
                  value={roomOptions.find(opt => opt.value === field.value) || null}
                  onChange={opt => {
                    field.onChange(opt.value)
                    handleOnChangeRoomType(opt)
                  }}
                  placeholder={t('select_room_type')}
                  className="mb-2 w-[200px]"
                  classNamePrefix="select"
                />
              )}
            />
            {errors.roomTypeId && <p className="text-red-500 text-xs mt-1">{t(errors.roomTypeId.message)}</p>}
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
              {...register('count')}
              className="w-400px p-3 border rounded-md shadow-sm"
            />
            {errors.count && <p className="text-red-500 text-xs mt-1">{t(errors.count.message)}</p>}
          </div>

          {/* Addon Select (optional, logic เดิม) */}
          <div className="mt-4">
            <label className="block text-gray-700 font-medium mb-1">{t('addon:addon_management')}</label>
            <Select
              options={addonOptions}
              value={selectedAddons}
              onChange={setSelectedAddons}
              placeholder={t('addon:select_addons')}
              className="mb-2 w-[300px]"
              classNamePrefix="select"
              isClearable
            />
            <button type="button" onClick={handleAdd} className="ml-2 px-3 py-1 bg-blue-500 text-white rounded">{t('addon:add')}</button>
            <div className="mt-2">
              {addonPrice.map((addon) => (
                <div key={addon.value} className="flex items-center gap-2 mb-1">
                  <span>{addon.label} ({addon.price.toLocaleString()} {t('common:currency_thb')})</span>
                  <button type="button" onClick={() => handleRemove(addon.value)} className="text-red-500">{t('common:delete')}</button>
                </div>
              ))}
            </div>
          </div>

          {/* License Plate (optional) */}
          <div className="mb-4 mt-4">
            <label className="block text-gray-700">{t('license_plate')}</label>
            <input
              type="text"
              {...register('licensePlate')}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder={t('license_plate')}
            />
          </div>

          {/* Summary */}
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">{t('booking_summary')}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t('room:price')}</span>
                <span>{totalRoomPrice.toLocaleString()} {t('common:currency_thb')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('number_of_nights')}</span>
                <span>{daysBooked}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>{t('total_room_price')}</span>
                <span>{roomTotal.toLocaleString()} {t('common:currency_thb')}</span>
              </div>
              <hr className="my-2" />
              <h4 className="font-semibold mt-2">{t('addon:selected_addons')}</h4>
              {addonPrice && addonPrice.length > 0 ? (
                addonPrice.map(addon => (
                  <div key={addon.value} className="flex justify-between">
                    <span>{addon.label}</span>
                    <span>{addon.price.toLocaleString()} {t('common:currency_thb')}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">{t('addon:no_addons_selected')}</p>
              )}
              <div className="flex justify-between font-bold mt-2">
                <span>{t('total_addon_price')}</span>
                <span>{totalAddonPrice.toLocaleString()} {t('common:currency_thb')}</span>
              </div>
              <hr className="my-4 border-t-2 border-gray-300" />
              <div className="flex justify-between text-2xl font-bold text-blue-600">
                <span>{t('grand_total')}</span>
                <span>{totalPrice.toLocaleString()} {t('common:currency_thb')}</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-[var(--color-brown)] hover:bg-[var(--color-light-yellow)] text-white font-bold py-2 px-6 rounded-md shadow-md"
              style={{'--color-brown':'#6A503D','--color-light-yellow':'#FEF6B3'}}
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common:loading') : t('confirm_booking')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingForm
