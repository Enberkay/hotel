import React, { useState, useEffect } from "react"
import useRoomStore from "../../store/room-store"
import { createRoom, deleteRoom } from "../../api/room"
import { toast } from "react-toastify"

import { Link } from "react-router-dom"
import { Pencil, Trash } from 'lucide-react'
import UploadFile from "../shared/UploadFile"

const initialState = {
    roomNumber: "",
    roomStatusId: "",
    roomTypeId: "",
    floor: ""

}

const AdminRoomForm = () => {

    const token = useRoomStore((state) => state.token)
    const getRoomType = useRoomStore((state) => state.getRoomType)
    const roomtypes = useRoomStore((state) => state.roomTypes)
    const getRoom = useRoomStore((state) => state.getRoom)
    const rooms = useRoomStore((state) => state.rooms)
    const getRoomStatus = useRoomStore((state) => state.getRoomStatus)
    const roomStatuses = useRoomStore((state) => state.roomStatuses)


    const [form, setForm] = useState({
        roomNumber: "",
        roomStatusId: "",
        roomTypeId: "",
        floor: ""
    })

    useEffect(() => {
        getRoomType(token)
        getRoomStatus(token)
        getRoom(token)
    }, [])

    const handleOnChange = (e) => {
        console.log(e.target.name, e.target.value)
        // ...form คือ operator spread
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        //check data in form 
        if (!form.roomNumber) {
            return toast.error("กรุณากรอกข้อมูลให้ครบถ้วน")
        }

        if (form.roomNumber.length < 3) {
            return toast.error("มึงหลอนเบาะ ใส่ให้ครบ 3 ตัวดิ")
        }

        if (form.roomNumber.length > 3) {
            return toast.error("มึงหลอนเบาะ  มีแค่ 3 ตัว")
        }

        if (form.roomNumber[0] != form.floor) {
            return toast.error("ชั้นกับเลขห้องไม่ตรงกัน")
        }

        if (form.roomNumber[1] == "0" && form.roomNumber[2] == "0") {
            return toast.error("ไม่ลงท้ายด้วย 0")
        }

        try {
            const res = await createRoom(token, form)
            console.log(res)
            setForm(initialState)
            getRoom(token)
            toast.success(`เพิ่มห้อง ${res.data.roomNumber} สำเร็จ`)
        } catch (err) {
            console.log(err)
            const errMag = err.response?.data?.message
            toast.error(errMag)
        }
    }

    const handleDelete = async (roomId) => {
        if (window.confirm("Are you sure?")) {
            // console.log("ลบ " + roomId)
            try {
                const res = await deleteRoom(token, roomId)
                console.log(res)
                toast.success("Deleted")
                getRoom(token)
            } catch (err) {
                console.log(err)
                const errMag = err.response?.data?.message
                toast.error(errMag)
            }
        }
    }



    return (
        <div className="container mx-auto p-4 bg-white shadow-md" >

            <form onSubmit={handleSubmit} className="space-y-6">
                <h1 className="text-2xl font-bold mb-4">เพิ่มข้อมูลห้อง</h1>

                <div>
                    <label htmlFor="roomNumber" className="block text-sm font-semibold">เลขห้อง</label>
                    <input
                        type="number"
                        className="border rounded-md p-2 w-full mt-1"
                        value={form.roomNumber}
                        onChange={handleOnChange}
                        placeholder="เลขห้อง"
                        name="roomNumber"
                        id="roomNumber"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="floor" className="block text-sm font-semibold">ชั้น</label>
                    <select
                        className="border rounded-md p-2 w-full mt-1"
                        name="floor"
                        onChange={handleOnChange}
                        required
                        value={form.floor}
                        id="floor"
                    >
                        <option value="" disabled>Select Floor</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="roomStatusId" className="block text-sm font-semibold">สถานะห้อง</label>
                    <select
                        className="border rounded-md p-2 w-full mt-1"
                        name="roomStatusId"
                        onChange={handleOnChange}
                        required
                        value={form.roomStatusId}
                        id="roomStatusId"
                    >
                        <option value="" disabled>Select Status</option>
                        {roomStatuses.map((item, index) => (
                            <option key={index} value={item.roomStatusId}>
                                {item.roomStatusName}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="roomTypeId" className="block text-sm font-semibold">ประเภทห้อง</label>
                    <select
                        className="border rounded-md p-2 w-full mt-1"
                        name="roomTypeId"
                        onChange={handleOnChange}
                        required
                        value={form.roomTypeId}
                        id="roomTypeId"
                    >
                        <option value="" disabled>Select Type</option>
                        {roomtypes.map((item, index) => (
                            <option key={index} value={item.roomTypeId}>
                                {item.roomTypeName}
                            </option>
                        ))}
                    </select>
                </div>

                <hr className="my-6" />

                <button
                    className="bg-blue-500 text-white p-3 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
                >
                    เพิ่มห้อง
                </button>
            </form>


            <table className="table w-full border border-gray-300 border-collapse">
                <thead>
                    <tr className="bg-gray-200 border border-gray-300">
                        <th scope="col" className="border border-gray-300 px-4 py-2">No</th>
                        <th scope="col" className="border border-gray-300 px-4 py-2">เลขห้อง</th>
                        <th scope="col" className="border border-gray-300 px-4 py-2">ชั้น</th>
                        <th scope="col" className="border border-gray-300 px-4 py-2">สถานะ</th>
                        <th scope="col" className="border border-gray-300 px-4 py-2">ประเภทห้อง</th>
                        <th scope="col" className="border border-gray-300 px-4 py-2">จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.length > 0 ? (
                        rooms.map((item, index) =>

                        (
                            <tr key={index} className="border border-gray-300 text-center">
                                <th scope="row" className="border border-gray-300 px-4 py-2">{index + 1}</th>
                                <td className="border border-gray-300 px-4 py-2">{item.roomNumber}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.floor}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.roomStatus.roomStatusName}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.roomType.roomTypeName}</td>
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
                            <td colSpan="6" className="text-center py-6 border border-gray-300 text-gray-500">
                                ไม่มีข้อมูลห้อง
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>
    )
}

export default AdminRoomForm