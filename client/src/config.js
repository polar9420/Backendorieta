import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "https://coderbackend-livy.onrender.com/api",
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true,
})

export { axiosInstance }
