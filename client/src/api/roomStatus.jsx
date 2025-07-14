import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export const createRoomStatus = async (token, form) => {
    return axios.post(`${API_URL}//room-statuses`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listRoomStatus = async (token) => {
    return axios.get(`${API_URL}//room-statuses`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
