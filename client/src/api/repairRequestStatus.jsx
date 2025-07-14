import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL // ดึงค่าจาก .env

export const createRepairRequestStatus = async (token, form) => {
    return axios.post(`${API_URL}/repair-request-statuses`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listRepairRequestStatus = async (token) => {
    return axios.get(`${API_URL}/repair-request-statuses`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}