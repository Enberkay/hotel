import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export const createPaymentMethod = async (token, form) => {
    return axios.post(`${API_URL}/payment-methods`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listPaymentMethod = async (token) => {
    return axios.get(`${API_URL}/payment-methods`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const readPaymentMethod = async (token, id) => {
    return axios.get(`${API_URL}/payment-methods/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updatePaymentMethod = async (token, id, form) => {
    return axios.put(`${API_URL}/payment-methods/${id}`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const removePaymentMethod = async (token, id) => {
    return axios.delete(`${API_URL}/payment-methods/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
