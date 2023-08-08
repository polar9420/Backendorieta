import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "https://coderbackend-livy.onrender.com/api",
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
})

export { axiosInstance }
