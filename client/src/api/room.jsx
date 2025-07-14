import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

//เพิ่มห้อง (Create Room)
export const createRoom = async (token, form) => {
    return axios.post(`${API_URL}/rooms`, form, {
        headers: { Authorization: `Bearer ${token}` }
    })
}

//ดูรายการห้องทั้งหมด (List Rooms)
export const listRoom = async (token) => {
    return axios.get(`${API_URL}/rooms`, {
        headers: { Authorization: `Bearer ${token}` }
    })
}

//ดูรายละเอียดห้องตาม ID (Read Room by ID)
export const readRoom = async (token, id) => {
    return axios.get(`${API_URL}/rooms/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
}

//ลบห้อง (Delete Room)
export const deleteRoom = async (token, id) => {
    return axios.delete(`${API_URL}/rooms/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
}

//อัปเดตห้อง (Update Room)
export const updateRoom = async (token, id, form) => {
    return axios.put(`${API_URL}/rooms/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
    })
}

//เปลี่ยนสถานะห้อง (Change Room Status)
export const changeRoomStatus = async (token, roomIds, roomStatusId) => {
    console.log(roomIds, roomStatusId)
    return axios.post(`${API_URL}/rooms-status`,
        { roomIds, roomStatusId },
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    )
}

//จัดกลุ่มห้อง (Group Room)
export const groupRoom = async (token, { roomId1, roomId2 }) => {
    return axios.post(
        `${API_URL}/rooms/group`,
        { roomId1, roomId2 },
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    )
}

//ยกเลิกการจัดกลุ่มห้อง (Ungroup Room)
export const ungroupRoom = async (token, { roomId1, roomId2 }) => {
    return axios.post(
        `${API_URL}/rooms/ungroup`,
        { roomId1, roomId2 },
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    )
}
