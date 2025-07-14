import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export const myBookings = async (token) => {
    return axios.get(`${API_URL}/mybookings`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const bookingDetail = async (token, id) => {
    return axios.get(`${API_URL}/mybooking/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const cancelledBooking = async (token, bookingId) => {
    // console.log(bookingId)
    return await axios.put(
        `${API_URL}/mybooking/cancel`,
        { bookingId },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}
