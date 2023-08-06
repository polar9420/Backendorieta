import { useState } from "react"
import { axiosInstance } from "../config"
import { toast } from "react-toastify"

const RecoveryPassword = () => {
  const [email, setEmail] = useState("")

  const handleChange = (e) => {
    setEmail(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    axiosInstance
      .get("/sessions/recovery-password", { params: { email } })
      .then((res) => {
        console.log(res.data)
        toast.success("Email enviado")
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-16 rounded shadow-2xl w-2/3">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">
          Recuperar Contraseña
        </h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-gray-800">Email</label>
            <input
              className="w-full p-2 border border-gray-300 rounded mb-6 outline-none"
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={handleChange}
            />

            <button className="bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded text-white focus:outline-none">
              Recuperar Contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RecoveryPassword
