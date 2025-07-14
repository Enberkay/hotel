import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export const createCustomerType = async (token, form) => {
    return axios.post(`${API_URL}/customer-types`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listCustomerType = async (token) => {
    return axios.get(`${API_URL}/customer-types`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const readCustomerType = async (token, id) => {
    return axios.get(`${API_URL}/customer-types/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateCustomerType = async (token, id, form) => {
    return axios.put(`${API_URL}/customer-types/${id}`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const removeCustomerType = async (token, id) => {
    return axios.delete(`${API_URL}/customer-types/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
