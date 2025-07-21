import React, { useEffect, useState } from "react"
import useRoomStore from "../../store/room-store"
import { createRoomType, readRoomType, updateRoomType } from "../../api/roomType"
import { toast } from "react-toastify"
import { Pencil } from "lucide-react"
import { useTranslation } from 'react-i18next';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const RoomTypeForm = () => {
    const token = useRoomStore((state) => state.token)
    const getRoomType = useRoomStore((state) => state.getRoomType)
    const roomTypes = useRoomStore((state) => state.roomTypes)
    const { i18n, t } = useTranslation(['room', 'common']);

    // Zod schema
    const schema = z.object({
        roomTypeName: z.string().min(1, { message: t('common:error_required') }),
        price: z.preprocess((val) => Number(val), z.number().positive({ message: t('common:error_required') })),
    });

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        mode: 'onTouched',
        defaultValues: {
            roomTypeName: '',
            price: '',
        }
    });

    const [editForm, setEditForm] = useState(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    useEffect(() => {
        getRoomType(token)
    }, [])

    const onSubmit = async (data) => {
        try {
            const res = await createRoomType(token, data)
            reset()
            getRoomType(token)
            toast.success(t("add_room_type_success", { roomTypeName: res.data.roomTypeName }))
        } catch (err) {
            toast.error(t("common:error_update"))
        }
    }

    const handleEditClick = async (id) => {
        try {
            const res = await readRoomType(token, id)
            setEditForm(res.data)
            setIsEditOpen(true)
        } catch (err) {
            toast.error(t("common:error_update"))
        }
    }

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value })
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        if (!editForm.roomTypeName || !editForm.price) {
            return toast.error(t("common:error_required"))
        }
        if (isNaN(Number(editForm.price)) || Number(editForm.price) <= 0) {
            return toast.error(t("common:error_required"))
        }
        try {
            await updateRoomType(token, { ...editForm, price: Number(editForm.price) })
            getRoomType(token)
            setIsEditOpen(false)
            toast.success(t("edit_room_type_success"))
        } catch (err) {
            toast.error(t("common:error_update"))
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{t('room_type_management')}</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium">{t('room_type_name_en')}</label>
                        <input type="text" {...register('roomTypeName')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                        {errors.roomTypeName && <p className="text-red-500 text-xs mt-1">{errors.roomTypeName.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">{t('price')}</label>
                        <input type="number" {...register('price')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" disabled={isSubmitting}>{isSubmitting ? t('common:loading') : t('add_room_type')}</button>
                </form>
            </div>

            {isEditOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{t('edit_room_type')}</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">{t('room_type_name_en')}</label>
                                <input type="text" name="roomTypeName" value={editForm.roomTypeName} onChange={handleEditChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">{t('price')}</label>
                                <input type="number" name="price" value={editForm.price} onChange={handleEditChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setIsEditOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md">{t('common:cancel')}</button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">{t('common:save')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-2 px-4 text-left">{t('room_type_name_en')}</th>
                                <th className="py-2 px-4 text-left">{t('price')}</th>
                                <th className="py-2 px-4 text-left">{t('common:actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roomTypes.map((type) => (
                                <tr key={type.roomTypeId} className="border-b">
                                    <td className="py-2 px-4">{i18n.language === 'th' ? type.roomTypeName_th : type.roomTypeName_en}</td>
                                    <td className="py-2 px-4">{type.price}</td>
                                    <td className="py-2 px-4">
                                        <button onClick={() => handleEditClick(type.roomTypeId)} className="text-blue-500 hover:underline">
                                            <Pencil size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default RoomTypeForm;
