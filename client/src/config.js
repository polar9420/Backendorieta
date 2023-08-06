import axios from "axios"

const axiosInstance = axios.create({
  baseURL: import.meta.env.API_URL,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
})

export { axiosInstance }
