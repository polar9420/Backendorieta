import { createContext, useContext, useState, useEffect } from "react"
import { axiosInstance } from "../config"
import { useNavigate } from "react-router-dom"

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser debe estar dentro del proveedor UserProvider")
  }
  return context
}

const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    axiosInstance
      .get("/sessions/getuser")
      .then((res) => {
        setUser(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const login = (user) => {
    axiosInstance
      .post("/sessions/login", user)
      .then((res) => {
        setUser(res.data)
        navigate("/")
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  const logout = () => {
    axiosInstance
      .post("/sessions/logout")
      .then((res) => {
        setUser(null)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  const register = (user) => {
    axiosInstance
      .post("/sessions/register", user)
      .then((res) => {
        navigate("/auth/login")
      })
      .catch((err) => {
        console.log(err.message)
      })
  }
  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
