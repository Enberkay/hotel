import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL // ดึงค่าจาก .env

export const createBooking = async (token, form) => {
    // form ต้องมี roomType เป็น string enum ('SINGLE', 'DOUBLE', 'SIGNATURE')
    return axios.post(`${API_URL}/bookings`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listBooking = async (token) => {
    return axios.get(`${API_URL}/bookings`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const readBooking = async (token, id) => {
    return axios.get(`${API_URL}/bookings/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const confirmBooking = async (token, id, roomId) => {
    console.log(id)
    return axios.put(`${API_URL}/bookings/${id}/confirm`, { roomId }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const checkIn = async (token, bookingId) => {
    return axios.put(`${API_URL}/bookings/${bookingId}/check-in`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const checkOut = async (token, bookingId) => {
    return axios.put(`${API_URL}/bookings/${bookingId}/check-out`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

