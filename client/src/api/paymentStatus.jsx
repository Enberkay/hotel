import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export const createPaymentStatus = async (token, form) => {
    return axios.post(`${API_URL}/payment-statuses`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listPaymentStatus = async (token) => {
    return axios.get(`${API_URL}/payment-statuses`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}