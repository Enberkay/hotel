import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export const createAddon = async (token, form) => {
    return axios.post(`${API_URL}/addons`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listAddon = async (token) => {
    return axios.get(`${API_URL}/addons`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const readAddon = async (token, id) => {
    return axios.get(`${API_URL}/addons/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateAddon = async (token, id, form) => {
    return axios.put(`${API_URL}/addons/${id}`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const removeAddon = async (token, id) => {
    return axios.delete(`${API_URL}/addons/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
