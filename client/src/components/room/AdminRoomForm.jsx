import React, { useEffect } from "react";
import useRoomStore from "../../store/room-store";
import useAuthStore from "../../store/auth-store";
import { createRoom, deleteRoom } from "../../api/room";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const roomFormSchema = z
  .object({
    roomNumber: z
      .string()
      .min(3, { message: "room_number_too_short" })
      .max(3, { message: "room_number_too_long" })
      .regex(/^\d{3}$/, { message: "room_number_invalid_format" }),
    floor: z.string().min(1, { message: "select_floor" }),
    roomStatusId: z.string().min(1, { message: "select_status" }),
    roomType: z.enum(['SINGLE', 'DOUBLE', 'SIGNATURE'], { message: "select_type" }),
  })
  .refine((data) => data.roomNumber[0] === data.floor, {
    message: "floor_and_room_number_mismatch",
    path: ["roomNumber"],
  })
  .refine(
    (data) =>
      !(
        data.roomNumber &&
        data.roomNumber[1] === "0" &&
        data.roomNumber[2] === "0"
      ),
    {
      message: "room_number_cannot_end_with_zero",
      path: ["roomNumber"],
    }
  );

const ROOM_TYPE_ENUM = [
  { value: 'SINGLE', label: 'เตียงเดี่ยว' },
  { value: 'DOUBLE', label: 'เตียงคู่' },
  { value: 'SIGNATURE', label: 'Signature' },
];

const ROOM_TYPE_LABEL = {
  SINGLE: 'เตียงเดี่ยว',
  DOUBLE: 'เตียงคู่',
  SIGNATURE: 'Signature',
};

const AdminRoomForm = () => {
  const { t } = useTranslation();
  const token = useAuthStore((state) => state.token);
  const getRoomType = useRoomStore((state) => state.getRoomType);
  const roomtypes = useRoomStore((state) => state.roomTypes);
  const getRoom = useRoomStore((state) => state.getRoom);
  const rooms = useRoomStore((state) => state.rooms);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      roomNumber: "",
      roomStatusId: "",
      roomType: "",
      floor: "",
    },
  });

  useEffect(() => {
    getRoomType(token);
    getRoom(token);
    setFocus("roomNumber");
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await createRoom(token, data);
      reset();
      getRoom(token);
      toast.success(
        t("room_added_successfully", { roomNumber: res.data.roomNumber })
      );
    } catch (err) {
      const errMag = err.response?.data?.message;
      toast.error(errMag);
    }
  };

  const handleDelete = async (roomId) => {
    if (window.confirm(t("confirm_delete"))) {
      try {
        const res = await deleteRoom(token, roomId);
        toast.success(t("room_deleted"));
        getRoom(token);
      } catch (err) {
        const errMag = err.response?.data?.message;
        toast.error(errMag);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">{t("add_room_data")}</h1>

        <div>
          <label htmlFor="roomNumber" className="block text-sm font-semibold">
            {t("room_number")}
          </label>
          <input
            type="number"
            className={`border rounded-md p-2 w-full mt-1 ${
              errors.roomNumber ? "border-red-500" : ""
            }`}
            placeholder={t("room_number")}
            id="roomNumber"
            autoFocus
            {...register("roomNumber")}
          />
          {errors.roomNumber && (
            <p className="text-red-500 text-xs mt-1">
              {t(errors.roomNumber.message)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="floor" className="block text-sm font-semibold">
            {t("floor")}
          </label>
          <select
            className={`border rounded-md p-2 w-full mt-1 ${
              errors.floor ? "border-red-500" : ""
            }`}
            id="floor"
            {...register("floor")}
          >
            <option value="" disabled>
              {t("select_floor")}
            </option>
            <option value="3">{t("floor_3")}</option>
            <option value="4">{t("floor_4")}</option>
            <option value="5">{t("floor_5")}</option>
            <option value="6">{t("floor_6")}</option>
          </select>
          {errors.floor && (
            <p className="text-red-500 text-xs mt-1">
              {t(errors.floor.message)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="roomStatusId" className="block text-sm font-semibold">
            {t("room_status")}
          </label>
          <select
            className={`border rounded-md p-2 w-full mt-1 ${
              errors.roomStatusId ? "border-red-500" : ""
            }`}
            id="roomStatusId"
            {...register("roomStatusId")}
          >
            <option value="" disabled>
              {t("select_status")}
            </option>
            <option value="AVAILABLE">{t('available')}</option>
            <option value="OCCUPIED">{t('occupied')}</option>
            <option value="RESERVED">{t('reserved')}</option>
            <option value="CLEANING">{t('cleaning')}</option>
            <option value="REPAIR">{t('repair')}</option>
          </select>
          {errors.roomStatusId && (
            <p className="text-red-500 text-xs mt-1">
              {t(errors.roomStatusId.message)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="roomType" className="block text-sm font-semibold">ประเภทห้อง</label>
          <select id="roomType" {...register("roomType")}
            className={`border rounded-md p-2 w-full ${errors.roomType ? 'border-red-500' : ''}`}
          >
            <option value="">เลือกประเภทห้อง</option>
            {ROOM_TYPE_ENUM.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
          {errors.roomType && (
            <p className="text-red-500 text-xs mt-1">{t(errors.roomType.message)}</p>
          )}
        </div>

        <hr className="my-6" />

        <button
          className="bg-blue-500 text-white p-3 rounded-md shadow-md hover:bg-blue-600 transition duration-200 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("please_wait") : t("add_room")}
        </button>
      </form>

      <table className="table w-full border border-gray-300 border-collapse mt-8">
        <thead>
          <tr className="bg-gray-200 border border-gray-300">
            <th scope="col" className="border border-gray-300 px-4 py-2">
              {t("no")}
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2">
              {t("room_number")}
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2">
              {t("floor")}
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2">
              {t("status")}
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2">
              {t("room_type")}
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2">
              {t("manage")}
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(rooms) && rooms.length > 0 ? (
            rooms.map((item, index) => (
              <tr key={index} className="border border-gray-300 text-center">
                <th scope="row" className="border border-gray-300 px-4 py-2">
                  {index + 1}
                </th>
                <td className="border border-gray-300 px-4 py-2">
                  {item.roomNumber}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.floor}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.roomStatus.roomStatusName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {ROOM_TYPE_LABEL[item.roomType]}
                </td>
                <td className="px-4 py-2 flex justify-center gap-2">
                  <Link
                    to={"/admin/rooms/" + item.roomId}
                    className="bg-yellow-500 rounded-md p-2 shadow-md hover:scale-105 hover:-translate-y-1 transition duration-200"
                  >
                    <Pencil />
                  </Link>
                  <button
                    className="bg-red-500 rounded-md p-2 shadow-md hover:scale-105 hover:-translate-y-1 transition duration-200"
                    onClick={() => handleDelete(item.roomId)}
                  >
                    <Trash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="text-center py-6 border border-gray-300 text-gray-500"
              >
                {t("no_room_data")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRoomForm;
