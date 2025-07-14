import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export const createCleaningListItem = async (token, form) => {
    return axios.post(`${API_URL}/cleaning-list-item`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listCleaningListItem = async (token) => {
    return axios.get(`${API_URL}/cleaning-list-item`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const readCleaningListItem = async (token, id) => {
    return axios.get(`${API_URL}/cleaning-list-item/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateCleaningListItem = async (token, id, form) => {
    return axios.put(`${API_URL}/cleaning-list-item/${id}`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const removeCleaningListItem = async (token, id) => {
    return axios.delete(`${API_URL}/cleaning-list-item/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}