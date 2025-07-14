import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL // ดึงค่าจาก .env

export const createRepairStatus = async (token, form) => {
    return axios.post(`${API_URL}/repair-statuses`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listRepairStatus = async (token) => {
    return axios.get(`${API_URL}/repair-statuses`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}